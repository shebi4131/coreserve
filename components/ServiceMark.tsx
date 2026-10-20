import type { LucideIcon } from "lucide-react";

export function ServiceMark({ icon: Icon }: { icon: LucideIcon }) {
  return <span className="service-mark" aria-hidden="true"><Icon size={24} strokeWidth={1.8} /></span>;
}
