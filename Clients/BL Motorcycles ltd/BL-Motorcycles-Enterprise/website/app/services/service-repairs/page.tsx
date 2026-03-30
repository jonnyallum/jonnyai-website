import { Wrench } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

export default function ServiceRepairs() {
  return (
    <ServicePageLayout
      icon={Wrench}
      title="Service & Repairs"
      subtitle="Expert maintenance for all makes and models. From routine servicing to full diagnostics, our experienced team keeps your bike running at its peak."
      image="/images/user-image-6.jpg"
      imageAlt="Motorcycle service and repairs in Hampshire"
      contentTitle="Professional Motorcycle"
      contentTitleHighlight="Servicing"
      paragraphs={[
        "At B&L Motorcycles, we provide comprehensive servicing and repair solutions for all makes and models of motorcycles. Our experienced technicians are passionate about bikes and dedicated to keeping your machine running at its absolute best.",
        "From routine oil changes and brake inspections to full diagnostics and complex repairs, we handle it all with precision and care. We serve riders across Portsmouth, Fareham, Gosport, Havant, Southampton, Petersfield, Chichester, and the wider Hampshire area.",
      ]}
      listTitle="Our Services Include:"
      listItems={[
        "Routine maintenance and servicing",
        "Full diagnostic checks",
        "Engine repairs and rebuilds",
        "Electrical system diagnostics",
        "Brake system servicing",
        "Chain and sprocket replacement",
        "Suspension setup and maintenance",
      ]}
      ctaTitle="Ready to Book Your Service?"
      ctaDescription="Get in touch with our team to schedule your motorcycle service or repair. We're here to help keep your bike running smoothly."
    />
  );
}
