import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'tc69cz7a',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})