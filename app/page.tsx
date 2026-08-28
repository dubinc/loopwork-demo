import { AnnouncementBar } from "@/components/announcement-bar";
import { Cta } from "@/components/cta";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Integrations } from "@/components/integrations";
import { LogoCloud } from "@/components/logo-cloud";
import { Nav } from "@/components/nav";
import { Pricing } from "@/components/pricing";
import { Showcase } from "@/components/showcase";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <Showcase />
        <Stats />
        <Testimonials />
        <Integrations />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
