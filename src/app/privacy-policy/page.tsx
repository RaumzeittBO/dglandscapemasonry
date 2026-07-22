import Link from "next/link";
import Navbar from "@/components/Navbar";
import FinalCTA from "@/components/FinalCTA";
import { getCallUrl, siteConfig } from "@/config/siteConfig";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-32 sm:pt-40">
        <span className="inline-flex rounded-full bg-moss px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
          Privacy Policy
        </span>
        <h1 className="mt-6 font-heading text-5xl font-bold leading-none text-charcoal sm:text-6xl">Privacy Policy</h1>
        <p className="mt-5 text-sm font-semibold text-charcoal/54">Last updated: July 22, 2026</p>

        <div className="mt-10 space-y-8 rounded-[1.5rem] border border-charcoal/8 bg-white p-6 leading-7 text-charcoal/70 shadow-sm sm:p-10">
          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal">Information We Collect</h2>
            <p className="mt-3">
              D&G Landscape and Masonry Inc. collects information you submit through our website, including your name, phone number, email address, city or ZIP code, project type, project description, preferred contact method, preferred estimate timing, and optional project photos.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal">How We Use Information</h2>
            <p className="mt-3">
              We use this information to respond to estimate requests, coordinate free on-site estimates, communicate by phone, text message, or email, and improve our advertising and website performance.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal">Cookies and Measurement</h2>
            <p className="mt-3">
              Our website may use cookies and measurement tools including Meta Pixel and Meta Conversions API. These tools help us understand campaign performance and measure when a valid estimate request is submitted. We do not send project descriptions or photos to Meta.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal">Sharing and Selling</h2>
            <p className="mt-3">
              We do not sell personal information. We may share limited information with service providers that help operate our website, email, advertising measurement, or customer communication systems.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal">Your Choices</h2>
            <p className="mt-3">
              You can request that we modify or delete information you submitted by contacting us directly. You may also avoid optional photo uploads if you prefer not to submit images through the website.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal">Contact</h2>
            <p className="mt-3">
              To request updates or deletion of your information, contact D&G Landscape and Masonry Inc. at{" "}
              <a href={`mailto:${siteConfig.primaryEmail}`} className="font-black text-moss underline underline-offset-4">
                {siteConfig.primaryEmail}
              </a>{" "}
              or{" "}
              <a href={getCallUrl()} className="font-black text-moss underline underline-offset-4">
                {siteConfig.phoneDisplay}
              </a>
              .
            </p>
          </section>
        </div>

        <Link href="/" className="mt-8 inline-flex rounded-full bg-charcoal px-7 py-3.5 text-sm font-black text-white transition hover:bg-moss">
          Return to Home
        </Link>
      </main>
      <FinalCTA />
    </div>
  );
}
