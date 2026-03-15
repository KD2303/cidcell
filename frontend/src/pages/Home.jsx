import HeroSection from '../components/HeroSection';
import AboutPreview from '../components/AboutPreview';
import Timeline from '../components/Timeline';
import VisionMission from '../components/VisionMission';
import KeyActivities from '../components/KeyActivities';
import Benefits from '../components/Benefits';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <div className="relative bg-bg overflow-hidden">
      <div className="pointer-events-none absolute top-[14%] right-[-4rem] w-56 h-56 bg-highlight-purple/20 border-3 border-primary rounded-full blur-sm hidden lg:block" />
      <div className="pointer-events-none absolute top-[46%] left-[-3rem] w-40 h-40 bg-highlight-teal/30 border-3 border-primary rotate-12 hidden lg:block" />
      <div className="pointer-events-none absolute bottom-[14%] right-[8%] w-28 h-28 bg-highlight-yellow/40 border-3 border-primary rounded-full hidden lg:block" />

      <HeroSection />

      <div className="relative border-t-2 border-primary/10">
        <AboutPreview />
      </div>

      <div className="relative border-t-2 border-primary/10 bg-gradient-to-b from-white to-bg/60">
        <Timeline />
      </div>

      <div className="relative border-t-2 border-primary/10">
        <VisionMission />
      </div>

      <div className="relative border-t-2 border-primary/10 bg-gradient-to-b from-bg/60 to-white">
        <KeyActivities />
      </div>

      <div className="relative border-t-2 border-primary/10">
        <Benefits />
      </div>

      <div className="relative border-t-2 border-primary/10">
        <CTASection />
      </div>
    </div>
  );
}
