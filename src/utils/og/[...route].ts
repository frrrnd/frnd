import { OGImageRoute } from 'astro-og-canvas';

const directory = "src/content";

const rawPages = import.meta.glob(`${directory}/**/*.md`, {
  eager: true
});

const pages = Object.entries(rawPages).reduce(
  (acc, [path, page]) => ({...acc, [path.replace(directory, "")]: page }),
  {}
);

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,

  getImageOptions: (path, page) => ({
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
  }),
});