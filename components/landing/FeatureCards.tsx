"use client";

import React from "react";
import { ShieldCheck, BookText, Gavel, Lock } from 'lucide-react';

// Defining the props type for our DisplayCard component for type safety.
interface DisplayCardProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// This is the individual card component, now with TypeScript props.
function DisplayCard({
  className,
  icon,
  title,
  description,
}: DisplayCardProps) {
  return (
    <div
      className={`relative flex h-40 w-[24rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-md p-5 transition-all duration-700 hover:border-slate-500/80 hover:bg-slate-800/80 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="relative inline-block rounded-lg bg-blue-900/50 p-2 border border-blue-500/20">
          {icon}
        </span>
        <p className="text-lg font-semibold text-blue-400">{title}</p>
      </div>
      <p className="text-base text-slate-300">{description}</p>
    </div>
  );
}

// This is the main component that arranges the cards in a stack.
export default function FeatureSection() {
  const features: DisplayCardProps[] = [
    {
      icon: <Lock className="size-5 text-blue-300" />,
      title: "Privacy & Security",
      description: "Documents processed in-memory and never stored. GDPR/CCPA compliant.",
      className:
        "[grid-area:stack] z-10 hover:z-50 hover:-translate-y-24 before:absolute before:inset-0 before:rounded-2xl before:content-[''] before:bg-slate-900/70 before:transition-opacity before:duration-700 hover:before:opacity-0 grayscale hover:grayscale-0",
    },
    {
      icon: <Gavel className="size-5 text-blue-300" />,
      title: "Negotiation Helper",
      description: "Generate safer alternatives for risky clauses.",
      className:
        "[grid-area:stack] z-20 translate-x-12 translate-y-10 hover:z-50 hover:-translate-y-24 before:absolute before:inset-0 before:rounded-2xl before:content-[''] before:bg-slate-900/70 before:transition-opacity before:duration-700 hover:before:opacity-0 grayscale hover:grayscale-0",
    },
    {
      icon: <BookText className="size-5 text-blue-300" />,
      title: "Plain-English Explanations",
      description: "Get simple, jargon-free explanations for every clause.",
      className:
        "[grid-area:stack] z-30 translate-x-24 translate-y-20 hover:z-50 hover:-translate-y-24 before:absolute before:inset-0 before:rounded-2xl before:content-[''] before:bg-slate-900/70 before:transition-opacity before:duration-700 hover:before:opacity-0 grayscale hover:grayscale-0",
    },
     {
      icon: <ShieldCheck className="size-5 text-blue-300" />,
      title: "Clause Risk Analysis",
      description: "Instantly see which clauses are safe, risky, or missing.",
      className:
        "[grid-area:stack] z-40 translate-x-36 translate-y-28 hover:z-50 hover:-translate-y-24",
    },
  ];

  return (
    <section className="w-full bg-slate-900 py-24 sm:py-32" id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white">
                Powerful Features, Simplified
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                Our AI provides everything you need to understand and negotiate contracts with confidence.
            </p>
        </div>
        
        <div className="flex items-center justify-center min-h-[350px]">
            <div className="grid [grid-template-areas:'stack'] place-items-center">
                {features.map((cardProps, index) => (
                    <DisplayCard key={index} {...cardProps} />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}

