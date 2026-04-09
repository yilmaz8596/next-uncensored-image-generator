"""
Text-to-image backend using Modal and a Hugging Face Z-Image model.

This module runs inside a Modal container where heavy ML dependencies
(PyTorch, diffusers, boto3) are available. Local static analysis (Pylance)
may not find those packages; the runtime imports are intentionally kept
inside methods that execute in the Modal environment.

High level flow:
- `ZImageServer.load()` loads the model into GPU memory (runs in Modal).
- `ZImageServer.generate_image()` accepts a `Req` payload, runs the
    pipeline to generate an image, saves it to a temporary file, and
    uploads it to S3.

Notes:
- Keep heavy imports (`torch`, `diffusers`, `boto3`) inside methods
    so local environments without these packages don't fail import-time.
"""

import os, random, tempfile, uuid

import modal  # type: ignore[import]
from pydantic import BaseModel

app = modal.App("ai-image-generator-backend")

# Turbo-only
MODEL_ID = "Tongyi-MAI/Z-Image-Turbo"
S3_SECRET = modal.Secret.from_name(os.getenv("MODAL_S3_SECRET_NAME", "ai-uncensored-image-gen-secret"))
SECRETS = [S3_SECRET]
VOL = modal.Volume.from_name(os.getenv("MODAL_HF_CACHE_VOLUME_NAME", "hf-hub-cache"), create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("git")
    .pip_install_from_requirements("requirements.txt")
    .env({"HF_XET_HIGH_PERFORMANCE": "1", "HF_HUB_CACHE": "/models"})
)


class Req(BaseModel):
    """Request payload for image generation.

    Fields:
    - `prompt`: main text prompt for generation
    - `negative_prompt`: optional text to steer model away from content
    - `width`/`height`: output image size in pixels
    - `num_inference_steps`: diffusion steps (higher -> slower, cleaner)
    - `guidance_scale`: classifier-free guidance strength
    - `seed`: optional RNG seed for reproducible outputs
    """
    prompt: str
    negative_prompt: str | None = None
    width: int = 1024
    height: int = 1024
    num_inference_steps: int | None = None
    guidance_scale: float | None = None
    seed: int | None = None


@app.cls(
    image=image,
    gpu=os.getenv("MODAL_GPU", "L40S"),
    timeout=600,
    scaledown_window=600,
    volumes={"/models": VOL},
    secrets=SECRETS,
)
class ZImageServer:
    """Modal-served class that manages model lifecycle and the API endpoint.

    Decorated with `@app.cls` so Modal creates a class instance inside the
    remote container. The `image` argument defines the container image
    (Python, apt/pip setup) and `volumes` lets us reuse a model cache.
    """
    @modal.enter()
    def load(self):
        """Load model weights into GPU memory.

        This method runs inside Modal's container where `torch` and
        `diffusers` are installed. We import locally to avoid requiring
        these packages in the local dev environment.
        """
        import torch  # type: ignore[import]
        from diffusers import ZImagePipeline  # type: ignore[import]

        # Shorthand references used elsewhere: `self.t` for torch, `self.P`
        # for the pipeline class. `self.pipe` holds the instantiated model.
        self.t, self.P = torch, ZImagePipeline
        self.token = (os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN") or "").strip().strip("\"'") or None
        self.pipe = None

        # Instantiate and move the pipeline to CUDA. Use bfloat16 for
        # reduced memory usage when supported by hardware.
        self.pipe = self.P.from_pretrained(
            MODEL_ID,
            torch_dtype=self.t.bfloat16,
            low_cpu_mem_usage=False,
            token=self.token,
        ).to("cuda")

    @modal.fastapi_endpoint(method="POST", docs=True)
    def generate_image(self, r: Req):
        """Generate an image from `Req` and upload to S3.

        Runs inside Modal where `boto3` is available. Steps:
        1. Choose or generate seed and create a CUDA generator for reproducibiity.
        2. Call the pipeline with provided prompts and options.
        3. Save the resulting PIL image to a temporary file.
        4. Upload to the S3 bucket configured by `AWS_S3_BUCKET_NAME`.

        Returns a JSON object with the S3 key, public URL, seed, and model id.
        """
        import boto3  # type: ignore[import]

        bucket = os.getenv("AWS_S3_BUCKET_NAME")

        pipe = self.pipe

        # Deterministic seed if provided, otherwise randomize.
        seed = int(r.seed) if r.seed is not None else random.randint(0, 2**32 - 1)
        gen = self.t.Generator("cuda").manual_seed(seed)

        steps = int(r.num_inference_steps) if r.num_inference_steps is not None else 9
        scale = float(r.guidance_scale) if r.guidance_scale is not None else 0.0

        # Run the pipeline. The API returns an object with an `images` list.
        img = pipe(
            **{
                "prompt": r.prompt,
                "height": int(r.height),
                "width": int(r.width),
                "num_inference_steps": steps,
                "guidance_scale": scale,
                "generator": gen,
                "negative_prompt": r.negative_prompt,
            }
        ).images[0]

        # Persist to a temp file and upload to S3.
        key = f"images/{uuid.uuid4()}.png"
        with tempfile.TemporaryDirectory(prefix="zimg_") as d:
            path = os.path.join(d, "out.png")
            img.save(path)
            s3 = boto3.client("s3")
            s3.upload_file(path, bucket, key, ExtraArgs={"ContentType": "image/png"})

            url = f"https://{bucket}.s3.amazonaws.com/{key}"

        return {"image_s3_key": key, "image_url": url, "seed": seed, "model_id": MODEL_ID}