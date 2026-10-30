import { defineQuery } from "next-sanity";

const imageProjection = `{
  alt,
  caption,
  crop,
  hotspot,
  asset->{_id, url, metadata{dimensions{width, height, aspectRatio}}}
}`;

const summaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "updatedAt": _updatedAt,
  featured,
  "featuredImage": featuredImage${imageProjection},
  author->{name, role, bio, "image": image${imageProjection}},
  "categories": categories[]->{title, "slug": slug.current}
}`;

export const postsQuery = defineQuery(`*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(featured desc, publishedAt desc) ${summaryProjection}`);
export const postSlugsQuery = defineQuery(`*[_type == "post" && defined(slug.current) && publishedAt <= now()].slug.current`);
export const blogSettingsQuery = defineQuery(`*[_type == "blogSettings"][0]{heading, introduction, seoTitle, seoDescription}`);
export const postBySlugQuery = defineQuery(`*[_type == "post" && slug.current == $slug && publishedAt <= now()][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "updatedAt": _updatedAt,
  featured,
  "featuredImage": featuredImage${imageProjection},
  author->{name, role, bio, "image": image${imageProjection}},
  "categories": categories[]->{title, "slug": slug.current},
  "body": body[]{
    ...,
    _type == "articleImage" => ${imageProjection}
  },
  seoTitle,
  seoDescription,
  canonicalUrl,
  noIndex,
  "socialImage": socialImage${imageProjection},
  relatedServices,
  "relatedPosts": relatedPosts[]->${summaryProjection},
  faqs
}`);
