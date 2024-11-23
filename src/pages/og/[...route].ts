import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  
  getStaticPaths: async () => {
    try {
      // Pegando todas as coleções
      const [labs, notes, works] = await Promise.all([
        getCollection('labs'),
        getCollection('notes'),
        getCollection('works')
      ]);

      console.log('Encontrados:', {
        labs: labs.length,
        notes: notes.length,
        works: works.length
      });

      // Combinando todas as coleções
      const allContent = [...labs, ...notes, ...works];

      return allContent.map((entry) => ({
        params: { 
          route: `${entry.collection}/${entry.slug}`
        },
        props: {
          title: entry.data.title || 'Título Padrão',
          description: entry.data.description || 'Descrição Padrão'
        }
      }));
    } catch (error) {
      console.error('Erro:', error);
      return [];
    }
  },

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