"use client";

import { useState } from "react";

interface StripeButtonProps {
  amount: number;
  planName: string;
  isSubscription?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function StripeButton({ amount, planName, isSubscription = false, children, className = "" }: StripeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planName, isSubscription }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe error:", data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Redirecting..." : children}
    </button>
  );
}
