import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "../env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId: sanityProjectId, dataset: sanityDataset });

export function imageUrl(source: SanityImage | undefined, width = 1200, height?: number) {
  if (!source?.asset) return undefined;
  let request = builder.image(source).auto("format").fit("max").width(width).quality(86);
  if (height) request = request.height(height);
  return request.url();
}
