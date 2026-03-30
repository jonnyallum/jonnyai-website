export default function Mission() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white uppercase mb-8">
          Our <span className="text-primary">Mission</span>
        </h2>
        <div className="relative">
          <div className="absolute -top-8 -left-8 text-6xl text-primary/20 font-serif select-none">
            &ldquo;
          </div>
          <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed italic">
            At B&L Motorcycles Ltd, our mission is to deliver the best experience for
            every rider shopping for quality used motorcycle parts and accessories.
            We&apos;re committed to providing outstanding customer service, fast UK
            shipping, and reliable support from start to finish. Whether you&apos;re
            maintaining your daily ride or restoring a classic motorbike, we aim to make
            the process simple, affordable, and stress-free — so you can get back on the
            road with confidence.
          </p>
          <div className="absolute -bottom-8 -right-8 text-6xl text-primary/20 font-serif select-none">
            &rdquo;
          </div>
        </div>
      </div>
    </section>
  );
}
