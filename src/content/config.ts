import { z, defineCollection } from 'astro:content';

const notesCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        updateDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
        cover: z.string().optional(),
        colors: z.union([
            z.object({
              backgroundColor: z.string().optional(),
              textColor: z.string().optional(),
              linkColor: z.string().optional(),
            }),
            z.undefined(),
          ]).optional(),
    })
});

const worksCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean(),
        description: z.string(),
        tags: z.array(z.string()),
        year: z.string(),
        link: z.string().optional(),
        role: z.string(),
        type: z.string(),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        cover: image(),
        order: z.number(),
        icon: z.string().optional(),
        colors: z.union([
            z.object({
              backgroundColor: z.string().optional(),
              textColor: z.string().optional(),
              linkColor: z.string().optional(),
            }),
            z.undefined(),
          ]).optional(),
    })
});

const labsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean(),
        description: z.string(),
        tags: z.array(z.string()),
        type: z.string(z.string()).optional(),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        cover: image(),
    })
});

export const collections = {
    'works': worksCollection,
    'labs': labsCollection,
    'notes': notesCollection
}