"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Scale, ShieldCheck, Zap, Users } from 'lucide-react';

// --- Utility Function ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Main Card Components (Themed & Interactive) ---

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AnimatedCard({ className, children, ...props }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };
        card.addEventListener('mousemove', handleMouseMove);
        return () => card.removeEventListener('mousemove', handleMouseMove);
    }, []);
    
  return (
    <div
      ref={cardRef}
      role="region"
      className={cn(
        "group/animated-card relative w-full h-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg backdrop-blur-sm before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.15),transparent_40%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, ...props }: CardProps) {
  return <div role="group" className={cn("absolute bottom-0 left-0 right-0 z-10 flex h-[35%] flex-col justify-end space-y-2 border-t border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm", className)} {...props} />;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
    return <h3 className={cn("text-lg font-bold tracking-tight text-blue-400", className)} {...props} />;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn("text-sm text-slate-300", className)} {...props} />;
}

export function CardVisual({ className, ...props }: CardProps) {
  return <div className={cn("absolute inset-0 h-[65%] w-full overflow-hidden", className)} {...props} />;
}

// --- Animated Visual Component & Sub-components ---

interface AnimatedVisualProps {
  mainColor?: string;
  secondaryColor?: string;
  gridColor?: string;
}

export function AnimatedVisual({
  mainColor = "#3b82f6",
  secondaryColor = "#60a5fa",
  gridColor = "rgba(100, 116, 139, 0.1)",
}: AnimatedVisualProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div className="absolute inset-0 z-20" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} />
      <div className="relative h-full w-full overflow-hidden rounded-t-lg">
        <DonutChartLayer hovered={hovered} color={mainColor} secondaryColor={secondaryColor} />
        <InfoPillLayer color={mainColor} />
        <GradientLayer color={mainColor} />
        <FlyOutLayer color={mainColor} secondaryColor={secondaryColor} hovered={hovered} />
        <EllipseGradient color={mainColor} />
        <GridLayer color={gridColor} />
      </div>
    </>
  );
}

const EllipseGradient: React.FC<{ color: string }> = ({ color }) => (
    <div className="absolute inset-0 z-[5]" style={{ background: `radial-gradient(ellipse at center, ${color}20, transparent 70%)` }} />
);

const GridLayer: React.FC<{ color: string }> = ({ color }) => (
    <div style={{ backgroundSize: '20px 20px', backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)` }} className="pointer-events-none absolute inset-0 z-[4] h-full w-full opacity-50 [mask-image:radial-gradient(ellipse_100%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
);

const DonutChartLayer: React.FC<{hovered?: boolean, color: string, secondaryColor: string}> = ({ hovered, color, secondaryColor }) => {
    const [mainProgress, setMainProgress] = useState(12.5);
    const [secondaryProgress, setSecondaryProgress] = useState(0);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (hovered) {
            timeout = setTimeout(() => {
                setMainProgress(66);
                setSecondaryProgress(100);
            }, 200);
        } else {
            setMainProgress(12.5);
            setSecondaryProgress(0);
        }
        return () => clearTimeout(timeout);
    }, [hovered]);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const mainDashoffset = circumference - (mainProgress / 100) * circumference;
    const secondaryDashoffset = circumference - (secondaryProgress / 100) * circumference;

    return (
        <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[7] flex h-full w-full transform items-center justify-center transition-transform duration-500 group-hover/animated-card:scale-110">
            <div className="relative flex h-[120px] w-[120px] items-center justify-center text-white">
                <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" opacity={0.15} />
                    <circle cx="50" cy="50" r={radius} stroke={secondaryColor} strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={secondaryDashoffset} transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.6, 0.6, 0, 1)" }} />
                    <circle cx="50" cy="50" r={radius} stroke={color} strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={mainDashoffset} transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.6, 0.6, 0, 1)" }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold text-white">
                        {Math.round(hovered ? (secondaryProgress > 66 ? secondaryProgress : mainProgress) : mainProgress)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

const InfoPillLayer: React.FC<{ color: string }> = ({ color }) => (
  <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[6] flex w-full translate-y-0 items-start justify-center p-4 transition-transform duration-500 group-hover/animated-card:translate-y-full">
    <div className="ease-[cubic-bezier(0.6,0.6,0,1)] rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 opacity-100 backdrop-blur-sm transition-opacity duration-500 group-hover/animated-card:opacity-0">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-xs text-slate-300">AI-Powered Analysis</p>
      </div>
    </div>
  </div>
);

const GradientLayer: React.FC<{ color: string }> = ({ color }) => (
    <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[6] translate-y-full opacity-0 transition-all duration-500 group-hover/animated-card:translate-y-0 group-hover/animated-card:opacity-100" style={{ background: `linear-gradient(to top, ${color}15, transparent 50%)` }} />
);

const FlyOutLayer: React.FC<{color: string, secondaryColor: string, hovered?: boolean}> = ({ color, secondaryColor, hovered }) => {
  const items = [
    { id: 1, translateX: "100", translateY: "50", text: "AI/ML" },
    { id: 2, translateX: "100", translateY: "-50", text: "OCR" },
    { id: 3, translateX: "125", translateY: "0", text: "NLP" },
    { id: 4, translateX: "-125", translateY: "0", text: "GDPR" },
    { id: 5, translateX: "-100", translateY: "50", text: "CCPA" },
    { id: 6, translateX: "-100", translateY: "-50", text: "Secure" },
  ];
  return (
    <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[7] flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover/animated-card:opacity-100">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute flex items-center justify-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/70 px-2 py-1 backdrop-blur-sm transition-all duration-500"
          style={{ transform: hovered ? `translate(${item.translateX}px, ${item.translateY}px)`: "translate(0px, 0px)" }}
        >
          <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: index < 3 ? color : secondaryColor }} />
          <span className="text-[10px] font-medium text-white">{item.text}</span>
        </div>
      ))}
    </div>
  );
};

// --- Main BenefitsSection Component ---

export default function BenefitsSection() {
    const benefits = [
        {
          title: "Enterprise-Grade Security",
          description: "Documents are processed in-memory and never stored. Your data remains yours, always.",
          className: "lg:col-span-2",
        },
        {
          title: "Fast & Accurate",
          description: "AI-powered analysis delivers comprehensive results in seconds, not hours.",
          className: "lg:col-span-1",
        },
        {
          title: "No Legalese Required",
          description: "Get clear, actionable insights without needing a law degree. We translate complexity into clarity.",
          className: "lg:col-span-1",
        },
        {
          title: "Trusted by Professionals",
          description: "Used by lawyers, founders, and teams to review contracts quickly and confidently.",
          className: "lg:col-span-2",
        },
    ];

    return (
        <section className="w-full bg-slate-900 py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white">
                        An Unfair Advantage in Legal Review
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
                        We combine cutting-edge technology with user-centric design to deliver unparalleled clarity and security in legal document analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[22rem]">
                    {benefits.map((benefit, i) => (
                        <AnimatedCard key={i} className={benefit.className}>
                             <CardVisual>
                                <AnimatedVisual />
                            </CardVisual>
                            <CardBody>
                                <CardTitle>{benefit.title}</CardTitle>
                                <CardDescription>{benefit.description}</CardDescription>
                            </CardBody>
                        </AnimatedCard>
                    ))}
                </div>
            </div>
        </section>
    );
}


