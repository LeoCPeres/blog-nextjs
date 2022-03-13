import Link from 'next/link';
import Head from 'next/head';
import styles from './styles/404.module.scss';

export default function Custom404() {
  return (
    <>
      <div>
        <Head>
          <title>404 - oops!</title>
        </Head>
        <div className={styles.fourohfour}>
          <h1>404 - Page Not Found</h1>
          <Link href="/">
            <a>Go back home</a>
          </Link>
        </div>
      </div>
    </>
  );
}
