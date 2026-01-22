"use client";

import Events from "@/app/components/home/Events";
import Features from "@/app/components/home/Features";
import Hero from "@/app/components/home/Hero";
import News from "@/app/components/home/News";
import Stats from "@/app/components/home/Stats";
import Testimonials from "@/app/components/home/Testimonials";
import Integrations from "@/app/components/home/Integrations";
import ValueProps from "@/app/components/home/ValueProps";
import CallToAction from "@/app/components/home/CallToAction";
import ScrollAnimation from "@/app/components/common/ScrollAnimation";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0f172a] transition-all duration-500 ease-in-out">
      <Hero />
      <ScrollAnimation direction="up" delay={0}>
        <div className="border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-500">
          <Stats />
        </div>
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={100}>
        <div className="border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-500">
          <Features />
        </div>
      </ScrollAnimation>
      {/* <ScrollAnimation direction="up" delay={200}>
        <div className="border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-500">
          <Events />
        </div>
      </ScrollAnimation> */}
      <ScrollAnimation direction="up" delay={200}>
        <div className="border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-500">
          <Testimonials />
        </div>
      </ScrollAnimation>
      {/* <ScrollAnimation direction="up" delay={300}>
        <div className="border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-500">
          <News />
        </div>
      </ScrollAnimation> */}
      <ScrollAnimation direction="up" delay={300}>
        <Integrations />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={400}>
        <ValueProps />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={500}>
        <CallToAction />
      </ScrollAnimation>
    </div>
  );
}

