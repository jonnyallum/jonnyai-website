"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, ShoppingBag } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop Parts", href: "/shop" },
  { name: "Garage Services", href: "/services" },
  { name: "About Us", href: "#about" },
  { name: "Contact Us", href: "#contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

const instaImages = [
  "/images/user-image-1.png",
  "/images/user-image-2.jpg",
  "/images/user-image-3.png",
  "/images/user-image-4.jpg",
  "/images/user-image-12.jpg",
  "/images/user-image-13.jpg",
];

const fbImages = [
  "/images/user-image-6.jpg",
  "/images/mechanic-work.jpg",
  "/images/user-image-11.jpg",
  "/images/garage-vintage.jpg",
  "/images/user-image-10.jpg",
  "/images/ultrasonic-clean.jpg",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-black border-t border-brand-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/images/logo-transparent.png"
              alt="B&L Motorcycles"
              className="w-24 h-auto mb-6"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Proudly family-run and based in Hampshire, UK. We live and breathe motorcycles,
              offering quality used parts and expert repairs.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/brettfarley8206"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/blmotorcycles/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.ebay.co.uk/str/bnlmotorcycles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary font-heading font-bold text-lg uppercase tracking-wider mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wide flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-primary font-heading font-bold text-lg uppercase tracking-wider mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>
                  95 Newgate Lane, Peel Common,
                  <br />
                  Fareham, PO14 1BA,
                  <br />
                  United Kingdom
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:07881274193" className="hover:text-primary transition-colors">
                  07881 274193
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="mailto:blmotorcyclesltd@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  blmotorcyclesltd@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="https://www.ebay.co.uk/str/bnlmotorcycles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Visit eBay Store
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-primary font-heading font-bold text-lg uppercase tracking-wider mb-6">
              Opening Hours
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 font-mono">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="text-white">10:00am - 5:30pm</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-primary">Closed</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-primary">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Instagram Feed */}
        <div className="border-t border-gray-800 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-primary font-heading font-bold text-lg uppercase tracking-wider flex items-center gap-2">
              <Instagram className="w-5 h-5" /> Latest from Instagram
            </h4>
            <a
              href="https://www.instagram.com/blmotorcycles/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-primary transition-colors"
            >
              View Profile →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {instaImages.map((img, i) => (
              <a
                key={i}
                href="https://www.instagram.com/blmotorcycles/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-gray-900 border border-gray-800"
              >
                <img
                  src={img}
                  alt="Latest motorcycle project"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Facebook Feed */}
        <div className="border-t border-gray-800 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-primary font-heading font-bold text-lg uppercase tracking-wider flex items-center gap-2">
              <Facebook className="w-5 h-5" /> Join us on Facebook
            </h4>
            <a
              href="https://www.facebook.com/brettfarley8206"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-primary transition-colors"
            >
              View Page →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fbImages.map((img, i) => (
              <a
                key={i}
                href="https://www.facebook.com/brettfarley8206"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-gray-900 border border-gray-800"
              >
                <img
                  src={img}
                  alt="B&L Motorcycles Facebook update"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono uppercase tracking-wider">
          <p>© {year} B&L Motorcycles Ltd. All rights reserved. Company No: 14122962</p>
          <p>B&L Motorcycles – Trusted Parts & Repairs UK</p>
        </div>
      </div>
    </footer>
  );
}
