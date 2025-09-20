"use client";

import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have this utility function
import { ArrowRight, Twitter, Linkedin, Mail } from 'lucide-react';

// --- Reusable Sub-components ---

interface LinksGroupProps {
	title: string;
	links: { title: string; href: string }[];
}

function LinksGroup({ title, links }: LinksGroupProps) {
	return (
		<div className="p-6 md:p-8">
			<h3 className="text-sm font-semibold text-slate-400 mb-4 tracking-wider uppercase">
				{title}
			</h3>
			<ul className="space-y-3">
				{links.map((link) => (
					<li key={link.title}>
						<a
							href={link.href}
							className="text-slate-300 hover:text-blue-400 text-sm transition-colors duration-200"
						>
							{link.title}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialCard({ title, href, icon }: { title: string; href: string; icon: React.ReactNode }) {
	return (
		<a
			href={href}
			className="hover:bg-slate-800/50 flex items-center justify-between border-b border-slate-800 p-6 text-base transition-colors duration-200 md:border-b-0 md:p-8"
		>
            <div className="flex items-center gap-3">
                {icon}
			    <span className="font-medium text-slate-200">{title}</span>
            </div>
			<ArrowRight className="h-5 w-5 text-slate-500 transition-colors" />
		</a>
	);
}


// --- Main Footer Component ---

export default function Footer() {
	return (
		<footer
			className={cn(
				'w-full border-t border-slate-800 bg-slate-900 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(59,130,246,0.1),transparent)]'
			)}
		>
			<div className="relative mx-auto max-w-7xl px-4">
				<div className="relative grid grid-cols-1 border-x border-slate-800 md:grid-cols-4 md:divide-x md:divide-slate-800">
					
                    {/* Column 1 */}
                    <div className="flex flex-col-reverse md:flex-col">
						<LinksGroup
							title="Product"
							links={[
								{ title: 'How It Works', href: '#how-it-works' },
								{ title: 'Features', href: '#features' },
								{ title: 'Benefits', href: '#benefits' },
								{ title: 'Upload Document', href: '/upload' },
							]}
						/>
                        <SocialCard title="Email Us" href="mailto:contact@legalsimplifier.com" icon={<Mail className="w-5 h-5 text-slate-400"/>} />
					</div>

                    {/* Column 2 */}
					<div className="flex flex-col-reverse md:flex-col">
						<LinksGroup
							title="Legal"
							links={[
								{ title: 'Terms of Service', href: '#' },
								{ title: 'Privacy Policy', href: '#' },
								{ title: 'Security', href: '#' },
								{ title: 'Cookie Policy', href: '#' },
							]}
						/>
                        <SocialCard title="LinkedIn" href="#" icon={<Linkedin className="w-5 h-5 text-slate-400"/>} />
					</div>

                    {/* Column 3 */}
					<div className="flex flex-col-reverse md:flex-col">
						<LinksGroup
							title="Company"
							links={[
								{ title: 'About Us', href: '#' },
								{ title: 'Blog', href: '#' },
								{ title: 'Careers', href: '#' },
								{ title: 'Contact', href: '#' },
							]}
						/>
                        <SocialCard title="X (Twitter)" href="#" icon={<Twitter className="w-5 h-5 text-slate-400"/>} />
					</div>

                    {/* Column 4 - App Info */}
					<div className="p-8">
                        <h3 className="text-2xl font-bold text-white tracking-tight">LegalSimplifier</h3>
                        <p className="text-slate-400 text-sm mt-3">
                            AI-powered legal analysis to help you understand and negotiate contracts with confidence.
                        </p>
                    </div>

				</div>
			</div>

            {/* Copyright */}
			<div className="flex justify-center border-t border-slate-800 p-6">
				<p className="text-slate-500 text-xs">
					© {new Date().getFullYear()} LegalSimplifier. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
