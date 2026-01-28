import HeroSlider from "@/components/ui/HeroSlider";
import TrackingForm from "@/components/ui/TrackingForm";
import ServicesSection from "@/components/home/ServicesSection";
import AboutSection from "@/components/home/AboutSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <div className="pb-0 bg-[var(--background)]">
      <HeroSlider />

      <div className="relative z-20">
        <TrackingForm />
      </div>

      <ServicesSection />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
}
