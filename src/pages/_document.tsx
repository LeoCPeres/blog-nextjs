import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          <script
            async
            defer
            src={`//static.cdn.prismic.io/prismic.js?repo=blog-nextjsLCP&new=true`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
