type SocialIconProps = {
  platform: "facebook" | "instagram";
};

export function SocialIcon({ platform }: SocialIconProps) {
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M14.2 8H17V4.2c-.5-.1-2.1-.2-4-.2-3.9 0-6.6 2.4-6.6 6.8V14H2v4.3h4.4V24h5.4v-5.7h4.4l.7-4.3h-5.1v-2.8c0-1.3.4-3.2 2.4-3.2Z" />
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
