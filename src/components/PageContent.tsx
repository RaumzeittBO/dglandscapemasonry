"use client";

import AnimationProvider from "@/components/AnimationProvider";
import Navbar from "@/components/Navbar";
import StickyContactButton from "@/components/StickyContactButton";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import ServiceAreas from "@/components/ServiceAreas";
import ServiceAreaText from "@/components/ServiceAreaText";
import EstimateForm from "@/components/EstimateForm";
import BookingCTA from "@/components/BookingCTA";
import FinalCTA from "@/components/FinalCTA";
import { useScrollReveal } from "@/hooks/useGsapAnimations";

export default function PageContent() {
    useScrollReveal(".reveal-element");

    return (
        <AnimationProvider>
            <Navbar />
            <StickyContactButton />
            <main>
                <Hero />
                <Services />
                <Portfolio />
                <Process />
                <Testimonials />
                <ServiceAreas />
                <ServiceAreaText />
                <EstimateForm />
                <BookingCTA />
                <FinalCTA />
            </main>
        </AnimationProvider>
    );
}
