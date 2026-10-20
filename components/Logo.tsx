import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`logo${inverse ? " logo--inverse" : ""}`} href="/" aria-label="Coreserve Facilities Group home">
      <img className="logo__image" src="/brand/coreserve-logo.png" alt="" width="1056" height="609" />
    </Link>
  );
}
