import Link from "next/link";
import Navbar from "@/components/Navbar";
import FinalCTA from "@/components/FinalCTA";

export default function ThankYouPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            
            <main className="flex-grow flex items-center justify-center p-6 bg-white pt-32 pb-24">
                <div className="max-w-2xl text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-brown/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brown" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    
                    <h1 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl md:text-6xl mb-6">
                        Thank You!
                    </h1>
                    
                    <p className="text-xl text-neutral mb-10 leading-relaxed">
                        Your message has been received. We will get back to you as soon as possible to discuss your landscaping and masonry needs.
                    </p>
                    
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-charcoal-light hover:shadow-lg hover:shadow-charcoal/20 hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Return Home
                    </Link>
                </div>
            </main>

            <FinalCTA />
        </div>
    );
}
