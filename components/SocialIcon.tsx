type SocialIconProps = {
  platform: "facebook" | "instagram" | "linkedin" | "whatsapp" | "x";
};

export function SocialIcon({ platform }: SocialIconProps) {
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M14.2 8H17V4.2c-.5-.1-2.1-.2-4-.2-3.9 0-6.6 2.4-6.6 6.8V14H2v4.3h4.4V24h5.4v-5.7h4.4l.7-4.3h-5.1v-2.8c0-1.3.4-3.2 2.4-3.2Z" />
      </svg>
    );
  }

  if (platform === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12.04 2a9.82 9.82 0 0 0-8.5 14.74L2.2 21.65l5.03-1.32A9.95 9.95 0 1 0 12.04 2Zm0 17.9a7.93 7.93 0 0 1-4.04-1.1l-.29-.17-2.98.78.8-2.9-.19-.3a7.88 7.88 0 1 1 6.7 3.69Zm4.33-5.9c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.61.77-.75.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18a7.13 7.13 0 0 1-1.32-1.64c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.63.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.4-.58 1.6-1.13.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M5.35 3.5A2.35 2.35 0 1 1 5.34 8.2a2.35 2.35 0 0 1 0-4.7ZM3.32 9.92h4.06V21H3.32V9.92Zm6.62 0h3.89v1.51h.05c.54-1.03 1.87-2.12 3.85-2.12 4.12 0 4.88 2.71 4.88 6.24V21h-4.05v-4.83c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.86 1.26-1.86 2.55V21h-4.05V9.92Z" />
      </svg>
    );
  }

  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.26-8.3L2.98 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.72L8.44 4.05H6.6L17.8 19.84Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.15" fill="currentColor" />
    </svg>
  );
}
