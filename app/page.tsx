
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureCards from "@/components/landing/FeatureCards";
import DashboardMockup from "@/components/landing/DashboardMockup";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import TechnologySection from "@/components/landing/TechnologySection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <HowItWorks />
      <FeatureCards />
      {/* <DashboardMockup /> */}
      <BenefitsSection />
      <TechnologySection />
      <FAQ />
      <Footer />
    </main>
  );
}
