export default function LocationMap() {
    return (
        <section id="location" className="bg-charcoal py-24 sm:py-32">
            <div className="mx-auto max-w-5xl px-6">
                {/* Section Header */}
                <div className="reveal-element mb-12 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-brown-light">
                        Find Us
                    </span>
                    <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl">
                        Location
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-neutral-light">
                        Serving the Greater Boston area.
                    </p>
                    <div className="mx-auto mt-4 h-px w-16 bg-brown" />
                </div>

                {/*
          TODO: Replace this placeholder with a real Google Maps embed.
          
          Instructions:
          1. Go to Google Maps and search for your business or service area.
          2. Click "Share" → "Embed a map"
          3. Copy the iframe code.
          4. Replace the placeholder div below with the iframe.
          
          Example:
          <iframe
            src="https://www.google.com/maps/embed?pb=..."
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        */}
                <div className="overflow-hidden rounded-2xl border border-white/10">
                    <div className="flex h-[400px] items-center justify-center bg-charcoal-light">
                        <div className="text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto mb-4 h-12 w-12 text-brown/50"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <p className="text-lg font-medium text-white/50">
                                Map embed goes here
                            </p>
                            <p className="mt-2 text-sm text-neutral-light">
                                Serving the Greater Boston &amp; MetroWest area
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
