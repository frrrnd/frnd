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
    })
});

const worksCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean(),
        description: z.string(),
        tags: z.array(z.string()),
        type: z.string(z.string()).optional(),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        cover: image().refine((img) => img.width >= 200, {
            message: "Imagem errada",
        }),
        order: z.number(),
    })
});

const labsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean(),
        description: z.string(),
        tags: z.array(z.string()),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val))
    })
});

export const collections = {
    'works': worksCollection,
    'labs': labsCollection,
    'notes': notesCollection
}