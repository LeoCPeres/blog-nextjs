import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { Loader } from '../../components/Loader';


import Custom404 from '../404';
import Comment from '../../components/Comment/index';
import Prismic from '@prismicio/client';
import styles from './post.module.scss';
import hash from 'object-hash';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
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
  const router = useRouter();
  if (router.isFallback) {
    return <Loader />;
  }

  const wordsPerMinute = 200;
  const totalWords = Math.round(
    post.post.data.content.reduce(
      (acc, content) =>
        acc +
        content.heading.split(' ').length +
        content.body.reduce(
          (acc2, body) => acc2 + body.text.split(' ').length,
          0
        ),
      0
    )
  );
  const totalMinutes = Math.ceil(totalWords / wordsPerMinute);

  return (
    <div>
      <div className={styles.bannerContainer}>
        <img
          src={post.post.data.banner.url}
          alt={`Banner do post ${post.post.data.title}`}
          className={styles.banner}
        />
      </div>
      <div className={styles.container}>
        <h1>{post.post.data.title}</h1>
        <div className={styles.postInfo}>
          <div>
            <FiCalendar />
            <span>
              {format(
                new Date(post.post.first_publication_date),
                'dd MMM yyyy',
                {
                  locale: ptBR,
                }
              )}
            </span>
          </div>
          <div>
            <FiUser />
            <span>{post.post.data.author}</span>
          </div>
          <div>
            <FiClock />
            <span>{totalMinutes} min</span>
          </div>
        </div>

        {post.post.data.content.map(content => {
          return (
            <div
              key={hash({ ...content, ts: new Date().getTime() })}
              className={styles.content}
            >
              <h2 className={styles.contentHeading}>{content.heading}</h2>

              <div
                className={styles.contentBody}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              ></div>
            </div>
          );
        })}
      </div>
      <Comment />
    </div>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  return {
    paths: posts.results.map(post => ({
      params: { slug: post.uid },
    })),
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: [...content.body],
      })),
    },
  };

  return {
    props: {
      post,
    },
  };
};
