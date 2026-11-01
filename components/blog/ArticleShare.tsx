"use client";

import { useState } from "react";
import { BriefcaseBusiness, Check, Copy, MessageCircle, Send, Share2 } from "lucide-react";

type ArticleShareProps = {
  title: string;
  url: string;
};

export function ArticleShare({ title, url }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Share2,
      platform: "facebook",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: MessageCircle,
      platform: "whatsapp",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: BriefcaseBusiness,
      platform: "linkedin",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Send,
      platform: "x",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="article-share" aria-labelledby="article-share-title">
      <div>
        <span className="eyebrow eyebrow--compact">Worth sharing?</span>
        <h2 id="article-share-title">Share this cleaning guide.</h2>
      </div>
      <div className="article-share__actions">
        {shareLinks.map(({ label, href, icon: Icon, platform }) => (
          <a
            className="article-share__button"
            data-platform={platform}
            href={href}
            key={label}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share this article on ${label}`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
        <button className="article-share__button" data-platform="copy" type="button" onClick={copyLink} aria-live="polite">
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          <span>{copied ? "Copied" : "Copy link"}</span>
        </button>
      </div>
    </section>
  );
}
