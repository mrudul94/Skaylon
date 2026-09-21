// Project id is public (it appears in every API URL), so it's committed as the
// default; SANITY_STUDIO_PROJECT_ID can still point the Studio elsewhere.
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "94bjvovm";
export const dataset = process.env.SANITY_STUDIO_DATASET || "production";
