import { z, defineCollection } from 'astro:content';

const notasCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        image: image().refine((img) => img.width >= 700, {
            message: "Imagem errada",
        }),
        cover: z.string().optional(),
    })
});

const portfolioCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean(),
        description: z.string(),
        tags: z.array(z.string()),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        image: image().refine((img) => img.width >= 1080, {
            message: "Imagem errada",
        }),
        cover: image().refine((img) => img.width >= 200, {
            message: "Imagem errada",
        }),
    })
});

const feedCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean(),
        description: z.string(),
        tags: z.array(z.string()),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        image: image().refine((img) => img.width >= 1080, {
            message: "Imagem errada",
        })
    })
});

const iconsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        isDraft: z.boolean(),
        description: z.string(),
        tags: z.array(z.string()),
        publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
        image: image().refine((img) => img.width >= 1080, {
            message: "Imagem errada",
        })
    })
});

export const collections = {
    'portfolio': portfolioCollection,
    'feed': feedCollection,
    'icons': iconsCollection,
    'notas': notasCollection
}