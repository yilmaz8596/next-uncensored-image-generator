import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, StaggerContainer, StaggerItem } from "~/components/motion";

export default function DemoSection() {
  const examples = [
    {
      title: "Cinematic Portrait",
      prompt:
        "A cinematic portrait photo of a fox astronaut, soft rim light, 35mm, shallow depth of field",
      tag: "portrait",
      imageSrc: "/demo/cinematic-portrait.png",
    },
    {
      title: "Isometric City",
      prompt:
        "An isometric futuristic city at sunset, neon signage, ultra-detailed, clean lines",
      tag: "isometric",
      imageSrc: "/demo/isometric-city.png",
    },
    {
      title: "Product Shot",
      prompt:
        "A premium product photo of a sleek water bottle on a marble surface, studio lighting, crisp reflections",
      tag: "product",
      imageSrc: "/demo/product-shot.png",
    },
  ];

  return (
    <section className="bg-muted py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See what you can{" "}
            <span className="bg-linear-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              generate
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A few prompt ideas to get you started.
          </p>
        </FadeUp>

        <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.13}>
          {examples.map((ex) => (
            <StaggerItem key={ex.tag}>
              <Card className="group relative overflow-hidden border-border bg-card/70 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div className="font-semibold text-card-foreground">
                        {ex.title}
                      </div>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {ex.tag}
                    </span>
                  </div>

                  <div className="mb-4 overflow-hidden rounded-xl border border-border bg-background">
                    <Image
                      src={ex.imageSrc}
                      alt={`${ex.title} example`}
                      width={512}
                      height={512}
                      unoptimized
                      className="w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    &ldquo;{ex.prompt}&rdquo;
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.2} className="mt-12 text-center">
          <Link href="/dashboard/create">
            <Button size="lg" className="cursor-pointer gap-2 px-8 py-6">
              <Sparkles className="h-5 w-5" />
              Try It Free Now
            </Button>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
