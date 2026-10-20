import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function MobileActions() {
  return (
    <div className="mobile-actions">
      <a href={siteConfig.phoneHref}><Phone size={18} /> Call</a>
      <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
    </div>
  );
}
