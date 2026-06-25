import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { structure } from './structure'

export default defineConfig({
  name: 'orvum',
  title: 'ORVUM CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  document: {
    productionUrl: async (prev, ctx) => {
      const { document } = ctx
      if (document._type === 'post') {
        return `https://www.orvum.com/blog/${(document as { slug?: { current: string } }).slug?.current}`
      }
      return prev
    },
  },
})
