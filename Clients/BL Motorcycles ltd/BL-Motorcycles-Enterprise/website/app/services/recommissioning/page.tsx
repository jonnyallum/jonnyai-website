import { Settings } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

export default function Recommissioning() {
  return (
    <ServicePageLayout
      icon={Settings}
      title="Recommissioning"
      subtitle="Getting your bike back on the road after years of storage."
      image="/images/commissioning-new.jpg"
      imageAlt="Motorcycle recommissioning services"
      contentTitle="Expert"
      contentTitleHighlight="Recommissioning"
      paragraphs={[
        "Has your motorcycle been sitting in storage for months or even years? B&L Motorcycles specializes in recommissioning motorcycles that have been off the road, bringing them back to safe, reliable running condition.",
        "We handle everything from fuel system cleaning and carburetor servicing to comprehensive safety checks. Our thorough recommissioning process ensures your bike is ready to ride with confidence, whether it's been stored over winter or sitting for years.",
      ]}
      listTitle="Our Recommissioning Service Includes:"
      listItems={[
        "Complete fuel system cleaning and flushing",
        "Carburetor cleaning and servicing",
        "Oil and filter changes",
        "Brake system inspection and servicing",
        "Battery testing and replacement",
        "Tire condition assessment",
        "Full safety checks",
        "Engine diagnostics and tuning",
      ]}
      ctaTitle="Ready to Recommission Your Bike?"
      ctaDescription="Contact us to discuss your recommissioning needs. We'll get your bike back on the road safely and reliably."
    />
  );
}
