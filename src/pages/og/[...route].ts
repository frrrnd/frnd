import { OGImageRoute } from 'astro-og-canvas';

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,

  getImageOptions: async (_, {data,slug}: (typeof pages)[string]) => {
    return {
      title: page.frontmatter.title,
      description: page.frontmatter.description,

      options: {
          bgColor: '#FFFFFF',
          fontTitle: 'Inter Bold',
          fontDescription: 'Inter Regular',
          titleColor: '#111111',
          descriptionColor: '#333333',
          pattern: 'circuit'
        },
    }
  }
});