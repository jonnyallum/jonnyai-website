interface MetricBadgeProps {
  value: string;
  label: string;
  size?: "sm" | "md" | "lg";
}

export default function MetricBadge({
  value,
  label,
  size = "md",
}: MetricBadgeProps) {
  const sizeClasses = {
    sm: { value: "text-xl", label: "text-[10px]", pad: "px-3 py-2.5" },
    md: { value: "text-2xl", label: "text-xs", pad: "px-4 py-3" },
    lg: { value: "text-4xl", label: "text-sm", pad: "px-6 py-4" },
  };

  const s = sizeClasses[size];

  return (
    <div
      className={`flex flex-col items-center text-center ${s.pad} rounded-lg`}
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <span
        className={`${s.value} font-bold leading-none tabular-nums`}
        style={{ color: "#fff" }}
      >
        {value}
      </span>
      <span
        className={`${s.label} uppercase tracking-widest mt-1.5`}
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {label}
      </span>
    </div>
  );
}
