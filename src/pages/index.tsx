import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi'
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleGetNextPagePosts() {

    const response = await fetch(nextPage).then((response) => response.json());
    //pega as informações da próxima página

    const newPosts = response.results.map((post) => { //pega apenas os dados do post
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          "dd/MM/yyyy",
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }
    });

    setNextPage(response.next_page); //salva a next_page
    setPosts([...posts, ...newPosts])
    //atualiza o estado com os posts antigos + os da nova página respeitando a imutabilidade
  }

  return (
    <main className={styles.container}>
      {posts.map(post => {
        return (
          <Link href={`/${post.uid}`} key={post.uid}>
            <a href="" className={styles.post}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <FiCalendar />
                  {post.first_publication_date}
                </span>
                <span>
                  <FiUser />
                  {post.data.author}
                </span>
              </div>
            </a>
          </Link>
        )
      })}

      {nextPage != null ? (<span className={styles.loadPosts} onClick={handleGetNextPagePosts}>Carregar mais posts</span>) : ""}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 1,
    }
  );

  const next_page = postsResponse.next_page;
  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        "dd/MM/yyyy",
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })


  return {
    props: {
      postsPagination: {
        results: results,
        next_page: next_page
      }
    }

  }
};
