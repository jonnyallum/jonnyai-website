import { caseStudies } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function CaseStudiesPage() {
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
                    <Link href="/services" className="relative group">
                        <span className="group-hover:text-accent transition-colors">Services</span>
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
                <div className="max-w-4xl mx-auto space-y-8 text-center">
                    <p className="font-sans text-[10px] tracking-[0.4em] text-accent uppercase font-bold">The Archive</p>
                    <h1 className="text-7xl font-light font-serif leading-[1.1] tracking-tight text-foreground">
                        Selected <br />
                        <span className="italic font-normal">Works</span>
                    </h1>
                </div>
            </section>

            {/* Case Studies Grid */}
            <section className="py-24 px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {caseStudies.map((study) => (
                            <Link
                                key={study.id}
                                href={`/case-studies/${study.id}/`}
                                className="group relative aspect-[4/5] overflow-hidden bg-zinc-100"
                            >
                                <Image
                                    src={study.mainImage}
                                    alt={study.title}
                                    fill
                                    className="bw-image object-cover scale-[1.01] transition-all duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col justify-end p-12">
                                    <span className="text-accent text-[9px] font-sans tracking-[0.3em] uppercase mb-4 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">{study.location}</span>
                                    <h3 className="font-serif text-3xl text-white italic translate-y-4 transition-transform duration-700 delay-75 group-hover:translate-y-0">{study.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-40 bg-foreground text-primary-foreground text-center">
                <div className="max-w-2xl mx-auto space-y-12 px-8">
                    <h2 className="text-5xl font-serif leading-tight italic">Ready to Start <br /> Your Next Phase?</h2>
                    <Link
                        href="/contact"
                        className="inline-block px-14 py-5 bg-accent text-foreground font-sans text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all duration-500"
                    >
                        Contact Our Team
                    </Link>
                </div>
            </section>
        </main>
    );
}
