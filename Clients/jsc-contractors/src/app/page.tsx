import { caseStudies } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
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

      {/* Hero Section */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-8 text-center pt-24">
        <div className="max-w-4xl space-y-8">
          <p className="font-sans text-[10px] tracking-[0.4em] text-accent uppercase font-bold animate-fade-in">Established Craftsmanship</p>
          <h1 className="text-7xl font-light font-serif leading-[1.1] sm:text-9xl tracking-tight text-foreground">
            Bespoke <br />
            <span className="italic font-normal">Timber</span> Structure
          </h1>
          <p className="mx-auto max-w-xl font-sans text-xs tracking-[0.3em] text-zinc-500 uppercase leading-loose">
            High-End Carpentry Specialists & General Contractors. <br />
            Building Legacies Across the South Coast.
          </p>
        </div>

        <div className="absolute bottom-16 flex flex-col items-center gap-6">
          <div className="h-12 w-[1px] bg-accent/30" />
          <span className="font-sans text-[9px] tracking-[0.4em] text-foreground/40 uppercase">Hampshire & West Sussex</span>
        </div>
      </section>

      {/* Philosophy Section (The New Depth) */}
      <section className="py-32 px-8 bg-zinc-50 border-y border-zinc-200">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
            <Image
              src="/images/case-studies/new-build-mundham-1.jpg"
              alt="Architectural Detail"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-accent font-sans text-[10px] tracking-widest uppercase font-bold">Our Philosophy</span>
              <h2 className="text-5xl font-serif leading-tight">Material Integrity <br /> & Structural Grace</h2>
            </div>
            <p className="font-sans text-muted-foreground leading-relaxed text-sm">
              We believe building is an act of permanence. Every joint we cut and every beam we place is handled with a level of precision that transcends simple construction. At JSC, we don't just build roofs; we engineer the silhouettes of homes.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2 border-l border-accent/20 pl-4">
                <span className="block text-2xl font-serif">15+</span>
                <span className="block text-[9px] font-sans tracking-widest uppercase text-zinc-400">Years Experience</span>
              </div>
              <div className="space-y-2 border-l border-accent/20 pl-4">
                <span className="block text-2xl font-serif">200+</span>
                <span className="block text-[9px] font-sans tracking-widest uppercase text-zinc-400">Projects Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (Redesigned) */}
      <section className="py-40 px-8 bg-foreground text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-24 space-y-4">
            <p className="font-sans text-[10px] tracking-[0.4em] text-accent uppercase font-bold">What we do</p>
            <h2 className="text-6xl font-serif italic">Specialist <br /> Execution</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1px bg-zinc-800 border-[1px] border-zinc-800">
            {[
              {
                title: "First Fix Carpentry",
                desc: "The skeleton of the build. Stud walls, floor joists, and structural roof framing executed with laser-level precision.",
                tag: "Structural"
              },
              {
                title: "Second Fix Finishes",
                desc: "The tactile interface of your home. Doors, skirtings, staircases, and premium flooring installed with master joinery standards.",
                tag: "Finishing"
              },
              {
                title: "Prime Contracting",
                desc: "Full-cycle construction management. We oversee complexity so you can focus on the result.",
                tag: "Management"
              }
            ].map((service, i) => (
              <div key={i} className="bg-foreground p-16 space-y-8 group hover:bg-zinc-900 transition-all duration-500">
                <div className="flex justify-between items-start">
                  <span className="text-zinc-600 font-serif italic text-4xl opacity-50">0{i + 1}</span>
                  <span className="text-[9px] font-sans tracking-widest uppercase py-1 px-3 border border-accent/30 text-accent">{service.tag}</span>
                </div>
                <h3 className="text-3xl font-serif tracking-wide">{service.title}</h3>
                <p className="text-zinc-500 font-sans text-xs leading-loose tracking-[0.05em]">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid (Refined) */}
      <section className="py-40 bg-white">
        <div className="mx-auto max-w-7xl px-8 mb-20 text-center">
          <h2 className="text-5xl font-serif mb-4 italic">The Collection</h2>
          <p className="font-sans text-[11px] tracking-[0.3em] text-zinc-400 uppercase">A selection of our most definitive works</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
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
      </section>

      {/* Process Section (New) */}
      <section className="py-40 bg-zinc-50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-col lg:flex-row gap-24">
            <div className="lg:w-1/3 space-y-10">
              <div className="space-y-4">
                <p className="text-accent font-sans text-[10px] tracking-[0.4em] uppercase font-bold">The Journey</p>
                <h2 className="text-6xl font-serif leading-none">Workflow of <br /> Excellence</h2>
              </div>
              <p className="text-zinc-500 font-sans text-sm leading-loose">
                We avoid shortcuts. Our process is designed to ensure that the vision on paper is translated perfectly into the physical realm, with zero compromise.
              </p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
              {[
                { step: "Discovery", desc: "Consultation, site analysis, and detailed material planning." },
                { step: "Precision Prep", desc: "Setting the baseline with ultra-accurate measurements and setting out." },
                { step: "Core Build", desc: "Heavy structural execution where the project takes its definitive shape." },
                { step: "Refined Finish", desc: "The meticulous final stages where the craftsmanship truly shines." }
              ].map((step, i) => (
                <div key={i} className="space-y-6 relative">
                  <span className="absolute -top-12 left-0 text-[100px] font-serif text-black/5 select-none">{i + 1}</span>
                  <h4 className="text-2xl font-serif italic relative z-10">{step.step}</h4>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed relative z-10">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center bg-foreground text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/backgrounds/background 1.png"
            alt="Blueprint"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl px-8 space-y-12">
          <h2 className="text-5xl md:text-7xl text-white font-serif leading-tight">Define Your <br /> <span className="italic">Perspective</span></h2>
          <Link
            href="/contact"
            className="inline-block px-14 py-5 bg-accent text-foreground font-sans text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500"
          >
            Start Architectural Discussion
          </Link>
        </div>
      </section>
    </main>
  );
}
