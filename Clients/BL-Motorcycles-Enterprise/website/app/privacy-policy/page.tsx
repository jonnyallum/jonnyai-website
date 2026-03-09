"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Data Collection",
      icon: Eye,
      content: "We collect information you provide directly to us, such as when you create an account, search for parts, or connect your eBay store. This includes name, email, and marketplace credentials."
    },
    {
      title: "Data Usage",
      icon: FileText,
      content: "Information is used to facilitate listing synchronization, inventory management, and fitment verification. B&L Motorcycles LTD does not sell user data to third parties."
    },
    {
      title: "Ebay Integration",
      icon: Lock,
      content: "For eBay synchronization, we use securely generated tokens. We do not store your eBay password. Tokens can be revoked at any time through your eBay Developer portal or our B2B dashboard."
    },
    {
      title: "Security",
      icon: Shield,
      content: "We implement industry-standard encryption and security measures to protect your information from unauthorized access or disclosure."
    }
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark text-white py-24 px-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">Privacy Policy</h1>
          <p className="text-gray-400 text-lg uppercase tracking-widest font-bold text-brand-gold">B&L Motorcycles LTD | Digital Infrastructure</p>
        </motion.div>

        <div className="grid gap-8">
          {sections.map((section, i) => (
            <motion.section 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-gray/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl group hover:border-brand-gold/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4 text-brand-gold">
                <section.icon className="w-8 h-8" />
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white">{section.title}</h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg italic font-light">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-8 border-t border-white/10 text-center text-gray-600 text-sm"
        >
          Last Updated: {new Date().toLocaleDateString('en-GB')} • B&L MOTORCYCLES LTD • FAREHAM, UK
        </motion.footer>
      </div>
    </main>
  );
}
