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

const categoryProjection = `{
  _id,
  title,
  "slug": slug.current,
  description,
  "postCount": count(*[_type == "post" && defined(slug.current) && publishedAt <= now() && references(^._id)])
}`;

export const postsQuery = defineQuery(`*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(featured desc, publishedAt desc) ${summaryProjection}`);
export const postSlugsQuery = defineQuery(`*[_type == "post" && defined(slug.current) && publishedAt <= now()].slug.current`);
export const categoriesQuery = defineQuery(`*[_type == "category" && defined(slug.current) && count(*[_type == "post" && defined(slug.current) && publishedAt <= now() && references(^._id)]) > 0] | order(title asc) ${categoryProjection}`);
export const footerCategoriesQuery = defineQuery(`*[_type == "category" && defined(slug.current) && count(*[_type == "post" && defined(slug.current) && publishedAt <= now() && references(^._id)]) > 0] | order(title asc)[0...5] ${categoryProjection}`);
export const categorySlugsQuery = defineQuery(`*[_type == "category" && defined(slug.current) && count(*[_type == "post" && defined(slug.current) && publishedAt <= now() && references(^._id)]) > 0].slug.current`);
export const categoryBySlugQuery = defineQuery(`*[_type == "category" && slug.current == $slug][0] ${categoryProjection}`);
export const postsByCategoryQuery = defineQuery(`*[_type == "post" && defined(slug.current) && publishedAt <= now() && $categoryId in categories[]._ref] | order(featured desc, publishedAt desc) ${summaryProjection}`);
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
