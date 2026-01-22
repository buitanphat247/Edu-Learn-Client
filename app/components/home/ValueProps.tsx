"use client";

import React from "react";
import { RocketOutlined, BarChartOutlined, CheckCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Image from "next/image";
import ScrollAnimation from "@/app/components/common/ScrollAnimation";

export default function ValueProps() {
  return (
    <section className="py-20 lg:py-28 overflow-hidden bg-white dark:bg-[#0f172a] transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Row 1: Rapid Deployment */}
        <ScrollAnimation direction="right" delay={0}>
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          {/* Image Left */}
          <div className="lg:w-1/2 order-2 lg:order-1 relative group">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-600/10 rounded-3xl transform rotate-3 scale-105 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500"></div>
            <div className="relative rounded-3xl shadow-2xl w-full overflow-hidden h-[400px] border border-slate-200 dark:border-slate-700/50">
              <Image
                src="https://file.hstatic.net/1000323386/file/gioi-thieu-ve-man-hinh-cam-ung_1a7e3f8d6d3749eca2f63527a5fa21ac.jpg"
                alt="Teacher using tablet in classroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          
          {/* Content Right */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-4">
              <RocketOutlined className="text-xl" />
              <span>Rapid Deployment</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Deploy in Minutes, Not Months
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Our cloud-based architecture allows schools to get started immediately without complex hardware installations. Import your student data via Excel and start your digital transformation journey today.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircleOutlined className="text-green-500 text-xl mt-1 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">Automated data migration from legacy systems</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutlined className="text-green-500 text-xl mt-1 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">24/7 dedicated support for Vietnamese schools</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleOutlined className="text-green-500 text-xl mt-1 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">Mobile app ready for iOS and Android</span>
              </li>
            </ul>
          </div>
          </div>
        </ScrollAnimation>

        {/* Row 2: Smart Analytics */}
        <ScrollAnimation direction="left" delay={200}>
          <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content Left */}
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-4">
              <BarChartOutlined className="text-xl" />
              <span>Smart Analytics</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Actionable Insights for Better Learning
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              EduSmart doesn't just store grades; it analyzes them. Identify struggling students early with AI-driven prediction models and provide personalized support resources automatically.
            </p>
            <button className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 group transition-colors">
              Explore Analytics Features
              <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Image Right */}
          <div className="lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-purple-100 dark:bg-purple-600/10 rounded-3xl transform -rotate-2 scale-105 group-hover:-rotate-3 group-hover:scale-110 transition-all duration-500"></div>
            <div className="relative rounded-3xl shadow-2xl w-full overflow-hidden h-[400px] border border-slate-200 dark:border-slate-700/50">
              <Image
                src="https://cdn.dribbble.com/userupload/24847740/file/original-f5611924cb3a1540ea9fb27c8b996575.jpg?resize=400x0"
                alt="Analytics Dashboard"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

