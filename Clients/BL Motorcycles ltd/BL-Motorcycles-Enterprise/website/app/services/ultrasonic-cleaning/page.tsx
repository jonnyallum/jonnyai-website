import { Zap } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

export default function UltrasonicCleaning() {
  return (
    <ServicePageLayout
      icon={Zap}
      title="Ultrasonic Cleaning"
      subtitle="Deep cleaning for intricate parts using advanced ultrasonic technology."
      image="/images/ultrasonic-clean.jpg"
      imageAlt="Ultrasonic cleaning services for motorcycle parts"
      contentTitle="Advanced"
      contentTitleHighlight="Ultrasonic Cleaning"
      paragraphs={[
        "B&L Motorcycles uses state-of-the-art ultrasonic cleaning technology to deep clean intricate motorcycle components. This advanced cleaning method reaches areas that traditional cleaning simply cannot, removing years of built-up grime, carbon deposits, and contaminants.",
        "Ultrasonic cleaning is perfect for carburetors, fuel injectors, brake components, and other precision parts where cleanliness is critical for proper function. The process is gentle yet incredibly effective, restoring components to like-new condition without damage.",
      ]}
      listTitle="Ideal For:"
      listItems={[
        "Carburetors and fuel system components",
        "Fuel injectors",
        "Brake calipers and master cylinders",
        "Engine components",
        "Throttle bodies",
        "Small precision parts",
      ]}
      ctaTitle="Need Ultrasonic Cleaning?"
      ctaDescription="Contact us to discuss your ultrasonic cleaning needs. We'll restore your components to pristine condition."
    />
  );
}
