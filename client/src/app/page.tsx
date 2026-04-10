import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  Scissors,
  Expand,
  Target,
  Download,
  CheckCircle2,
  Play,
} from "lucide-react";
import Link from "next/link";
import DemoSection from "../components/demo-section";
import {
  FadeUp,
  HeroHeading,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
} from "~/components/motion";

export default function HomePage() {
  const features = [
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "Prompt-to-Image",
      description: "Turn any idea into an image with a simple text prompt.",
      color: "text-chart-1",
      bgColor: "bg-chart-1/20",
    },
    {
      icon: <Expand className="h-8 w-8" />,
      title: "Flexible Settings",
      description:
        "Control size, steps, guidance, and seed for repeatable results.",
      color: "text-chart-2",
      bgColor: "bg-chart-2/20",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Creative Control",
      description:
        "Use negative prompts and iterate quickly to refine your style.",
      color: "text-chart-3",
      bgColor: "bg-chart-3/20",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description:
        "Generate high-quality images in seconds with optimized AI infrastructure.",
      color: "text-chart-4",
      bgColor: "bg-chart-4/20",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Designer",
      content:
        "This tool has revolutionized my workflow. Generating concept art that used to take hours now takes minutes!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Content Creator",
      content:
        "Perfect for content creation. I can generate consistent visuals for thumbnails and posts fast.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Founder",
      content:
        "The quality is incredible. I can explore styles and iterate quickly until it looks right.",
      rating: 5,
    },
  ];

  const pricingFeatures = [
    "Text-to-Image Generation",
    "Prompt + Negative Prompt",
    "Custom Sizes",
    "High-Quality Image Downloads",
    "Fast Processing",
    "Cloud Storage",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="bg-linear-to-r from-chart-1 to-chart-2 bg-clip-text text-xl font-bold text-transparent">
                AI Image Generator
              </span>
            </div>

            <div className="hidden items-center space-x-8 md:flex">
              <Link
                href="#features"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="#testimonials"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Reviews
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="cursor-pointer gap-2">
                  Try Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <ScaleIn delay={0.1} className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/30 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-chart-1" />
              <span className="font-medium text-foreground">
                Powered by Advanced AI
              </span>
            </ScaleIn>

            <HeroHeading className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Turn Text into{" "}
              <span style={{ background: "linear-gradient(to right, var(--chart-1), var(--chart-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Images
              </span>
            </HeroHeading>

            <FadeUp delay={0.25}>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Create high-quality images from text prompts in seconds. Iterate
                quickly, save your generations, and build your library.
              </p>
            </FadeUp>

            <FadeUp delay={0.4} className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="cursor-pointer gap-2 px-8 py-6 text-base"
                >
                  <Play className="h-5 w-5" />
                  Try It Free Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer gap-2 px-8 py-6 text-base"
                >
                  <Play className="h-5 w-5" />
                  See Examples
                </Button>
              </Link>
            </FadeUp>

            <FadeUp delay={0.55} className="mt-16 text-center">
              <p className="mb-8 text-sm text-muted-foreground">
                Trusted by thousands of creators worldwide
              </p>
              <StaggerContainer className="grid grid-cols-2 items-center justify-center gap-6 opacity-80 sm:grid-cols-5" staggerDelay={0.08}>
                <StaggerItem className="text-center">
                  <div className="text-2xl font-bold text-foreground">50K+</div>
                  <div className="text-xs text-muted-foreground">Images Generated</div>
                </StaggerItem>
                <StaggerItem className="text-center">
                  <div className="text-2xl font-bold text-foreground">5K+</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </StaggerItem>
                <StaggerItem className="text-center">
                  <div className="text-2xl font-bold text-foreground">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </StaggerItem>
                <StaggerItem className="text-center">
                  <div className="text-2xl font-bold text-chart-4">4.8★</div>
                  <div className="text-xs text-muted-foreground">User Rating</div>
                </StaggerItem>
                <StaggerItem className="col-span-2 text-center sm:col-span-1">
                  <div className="text-2xl font-bold text-foreground">24/7</div>
                  <div className="text-xs text-muted-foreground">Image Generation</div>
                </StaggerItem>
              </StaggerContainer>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Features Section */}
      <section id="features" className="bg-card py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful AI Images at Your{" "}
              <span style={{ background: "linear-gradient(to right, var(--chart-1), var(--chart-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Fingertips
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to create images with the power of artificial
              intelligence
            </p>
          </FadeUp>

          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <Card className="group relative overflow-hidden border-border bg-card/70 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div
                      className={`${feature.bgColor} mb-4 inline-flex items-center justify-center rounded-lg p-3 ${feature.color}`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple. Fast. Professional.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get professional results in three simple steps
            </p>
          </FadeUp>

          <StaggerContainer className="grid gap-8 md:grid-cols-3" staggerDelay={0.15}>
            {[
              {
                step: "01",
                title: "Write Your Prompt",
                description:
                  "Describe what you want to see. Add details like style, lighting, camera, and mood.",
              },
              {
                step: "02",
                title: "Pick Your Settings",
                description:
                  "Set image size and generation parameters, then iterate quickly until it looks right.",
              },
              {
                step: "03",
                title: "Generate & Download",
                description:
                  "Get your image in seconds. Download or save it to your projects.",
              },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <div className="relative">
                  <div className="mb-4 flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-sm">
                      {item.step}
                    </div>
                    {index < 2 && (
                      <div className="ml-4 hidden h-0.5 w-full bg-border md:block" />
                    )}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-card py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by{" "}
              <span style={{ background: "linear-gradient(to right, var(--chart-1), var(--chart-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Creators
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our users are saying about AI Image Generator
            </p>
          </FadeUp>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.12}>
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <Card className="relative border-border bg-card/70 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-1">
                      {Array.from({ length: Number(testimonial.rating) }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ),
                      )}
                    </div>
                    <p className="mb-4 text-muted-foreground italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div>
                      <div className="font-semibold text-card-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="bg-muted py-20 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Start Creating{" "}
              <span style={{ background: "linear-gradient(to right, var(--chart-1), var(--chart-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                For Free
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No credit card required. Start generating images instantly.
            </p>
          </FadeUp>

          <FadeUp delay={0.15} className="mx-auto max-w-lg">
            <Card className="relative overflow-hidden border-2 border-primary bg-card/70 backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                Free to Start
              </div>
              <CardContent className="p-8">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-card-foreground">
                    Free Plan
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-card-foreground">
                      $0
                    </span>
                    <span className="ml-2 text-muted-foreground">to start</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Try all features with free credits
                  </p>
                </div>

                <ul className="mb-8 space-y-4">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-chart-1" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard">
                  <Button
                    className="w-full cursor-pointer gap-2"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    Try It Free Now
                  </Button>
                </Link>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Includes 10 free credits • No credit card required
                </p>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/20 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Transform Your Text?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of creators using AI to bring their ideas to life
              with images
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="cursor-pointer gap-2 px-8 py-6 text-base"
                >
                  <Sparkles className="h-5 w-5" />
                  Try It Free Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer gap-2 px-8 py-6 text-base"
                >
                  <Download className="h-5 w-5" />
                  See Examples
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="bg-linear-to-r from-chart-1 to-chart-2 bg-clip-text text-xl font-bold text-transparent">
                    AI Image Generator
                  </span>
                </div>
                <p className="max-w-md text-muted-foreground">
                  High-quality image generation powered by artificial
                  intelligence. Turn text prompts into images with cutting-edge
                  AI technology.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-foreground">Product</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#features"
                      className="transition-colors hover:text-foreground"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="transition-colors hover:text-foreground"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="transition-colors hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-foreground">Support</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="mailto:support@aiimagegenerator.com"
                      className="transition-colors hover:text-foreground"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/settings"
                      className="transition-colors hover:text-foreground"
                    >
                      Account Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 AI Image Generator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


