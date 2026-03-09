import { caseStudies } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return caseStudies.map((study) => ({
        id: study.id,
    }));
}

export default async function CaseStudyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const study = caseStudies.find((s) => s.id === id);

    if (!study) {
        notFound();
    }

    // Placeholder for images - in a real app these would be fetched or mapped from the folder
    const images = [
        `/images/case-studies/${id}-1.jpg`,
        `/images/case-studies/${id}-2.jpg`,
        `/images/case-studies/${id}-3.jpg`,
    ];

    return (
        <main className="min-h-screen bg-white text-black">
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

            {/* Back Button */}
            <div className="fixed bottom-12 right-12 z-50">
                <Link
                    href="/"
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-black bg-white/10 backdrop-blur-sm transition-all hover:bg-black hover:text-white"
                >
                    <span className="text-xl">←</span>
                </Link>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-8 pt-40 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <p className="font-sans text-xs tracking-[0.3em] text-zinc-400 uppercase">{study.location}</p>
                            <h1 className="font-serif text-6xl italic leading-tight">{study.title}</h1>
                        </div>
                        <p className="max-w-md font-sans text-lg leading-relaxed text-zinc-600">
                            {study.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {study.images.map((src, index) => (
                            <div key={index} className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                                <Image
                                    src={src}
                                    alt={`${study.title} image ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
