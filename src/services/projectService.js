import { client, isSanityConfigured, urlFor } from '../sanity/client';
import { projectsData } from '../data/projectsData';

// Map a local project to a uniform structure
function mapLocalProject(key, data) {
  return {
    id: data.id || key,
    slug: data.slug || key,
    title: data.title,
    category: data.sector || data.category || '',
    coverImage: data.bgImage || data.coverImage || '',
    shortDescription: data.tagline || data.shortDescription || '',
    fullDescription: data.description || data.fullDescription || '',
    techStack: data.techStack || [],
    clientName: data.clientName || data.quote?.author || '',
    completionDate: data.completionDate || data.duration || '',
    liveUrl: data.liveUrl || '',
    githubUrl: data.githubUrl || '',
    isConfidenceFeatured: data.isConfidenceFeatured ?? false,
    confidencePriority: data.confidencePriority ?? 99,
    isProofFeatured: data.isProofFeatured ?? false,
    proofPriority: data.proofPriority ?? 99,
    homepageSpotlight: data.homepageSpotlight ?? false,
    showOnHomepage: data.showOnHomepage ?? true,
    gallery: data.gallery || [],
    
    // Original detailed fields for rich layout in CaseStudyPage
    challenge: data.challenge,
    quote: null, // quote section removed completely
    thinking: data.thinking,
    design: data.design,
    engineering: data.engineering,
    outcomes: data.outcomes
  };
}

export function getLocalProjects() {
  return Object.entries(projectsData).map(([key, value]) => mapLocalProject(key, value));
}

// Convert a Sanity document into the uniform structure
function mapSanityProject(doc) {
  let imageUrl = null;
  try {
    imageUrl = doc.coverImage?.asset
      ? urlFor(doc.coverImage).url()
      : null;
  } catch (e) {
    console.warn(`[ProjectService] Warning: Failed to map coverImage for project "${doc.title || doc._id}":`, e);
  }

  let galleryUrls = [];
  try {
    galleryUrls = doc.gallery
      ?.filter(img => {
        if (!img?.asset) {
          console.warn(`[ProjectService] Warning: Skipping invalid/empty gallery image asset in project "${doc.title || doc._id}"`);
          return false;
        }
        return true;
      })
      .map(img => {
        try {
          return urlFor(img).url();
        } catch (e) {
          console.warn(`[ProjectService] Warning: Failed to get URL for gallery image in project "${doc.title || doc._id}":`, e);
          return null;
        }
      })
      .filter(Boolean) || [];
  } catch (e) {
    console.warn(`[ProjectService] Warning: Failed to map gallery for project "${doc.title || doc._id}":`, e);
  }

  return {
    id: doc.slug?.current || doc._id,
    slug: doc.slug?.current || '',
    title: doc.title,
    category: doc.category,
    coverImage: imageUrl,
    shortDescription: doc.shortDescription,
    fullDescription: doc.fullDescription,
    techStack: doc.techStack || [],
    clientName: doc.clientName,
    completionDate: doc.completionDate,
    liveUrl: doc.liveUrl,
    githubUrl: doc.githubUrl,
    isConfidenceFeatured: !!doc.isConfidenceFeatured,
    confidencePriority: doc.confidencePriority ?? 99,
    isProofFeatured: !!doc.isProofFeatured,
    proofPriority: doc.proofPriority ?? 99,
    homepageSpotlight: !!doc.homepageSpotlight,
    showOnHomepage: doc.showOnHomepage ?? true,
    gallery: galleryUrls,
    
    // Provide adaptive fallbacks for rich sections on CaseStudyPage
    duration: doc.completionDate || '',
    sector: doc.category,
    bgImage: imageUrl,
    
    challenge: doc.challengeSummary || doc.shortDescription ? {
      summary: doc.challengeSummary || doc.shortDescription || ''
    } : null,

    quote: null, // quote section removed completely

    thinking: doc.thinkingSummary || doc.fullDescription ? {
      summary: doc.thinkingSummary || doc.fullDescription || '',
      pillars: doc.thinkingPillars || []
    } : null,

    design: doc.designSummary || doc.shortDescription ? {
      summary: doc.designSummary || doc.shortDescription || '',
      image: imageUrl, // coverImage is used for design section media
      colors: doc.designColors || []
    } : null,

    engineering: doc.engineeringDescription || (doc.engineeringSpecs && doc.engineeringSpecs.length > 0) ? {
      description: doc.engineeringDescription || '',
      specs: doc.engineeringSpecs || []
    } : null,

    outcomes: doc.outcomes && doc.outcomes.length > 0 ? doc.outcomes : null
  };
}

export async function fetchProjects() {
  console.log("[ProjectService] Checking Sanity configuration...", {
    isConfigured: isSanityConfigured,
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET
  });

  if (!isSanityConfigured) {
    console.log("[ProjectService] Sanity is not configured. Returning empty local fallback.");
    return getLocalProjects();
  }

  try {
    const query = `*[_type == "project" && showOnHomepage == true] {
      _id,
      title,
      slug,
      category,
      coverImage,
      gallery,
      shortDescription,
      fullDescription,
      techStack,
      clientName,
      completionDate,
      liveUrl,
      githubUrl,
      isConfidenceFeatured,
      confidencePriority,
      isProofFeatured,
      proofPriority,
      homepageSpotlight,
      showOnHomepage,
      challengeSummary,
      thinkingSummary,
      thinkingPillars,
      designSummary,
      designColors,
      engineeringDescription,
      engineeringSpecs,
      outcomes
    }`;
    const docs = await client.fetch(query);
    console.log("[ProjectService] Sanity query successful. Documents returned:", docs?.length || 0);

    if (!docs || docs.length === 0) {
      console.warn("[ProjectService] Sanity returned no projects. Returning empty local fallback.");
      return getLocalProjects();
    }
    console.log("[ProjectService] Successfully retrieved and mapped Sanity projects. Fallback NOT used.");
    
    // Map projects defensively to continue rendering valid projects if one has mapping errors
    const mapped = [];
    for (const doc of docs) {
      try {
        mapped.push(mapSanityProject(doc));
      } catch (err) {
        console.warn(`[ProjectService] Skip mapping project "${doc.title || doc._id}" due to error:`, err);
      }
    }
    return mapped;
  } catch (error) {
    console.error("[ProjectService] Error fetching from Sanity, returning empty local fallback:", error);
    return getLocalProjects();
  }
}

export async function fetchProjectBySlug(slug) {
  if (!slug) return null;

  console.log(`[ProjectService] Fetching project by slug: "${slug}". Configured: ${isSanityConfigured}, ProjectID: ${import.meta.env.VITE_SANITY_PROJECT_ID}`);

  if (!isSanityConfigured) {
    console.log(`[ProjectService] Sanity not configured for slug "${slug}". Using local fallback.`);
    const local = projectsData[slug.toLowerCase()];
    return local ? mapLocalProject(slug, local) : null;
  }

  try {
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      category,
      coverImage,
      gallery,
      shortDescription,
      fullDescription,
      techStack,
      clientName,
      completionDate,
      liveUrl,
      githubUrl,
      isConfidenceFeatured,
      confidencePriority,
      isProofFeatured,
      proofPriority,
      homepageSpotlight,
      showOnHomepage,
      challengeSummary,
      thinkingSummary,
      thinkingPillars,
      designSummary,
      designColors,
      engineeringDescription,
      engineeringSpecs,
      outcomes
    }`;
    const doc = await client.fetch(query, { slug });
    console.log(`[ProjectService] Sanity query for slug "${slug}" returned:`, doc ? "Document Found" : "Not Found");

    if (!doc) {
      console.warn(`[ProjectService] Slug "${slug}" not found in Sanity. Checking local data.`);
      const local = projectsData[slug.toLowerCase()];
      return local ? mapLocalProject(slug, local) : null;
    }
    console.log(`[ProjectService] Successfully retrieved Sanity project for slug "${slug}". Fallback NOT used.`);
    
    try {
      return mapSanityProject(doc);
    } catch (err) {
      console.error(`[ProjectService] Error mapping project "${doc.title || slug}":`, err);
      return null;
    }
  } catch (error) {
    console.error(`[ProjectService] Error fetching slug "${slug}" from Sanity. Checking local data:`, error);
    const local = projectsData[slug.toLowerCase()];
    return local ? mapLocalProject(slug, local) : null;
  }
}
