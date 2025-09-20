"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import { 
    UploadCloud, 
    TrafficCone, 
    FilePlus2, 
    MessageSquare, 
    Gavel, 
    Download,
    ShieldCheck
} from 'lucide-react';

// --- Reusable BentoItem Component with Interaction ---
// I've added TypeScript types for the props.
interface BentoItemProps {
  className?: string;
  children: ReactNode;
}

const BentoItem = ({ className, children }: BentoItemProps) => {
    // This ref connects to the div element.
    const itemRef = useRef<HTMLDivElement>(null);

    // This effect adds the mouse-tracking "spotlight" effect.
    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // These CSS variables are used by the ::before pseudo-element for the gradient.
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        };

        item.addEventListener('mousemove', handleMouseMove);

        // Cleanup function to remove the event listener.
        return () => {
            item.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div 
            ref={itemRef} 
            // The base styles for each grid item, including the pseudo-element for the hover effect.
            className={`relative rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-lg transition-all duration-300 ease-in-out hover:border-slate-500/80 before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.15),transparent_40%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 ${className}`}
        >
            {children}
        </div>
    );
};


// --- Main HowItWorks Component ---
export default function HowItWorks() {
    return (
        <section className="w-full bg-slate-900 py-24 sm:py-32" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white">
                        A Smarter Way to Review Documents
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
                        Our process is designed to give you clarity and control. From upload to final review, here’s how we simplify legal analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[12rem]">
                    {/* Item 1: Upload */}
                    <BentoItem className="md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-center">
                        <UploadCloud className="w-8 h-8 text-blue-400 mb-3" />
                        <h3 className="text-xl font-semibold text-white">1. Upload & Analyze</h3>
                        <p className="text-slate-400 mt-1">Securely upload your PDF or image files. Our Deep-Read Engine gets to work instantly, performing OCR and structural analysis.</p>
                    </BentoItem>

                    {/* Item 2: Traffic Light */}
                    <BentoItem className="flex flex-col justify-center">
                        <TrafficCone className="w-8 h-8 text-blue-400 mb-3" />
                        <h3 className="text-xl font-semibold text-white">2. Clause Map</h3>
                        <p className="text-slate-400 mt-1">Get a "traffic-light" view of your document, with clauses rated green, yellow, or red based on risk.</p>
                    </BentoItem>

                    {/* Item 3: Missing Clauses */}
                    <BentoItem className="flex flex-col justify-center">
                        <FilePlus2 className="w-8 h-8 text-blue-400 mb-3" />
                        <h3 className="text-xl font-semibold text-white">3. Find Gaps</h3>
                        <p className="text-slate-400 mt-1">Our AI detects what's missing, highlighting "ghost clauses" that should be included for your protection.</p>
                    </BentoItem>
                    
                    {/* Item 4: Chat & Negotiate */}
                    <BentoItem className="md:col-span-2 lg:col-span-3 row-span-1 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                           <Gavel className="w-8 h-8 text-blue-400 flex-shrink-0" />
                            <div>
                               <h3 className="text-xl font-semibold text-white">4. Negotiate with AI</h3>
                               <p className="text-slate-400 mt-1">Use the Negotiate-Aid to generate responses with a friendly, firm, or aggressive tone, and chat with our assistant to clarify any doubts.</p>
                            </div>
                        </div>
                    </BentoItem>

                    {/* Item 5: Export */}
                    <BentoItem className="flex flex-col justify-center items-center text-center">
                        <Download className="w-8 h-8 text-blue-400 mb-3" />
                        <h3 className="text-xl font-semibold text-white">5. Secure Export</h3>
                        <p className="text-slate-400 mt-1">Download your finalized document as a redlined PDF, with optional watermarks and plain-English notes.</p>
                    </BentoItem>
                </div>
            </div>
        </section>
    );
};
