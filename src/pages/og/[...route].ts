import { OGImageRoute } from 'astro-og-canvas';

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  
  getStaticPaths: async () => {
    // Pegando todos os arquivos MDX de todas as subpastas
    const pages = await import.meta.glob('/src/content/**/*.mdx', { eager: true });
    console.log('Arquivos encontrados:', Object.keys(pages));

    if (!pages || Object.keys(pages).length === 0) {
      console.error('Nenhum arquivo MDX encontrado');
      return [];
    }

    return Object.entries(pages).map(([path, page]: [string, any]) => {
      // Extraindo o caminho relativo mantendo a estrutura de pastas
      const relativePath = path
        .replace('/src/content/', '')
        .replace('.mdx', '');

      console.log('Processando:', {
        path,
        relativePath,
        frontmatter: page.frontmatter
      });

      // Verificando se temos os dados necessários
      if (!page.frontmatter) {
        console.warn(`Frontmatter não encontrado para: ${path}`);
        return null;
      }

      return {
        params: { 
          route: relativePath // Isso manterá a estrutura labs/file, notes/file, etc
        },
        props: {
          title: page.frontmatter.title || 'Título Padrão',
          description: page.frontmatter.description || 'Descrição Padrão',
          // Opcional: passar a categoria baseada na pasta
          category: relativePath.split('/')[0]
        }
      };
    }).filter(Boolean);
  },

  generate: ({ props, params }) => ({
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