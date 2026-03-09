"use client";

import { motion } from "framer-motion";
import ImageReveal from "./ImageReveal";
import { cn } from "@/lib/utils";

const projects = [
  {
    title: "New Build Excellence",
    category: "Residential",
    image: "/projects/new-build/IMG_3582.JPG",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Architectural Roofing",
    category: "Restoration",
    image: "/projects/roofing/IMG_3546.JPG",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Bespoke Loft Space",
    category: "Renovation",
    image: "/projects/loft-conversion/IMG_3575.JPG",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Luxury Garden Retreat",
    category: "Specialised",
    image: "/projects/garden-room/686A0484-E359-4473-9FED-E434802B8268.JPG",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Modern Container Living",
    category: "Innovation",
    image: "/projects/container-conversion/4084c0d5-3547-4167-9bb8-bf2ec6d4ccae.jpeg",
    span: "md:col-span-1 md:row-span-1",
  },
];

export default function Projects() {
  return (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-10">
          <div className="max-w-3xl">
            <span className="text-accent text-[11px] uppercase tracking-[0.5em] font-black mb-6 block">
              Master Craftsmanship - Portsmouth Roots
            </span>
            <h2 className="text-5xl md:text-8xl font-serif text-black leading-[0.9]">
              Selected <span className="italic text-neutral-400">Works</span>.
            </h2>
          </div>
          <p className="text-neutral-500 font-sans max-w-sm text-lg leading-relaxed border-l-2 border-neutral-100 pl-8">
            Precision building and carpentry projects across Portsmouth and the South Coast. Drag across images on mobile to reveal the finish.
          </p>
        </div>

        {/* Masonry Grid - High End Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 auto-rows-[450px] md:auto-rows-[350px]">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 1, ease: "easeOut" }}
              className={cn("relative group flex flex-col", project.span)}
            >
              <div className="flex-1 min-h-0 relative">
                <ImageReveal 
                  src={project.image} 
                  alt={project.title} 
                  className="h-full rounded-sm"
                />
              </div>
              <div className="mt-6 flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-[14px] md:text-[12px] uppercase tracking-[0.3em] font-black text-black">
                    {project.title}
                  </h3>
                  <span className="text-[11px] md:text-[10px] text-neutral-400 uppercase tracking-widest block font-medium">
                    {project.category}
                  </span>
                </div>
                <div className="w-10 h-[1px] bg-neutral-200 mt-3 group-hover:w-16 group-hover:bg-accent transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
