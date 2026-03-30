import { Droplet } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

export default function BrakeRestoration() {
  return (
    <ServicePageLayout
      icon={Droplet}
      title="Brake Restoration"
      subtitle="Complete brake system restoration and rebuilding to factory standards for safety and performance."
      image="/images/user-image-10.jpg"
      imageAlt="Brake restoration and rebuilding services"
      contentTitle="Specialist"
      contentTitleHighlight="Brake Restoration"
      paragraphs={[
        "At B&L Motorcycles, we specialize in complete brake system restoration and rebuilding. Your brakes are critical for safety, and we take that responsibility seriously. We strip, clean, and rebuild calipers and master cylinders to factory standards.",
        "Whether you're restoring a classic motorcycle or need to refresh the braking system on your daily rider, our brake restoration service brings your components back to life with like-new performance.",
        "We're recognized as brake restoration specialists in Portsmouth and Southampton, serving riders across Hampshire.",
      ]}
      listTitle="Our Brake Restoration Services:"
      listItems={[
        "Complete caliper stripping and cleaning",
        "Master cylinder rebuilding",
        "Piston and seal replacement",
        "Ultrasonic cleaning of brake components",
        "Brake line inspection and replacement",
        "Full system testing and bleeding",
        "Performance upgrades available",
      ]}
      ctaTitle="Ready to Restore Your Brakes?"
      ctaDescription="Contact us to discuss your brake restoration needs. Safety is our priority, and we're here to help."
    />
  );
}
