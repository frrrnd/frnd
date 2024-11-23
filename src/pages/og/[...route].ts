import { OGImageRoute } from 'astro-og-canvas';

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  
  // Usando getStaticPaths explicitamente para ter mais controle
  getStaticPaths: async () => {
    const pages = await import.meta.glob('/src/content/**/*.md', { eager: true });
    
    return Object.entries(pages).map(([path, page]: [string, any]) => {
      // Extrai o slug do caminho do arquivo
      const slug = path
        .replace('/src/content/', '')
        .replace('.md', '')
        .replace(/^\/|\/$/g, '');
        
      return {
        params: { route: slug },
        props: {
          title: page.frontmatter.title,
          description: page.frontmatter.description
        }
      };
    });
  },

  // Configuração da imagem
  generate: ({ props }) => ({
    title: props.title,
    description: props.description,
    
    options: {
      bgColor: '#FFFFFF',
      fontTitle: 'Inter Bold',
      fontDescription: 'Inter Regular',
      titleColor: '#111111',
      descriptionColor: '#333333',
      pattern: 'circuit'
    }
  })
});