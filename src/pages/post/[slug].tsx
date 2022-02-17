import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(post: PostProps) {
  console.log(post)
  return (
    <div>
      <div className={styles.bannerContainer}>
        <img src={post.post.data.banner.url} alt={`Banner do post ${post.post.data.title}`} className={styles.banner} />
      </div>
      <div className={styles.container}>
        <h1>{post.post.data.title}</h1>
        <div className={styles.postInfo}>
          {//parei aqui
          }
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([Prismic.predicates.at('document.type', 'posts')]
  );

  return {
    paths: posts.results.map(post => ({
      params: { slug: post.uid },
    })),
    fallback: true
  }
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      "dd/MM/yyyy",
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content.map((content) => ({
        heading: content.heading,
        body: [...content.body],
      }))
    }
  }

  return {
    props: {
      post
    }

  }
};
