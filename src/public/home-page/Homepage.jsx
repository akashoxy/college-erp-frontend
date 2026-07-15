import React, { useCallback, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import AnnouncementBar from "./sections/AnnouncementBar";
import HeroSlider from "./sections/HeroSlider";
import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import GlanceSection from "./sections/GlanceSection";
import WhyChooseUsSection from "./sections/WhyChooseUsSection";
import ProgramsSection from "./sections/ProgramsSection";
import AmenitiesSection from "./sections/AmenitiesSection";
import RecruitersMarqueeSection from "./sections/RecruitersMarqueeSection";
import NoticeSection from "./sections/NoticeSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import AdmissionCTASection from "./sections/AdmissionCTASection";
import api from "../../services/api";

export default function Homepage() {
  const [homeData, setHomeData] = useState({
    address: "",
    admissionText: "",
    slides: [],
  });

  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll();
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const loadHomepage = useCallback(async () => {
    try {
      const { data } = await api.get("/homepage");

      const homepage = data?.data ?? {};

      setHomeData({
        address: homepage.address ?? "",
        admissionText: homepage.admissionText ?? "",
        slides: Array.isArray(homepage.slides)
          ? homepage.slides
          : [],
      });
    } catch {
      setHomeData({
        address: "",
        admissionText: "",
        slides: [],
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!mounted) return;
      await loadHomepage();
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [loadHomepage]);

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Scroll progress bar - fixed to top of viewport */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 bg-gradient-to-r from-primary to-secondary"
        style={{ scaleX: barScale }}
      />

      <AnnouncementBar
        address={homeData.address}
        admissionText={homeData.admissionText}
      />

      <HeroSlider
        slides={homeData.slides}
        current={current}
        setCurrent={setCurrent}
      />

      <main>
        <HeroSection />

        <StatsSection />

        <GlanceSection />

        <NoticeSection />

        <WhyChooseUsSection />

        <ProgramsSection />

        <AmenitiesSection />

        <RecruitersMarqueeSection />

        <TestimonialsSection />

        <AdmissionCTASection />
      </main>
    </div>
  );
}