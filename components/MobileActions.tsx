import { Phone } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";
import { siteConfig } from "@/lib/site";

export function MobileActions() {
  return (
    <div className="mobile-actions">
      <a href={siteConfig.phoneHref}><Phone size={18} /> Call</a>
      <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer"><SocialIcon platform="whatsapp" /> WhatsApp</a>
    </div>
  );
}
