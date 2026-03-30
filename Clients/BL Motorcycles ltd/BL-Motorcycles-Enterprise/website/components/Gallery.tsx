import { SectionTitle } from "@/components/ui/SectionTitle";

const galleryImages = [
  "/images/user-image-1.png",
  "/images/user-image-2.jpg",
  "/images/user-image-3.png",
  "/images/user-image-12.jpg",
  "/images/user-image-13.jpg",
  "/images/user-image-4.jpg",
];

export default function Gallery() {
  return (
    <section className="py-20 bg-secondary relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle subtitle="Our Work">Gallery</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <div key={i} className="relative group overflow-hidden h-64 md:h-80">
              <img
                src={img}
                alt={`Custom motorcycle build and restoration project by BL Motorcycles - Image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border border-brand-gold/20">
                <p className="text-primary font-heading font-bold uppercase tracking-wider">
                  View Project
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
