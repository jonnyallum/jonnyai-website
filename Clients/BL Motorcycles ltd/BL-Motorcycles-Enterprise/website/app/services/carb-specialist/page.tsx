import { Gauge } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

export default function CarbSpecialist() {
  return (
    <ServicePageLayout
      icon={Gauge}
      title="Carb Specialist"
      subtitle="Expert carburetor and throttle body specialists. We are the go-to carb specialists in Portsmouth and Southampton."
      image="/images/balancing-gauges.jpg"
      imageAlt="Carburetor balancing and specialist services"
      contentTitle="Professional"
      contentTitleHighlight="Carburetor Services"
      paragraphs={[
        "B&L Motorcycles specializes in carburetor and throttle body servicing. Our comprehensive carb service ensures your motorcycle runs smoothly with optimal fuel delivery and engine performance.",
        "We are recognized as the go-to carburetor specialists in Portsmouth, Southampton, and across Hampshire. Whether you have a classic bike with multiple carbs or a modern machine with throttle bodies, we have the expertise and equipment to get it running perfectly.",
        "From single carbs to complex multi-carb setups, we handle all carburetor and throttle body work with precision and care.",
      ]}
      listTitle="Our Carb Service Process:"
      listItems={[
        "Stripping: Complete disassembly of carburetors or throttle bodies",
        "Ultrasonic Cleaning: Deep cleaning using advanced ultrasonic technology",
        "Servicing: Replacement of jets, gaskets, and worn components",
        "Precision Balancing: Professional balancing for smooth power delivery",
        "Testing: Full testing and adjustment for optimal performance",
      ]}
      ctaTitle="Need Carb Specialist Services?"
      ctaDescription="Contact us today to discuss your carburetor or throttle body servicing needs. We're here to help optimize your bike's performance."
    />
  );
}
