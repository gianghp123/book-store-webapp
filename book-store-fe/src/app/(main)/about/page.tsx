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
    title: "Curated Collections",
    description:
      "We handpick books from top publishers and independent authors to bring you the best reads across every genre.",
    link: "/test",
  },
  {
    icon: Lightbulb,
    title: "Personalized Recommendations",
    description:
      "Our smart system suggests books you’ll love based on your taste, reading history, and favorite authors.",
    link: "/test",
    learnMoreText: "Learn more",
  },
  {
    icon: Users,
    title: "Community & Collaboration",
    description:
      "Join a vibrant community of readers and writers. Share reviews, insights, and connect over your favorite stories.",
    link: "/test",
    learnMoreText: "Learn more",
  },
];

const defaultStats: Stat[] = [
  { number: "1M+", label: "Happy Readers" },
  { number: "50+", label: "Countries Reached" },
  { number: "98%", label: "Reader Satisfaction" },
  { number: "24/7", label: "Book Support & Delivery" },
];

function About1({
  // Hero section - inline defaults for simple strings
  badgeText = "Learn About Us",
  title = "Inspiring the",
  titleHighlight = "Future of Reading",
  description = "Our Book Store aims to bring convenience and inspiration to book lovers through a modern online shopping experience - Discover, explore, and enjoy your favorite books anytime, anywhere.",

  // Vision section
  visionImageSrc = "/about-1.jpg",
  visionImageAlt = "VISION Image",
  visionBadge = "OUR VISION",
  visionText = "To create an intelligent and user-friendly online bookstore where reading becomes easier, smarter, and more personalized.",

  // Mission section
  missionImageSrc = "/about-2.jpg",
  missionImageAlt = "MISSION Image",
  missionBadge = "OUR MISSION",
  missionText = "To create an intelligent and user-friendly online bookstore where reading becomes easier, smarter, and more personalized.",

  // Approach section
  approachBadge = "Our Approach",
  approachTitle = "Turning passion for books into a global community",
  approachDescription = "Our goal is to empower readers and writers by creating a platform that celebrates stories, creativity, and shared experiences. Here’s how we make it happen:",
  features = defaultFeatures,

  // CTA section
  ctaBadge = "JOIN OUR TEAM",
  ctaTitle = "Join us in shaping the future of reading",
  ctaDescription = "We’re looking for passionate people who love books and want to make reading accessible to everyone. If you’re excited about connecting readers and writers worldwide — we’d love to have you on board.",
  ctaButton1Text = "View open positions",
  ctaButton2Text = "Learn about our culture",
  ctaImageSrc = "/about-3.jpg",
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
