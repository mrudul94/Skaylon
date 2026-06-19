import { createClient } from '@sanity/client';
import {createImageUrlBuilder} from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2026-06-10';

export const isSanityConfigured = !!(projectId && dataset);

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = client ? createImageUrlBuilder(client) : null;

export function urlFor(source) {
  // If we have a Sanity builder and the source is a Sanity image object (non-string)
  if (builder && source && typeof source === 'object') {
    try {
      return builder.image(source);
    } catch (e) {
      console.warn("Failed to generate Sanity image URL, returning fallback object", e);
    }
  }
  
  // Return a fallback object containing a url() method for compatibility with builder chain
  return {
    url: () => typeof source === 'string' ? source : '',
    ignoreImageParams: () => ({ url: () => typeof source === 'string' ? source : '' })
  };
}
