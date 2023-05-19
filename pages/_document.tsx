import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        <title>RoadmapGPT</title>
        <meta property="og:title" content="RoadmapGPT" />
      </Head>

      <link
        href="https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap"
        rel="stylesheet"
      />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
