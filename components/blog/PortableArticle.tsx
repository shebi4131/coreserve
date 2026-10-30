import type { ReactNode } from "react";
import { PortableText, type PortableTextComponentProps, type PortableTextComponents, type PortableTextMarkComponentProps } from "@portabletext/react";
import { BlogImage } from "./BlogImage";
import type { BlogBody, BlogCallout, SanityImage } from "@/sanity/lib/types";

type LinkValue = { _type: "link"; href?: string; blank?: boolean };

const components: PortableTextComponents = {
  block: {
    h2: ({ children }: { children?: ReactNode }) => <h2>{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
    blockquote: ({ children }: { children?: ReactNode }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<LinkValue>) => {
      const href = value?.href || "#";
      const external = href.startsWith("http");
      return <a href={href} target={value?.blank ? "_blank" : undefined} rel={value?.blank || external ? "noreferrer" : undefined}>{children}</a>;
    },
  },
  types: {
    articleImage: ({ value }: PortableTextComponentProps<SanityImage>) => (
      <figure className="article-image">
        <BlogImage image={value} width={1200} />
        {value.caption ? <figcaption>{value.caption}</figcaption> : null}
      </figure>
    ),
    callout: ({ value }: PortableTextComponentProps<BlogCallout>) => (
      <aside className="article-callout">
        {value.title ? <strong>{value.title}</strong> : null}
        <p>{value.text}</p>
      </aside>
    ),
  },
};

export function PortableArticle({ value }: { value: BlogBody }) {
  return <PortableText value={value} components={components} />;
}
