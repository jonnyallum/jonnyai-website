import Link from "next/link";
import Image from "next/image";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-background font-sans text-foreground selection:bg-accent selection:text-foreground">
            {/* Header */}
            <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-black/5 bg-white/80 px-8 py-5 backdrop-blur-md">
                <Link href="/" className="transition-opacity hover:opacity-80 decoration-accent underline-offset-4 decoration-2">
                    <Image
                        src="/logos/jsc-logo.png"
                        alt="JSC Logo"
                        width={100}
                        height={50}
                        className="h-auto w-24 grayscale brightness-50"
                    />
                </Link>
                <nav className="flex gap-10 font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground">
                    <Link href="/" className="relative group">
                        <span className="group-hover:text-accent transition-colors">Home</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/case-studies" className="relative group">
                        <span className="group-hover:text-accent transition-colors">Case Studies</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/contact" className="relative group">
                        <span className="group-hover:text-accent transition-colors">Contact</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative px-8 pt-48 pb-24 border-b border-black/5">
                <div className="max-w-4xl mx-auto space-y-8">
                    <p className="font-sans text-[10px] tracking-[0.4em] text-accent uppercase font-bold">Services & Craftsmanship</p>
                    <h1 className="text-7xl font-light font-serif leading-[1.1] tracking-tight text-foreground">
                        Structural <br />
                        <span className="italic font-normal">Integrity</span>
                    </h1>
                    <p className="max-w-xl font-sans text-xs tracking-[0.3em] text-zinc-500 uppercase leading-loose">
                        From the skeleton of the build to the tactile finishes that define a home.
                    </p>
                </div>
            </section>

            {/* Detailed Services */}
            <section className="py-32 px-8">
                <div className="max-w-6xl mx-auto space-y-40">

                    {/* Carpentry Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="text-accent font-sans text-[10px] tracking-widest uppercase font-bold">Specialist Carpentry</span>
                                <h2 className="text-5xl font-serif">First Fix <br /> & Structural Framing</h2>
                            </div>
                            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                                Construction starts with the frame. We specialize in complex timber structures, cut and pitch roofs, and primary structural carpentry that forms the permanent silhouette of high-end builds.
                            </p>
                            <ul className="space-y-4 font-sans text-[11px] tracking-widest uppercase text-foreground/70">
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> Cut & Pitch Roofing</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> Structural Timber Framing</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> Floor Joists & Stud Work</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> Exterior Cladding Systems</li>
                            </ul>
                        </div>
                        <div className="aspect-square relative overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                            <Image src="/images/case-studies/roof-cowplain-1.jpg" alt="Carpentry" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Finishing Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                        <div className="order-2 md:order-1 aspect-square relative overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                            <Image src="/images/case-studies/loft-southbourne-1.jpg" alt="Second Fix" fill className="object-cover" />
                        </div>
                        <div className="order-1 md:order-2 space-y-12">
                            <div className="space-y-4">
                                <span className="text-accent font-sans text-[10px] tracking-widest uppercase font-bold">Joinery & Finish</span>
                                <h2 className="text-5xl font-serif">Second Fix <br /> & Interior Detailing</h2>
                            </div>
                            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                                The final interface of the home. Our second fix team focuses on the tactile elements: doors, bespoke skirtings, and the refined joinery that elevates a house into a luxury residence.
                            </p>
                            <ul className="space-y-4 font-sans text-[11px] tracking-widest uppercase text-foreground/70">
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> Premium Door Installation</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> Bespoke Skirtings & Architraves</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> Custom Staircase Finishing</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-[1px] bg-accent" /> High-End Flooring Systems</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contracting Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="text-accent font-sans text-[10px] tracking-widest uppercase font-bold">Project Oversight</span>
                                <h2 className="text-5xl font-serif">General <br /> Contracting</h2>
                            </div>
                            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                                For complex builds, we offer prime contracting services. We manage the delicate balance between design vision and structural reality, ensuring all sub-contractors adhere to the JSC standard of excellence.
                            </p>
                            <div className="p-8 border border-black/5 bg-zinc-50 space-y-4">
                                <h4 className="font-serif italic text-xl">Full-Cycle Management</h4>
                                <p className="text-xs text-zinc-400 font-sans leading-relaxed">From initial site clearing to final handover, we manage the technical complexity of modern construction.</p>
                            </div>
                        </div>
                        <div className="aspect-[4/3] relative overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                            <Image src="/images/case-studies/new-build-mundham-1.jpg" alt="Contracting" fill className="object-cover" />
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-40 bg-foreground text-primary-foreground text-center">
                <div className="max-w-2xl mx-auto space-y-12 px-8">
                    <h2 className="text-5xl font-serif leading-tight italic">Ready to Discuss <br /> Your Perspective?</h2>
                    <Link
                        href="/contact"
                        className="inline-block px-14 py-5 bg-accent text-foreground font-sans text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all duration-500"
                    >
                        Start Collaboration
                    </Link>
                </div>
            </section>

        </main>
    );
}
