"use client";
import { Rocket, Lightbulb, Users, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  learnMoreText?: string;
}

interface Stat {
  number: string;
  label: string;
}

interface About1Props {
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  visionImageSrc?: string;
  visionImageAlt?: string;
  visionBadge?: string;
  visionText?: string;
  missionImageSrc?: string;
  missionImageAlt?: string;
  missionBadge?: string;
  missionText?: string;
  approachBadge?: string;
  approachTitle?: string;
  approachDescription?: string;
  features?: Feature[];
  ctaBadge?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButton1Text?: string;
  ctaButton2Text?: string;
  ctaImageSrc?: string;
  ctaImageAlt?: string;
  ctaImageOverlayText?: string;
  ctaImageOverlaySubtext?: string;
  stats?: Stat[];
}

// Keep complex objects separate for reusability
const defaultFeatures: Feature[] = [
  {
    icon: Rocket,
    title: "Pushing boundaries",
    description:
      "We constantly challenge the status quo, exploring new frontiers in AI and machine learning to deliver groundbreaking solutions.",
    link: "/test",
  },
  {
    icon: Lightbulb,
    title: "Fostering innovation",
    description:
      "Our culture thrives on creativity and out-of-the-box thinking. We encourage bold ideas and turn them into reality.",
    link: "/test",
    learnMoreText: "Learn more",
  },
  {
    icon: Users,
    title: "Empowering collaboration",
    description:
      "We believe in the power of diverse teams working together. Our tools are designed to enhance human potential, not replace it.",
    link: "/test",
    learnMoreText: "Learn more",
  },
];

const defaultStats: Stat[] = [
  { number: "10M+", label: "Professionals Empowered" },
  { number: "150+", label: "Countries Reached" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "24/7", label: "Support Available" },
];

function About1({
  // Hero section - inline defaults for simple strings
  badgeText = "Learn About Us",
  title = "Revolutionizing the",
  titleHighlight = "Future of work",
  description = "We're on a mission to empower teams with cutting-edge AI tools, transforming how businesses operate and innovate. Experience the future of productivity, today.",

  // Vision section
  visionImageSrc = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1200",
  visionImageAlt = "Team collaboration",
  visionBadge = "OUR VISION",
  visionText = "We envision a world where AI-powered tools are accessible to everyone, enabling unprecedented levels of creativity, efficiency, and problem-solving across all industries.",

  // Mission section
  missionImageSrc = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1200",
  missionImageAlt = "Team collaboration",
  missionBadge = "OUR MISSION",
  missionText = "Empowering 10 million professionals with AI-enhanced capabilities by 2030",

  // Approach section
  approachBadge = "Our Approach",
  approachTitle = "Transforming ideas into reality",
  approachDescription = "Our goal is to empower 10 million professionals with AI-enhanced capabilities by 2030. Here's how we're making it happen:",
  features = defaultFeatures,

  // CTA section
  ctaBadge = "JOIN OUR TEAM",
  ctaTitle = "Join us in shaping the future of AI",
  ctaDescription = "We're always on the lookout for passionate individuals who want to make a real impact. If you're excited about pushing the boundaries of what's possible with AI, we want to hear from you.",
  ctaButton1Text = "View open positions",
  ctaButton2Text = "Learn about our culture",
  ctaImageSrc = "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1200",
  ctaImageAlt = "Team working together",
  ctaImageOverlayText = "Join our growing team",
  ctaImageOverlaySubtext = "20+ open positions",

  // Stats section
  stats = defaultStats,
}: About1Props) {
  return (
    <section>
      <div className="flex flex-col gap-16 md:gap-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="outline" className="w-max">
            {badgeText}
            <ArrowDownRight className="ml-2 size-4" />
          </Badge>
          <h1 className="text-pretty text-4xl font-bold tracking-tight lg:text-6xl">
            {title}{" "}
            <span className="relative text-primary">{titleHighlight}</span>
          </h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="group flex flex-col justify-between gap-6 rounded-lg bg-muted p-6 shadow-sm transition-all duration-300 hover:shadow-md md:p-8">
            <div className="overflow-hidden rounded-md">
              <Image
                src={visionImageSrc}
                alt={visionImageAlt}
                width={500}
                height={300}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="outline" className="font-medium">
                {visionBadge}
              </Badge>
              <p className="text-xl font-medium">{visionText}</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-sm">
            <Image
              src={missionImageSrc}
              alt={missionImageAlt}
              width={500}
              height={300}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
              <div className="p-6 text-white md:p-8">
                <Badge
                  variant="outline"
                  className="mb-3 border-white/20 bg-white/10 text-white"
                >
                  {missionBadge}
                </Badge>
                <p className="text-xl font-medium">{missionText}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="max-w-2xl">
            <Badge variant="outline">
              {approachBadge}{" "}
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Badge>
            <h2 className="mb-3 mt-6 text-3xl font-bold md:text-4xl">
              {approachTitle}
            </h2>
            <p className="text-muted-foreground">{approachDescription}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {features.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col rounded-lg border border-border p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 transition-all group-hover:bg-primary/20">
                  <item.icon className="size-5 text-primary md:size-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="mb-4 text-muted-foreground">{item.description}</p>
                <Link href={item.link}>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <span>{item.learnMoreText}</span>
                    <ArrowRight className="ml-1 size-4" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 p-6 md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
            <div>
              <Badge className="mb-6">{ctaBadge}</Badge>
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">
                {ctaTitle}
              </h2>
              <p className="mb-6 text-muted-foreground">{ctaDescription}</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="w-full sm:w-max">
                  {ctaButton1Text}
                </Button>
                <Button size="lg" className="w-full sm:w-max" variant="outline">
                  {ctaButton2Text}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <Image
                  src={ctaImageSrc}
                  alt={ctaImageAlt}
                  width={500}
                  height={300}
                  className="aspect-video w-full rounded-lg object-cover shadow-lg"
                />
                <div className="absolute bottom-4 left-4 rounded-lg bg-background p-4 shadow-md backdrop-blur-sm">
                  <p className="font-semibold">{ctaImageOverlayText}</p>
                  <p className="text-sm text-muted-foreground">
                    {ctaImageOverlaySubtext}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg border border-border p-6 text-center"
            >
              <p className="text-3xl font-bold md:text-4xl">{stat.number}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About1;
