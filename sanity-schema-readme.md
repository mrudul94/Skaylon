# Sanity CMS Project Schema

This document outlines the Sanity CMS schema definition for the `project` document type required by Skaylon.

## Field Schema Definition (`project.js`)

Copy the code below into your Sanity Studio schemas directory (e.g. `schemas/project.js` or `schemaTypes/project.js` for v3):

```javascript
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category / Sector',
      type: 'string',
      description: 'e.g. Media Technology, Premium Consumer & Wellness, Interactive Entertainment',
      validation: Rule => Rule.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'gallery',
      title: 'Project Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Gallery of mockups or screenshots for the case study page.'
    },
    {
      name: 'shortDescription',
      title: 'Short Description / Tagline',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    },
    {
      name: 'fullDescription',
      title: 'Full Case Study Description',
      type: 'text',
      rows: 8,
      validation: Rule => Rule.required(),
    },
    {
      name: 'techStack',
      title: 'Technology Stack',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'List of tools and languages used (e.g., React, Rust, Go, Redis)',
      validation: Rule => Rule.required(),
    },
    {
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'completionDate',
      title: 'Completion Date / Timeline',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    },
    {
      name: 'isConfidenceFeatured',
      title: 'Feature in Confidence Section (Chapter 3)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'confidencePriority',
      title: 'Confidence Section Priority',
      type: 'number',
      description: 'Manually sort projects in Confidence (ascending: 1, 2, 3...)',
    },
    {
      name: 'isProofFeatured',
      title: 'Feature in Proof Section (Chapter 4)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'proofPriority',
      title: 'Proof Section Priority',
      type: 'number',
      description: 'Manually sort projects in Proof (ascending: 1, 2, 3...)',
    },
    {
      name: 'homepageSpotlight',
      title: 'Homepage Spotlight',
      type: 'boolean',
      description: 'Set to true to make this the large flagship spotlight project at the top of the Proof section (only one project should be active).',
      initialValue: false,
    },
    {
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    },
  ],
}
```

## Setup Instructions

1. **Environment Variables**: Update your local `.env` or `.env.local` file with the following variables:
   ```env
   VITE_SANITY_PROJECT_ID=your_sanity_project_id
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2026-06-10
   ```
2. **Local Fallback**: If these environment variables are missing, the website automatically falls back to local data defined in `src/data/projectsData.js`.
