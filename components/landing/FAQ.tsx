"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from 'lucide-react';

// Data for the FAQ section
const faqs = [
  {
    q: "Is my document stored or shared?",
    a: "No. Security and privacy are paramount. Documents are processed in-memory only and are never stored on our servers. We are fully compliant with GDPR and CCPA."
  },
  {
    q: "What file types are supported?",
    a: "You can upload PDF files as well as common image formats like JPG, PNG, and HEIC. This is perfect for both digital documents and high-quality scans or photos of physical papers."
  },
  {
    q: "How fast is the analysis?",
    a: "Our AI is optimized for speed. Most standard documents are fully analyzed in under 30 seconds, providing you with near-instant insights."
  },
  {
    q: "Can I use this for any type of contract?",
    a: "Yes! LegalSimplifier is designed to work with most standard contracts, agreements, terms of service, and privacy policies. The AI is trained on a vast corpus of legal documents to ensure broad compatibility."
  },
  {
    q: "What kind of insights will I get?",
    a: "You'll receive a color-coded risk analysis for each clause, plain-English explanations of complex terms, negotiation suggestions for risky clauses, and alerts for any important clauses that might be missing."
  }
];

// Reusable AccordionItem component
const AccordionItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800 py-6">
      <motion.header
        initial={false}
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-slate-100">{q}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Plus className="w-6 h-6 text-blue-400" />
        </motion.div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", marginTop: '20px' },
              collapsed: { opacity: 0, height: 0, marginTop: '0px' }
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <p className="text-slate-400 leading-relaxed max-w-2xl">
              {a}
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};


// Main FAQ component
export default function FAQSection() {
  return (
    <section className="w-full bg-slate-900 py-24 sm:py-32" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white">
                Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                Have questions? We've got answers. If you need more help, feel free to contact us.
            </p>
        </div>
        <div className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
