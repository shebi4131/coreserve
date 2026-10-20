import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`logo${inverse ? " logo--inverse" : ""}`} href="/" aria-label="Coreserve Facilities Group home">
      <span className="logo__mark" aria-hidden="true"><span>C</span></span>
      <span className="logo__type">CORESERVE<small>FACILITIES GROUP</small></span>
    </Link>
  );
}
