import { Settings } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

export default function SpecialistRestoration() {
  return (
    <ServicePageLayout
      icon={Settings}
      title="Specialist Restoration"
      subtitle="Dedicated restoration services including specialist brake restoration and carburetor restoration."
      image="/images/mechanic-work.jpg"
      imageAlt="Specialist motorcycle restoration services"
      contentTitle="Expert"
      contentTitleHighlight="Restoration Services"
      paragraphs={[
        "B&L Motorcycles offers dedicated restoration services for classic and vintage motorcycles. We specialize in bringing classic components back to life, with particular expertise in brake restoration and carburetor restoration.",
        "We are the go-to specialists in Portsmouth and Southampton for bringing classic motorcycle components back to factory condition. Whether you're restoring a complete bike or need specific components rebuilt, we have the skills and experience to deliver exceptional results.",
      ]}
      listTitle="Restoration Services Include:"
      listItems={[
        "Complete brake system restoration",
        "Carburetor restoration and rebuilding",
        "Engine component restoration",
        "Fuel system restoration",
        "Electrical system refurbishment",
        "Classic motorcycle recommissioning",
      ]}
      ctaTitle="Start Your Restoration Project"
      ctaDescription="Contact us to discuss your restoration needs. We're passionate about bringing classic bikes back to life."
    />
  );
}
