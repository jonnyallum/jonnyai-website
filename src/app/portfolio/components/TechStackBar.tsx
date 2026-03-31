interface TechItem {
  name: string;
  role?: string;
}

interface TechStackBarProps {
  items: TechItem[] | string[];
  label?: string;
}

export default function TechStackBar({ items, label = "Tech Stack" }: TechStackBarProps) {
  return (
    <div>
      {label && (
        <p
          className="text-[10px] uppercase tracking-widest mb-3 font-medium"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => {
          const name = typeof item === "string" ? item : item.name;
          return (
            <span
              key={i}
              className="text-[11px] px-2.5 py-1 rounded-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
