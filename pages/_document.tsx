import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/chart-gpt-logo.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>ChartGPT</title>
        <meta
          name="description"
          content="A tool that converts text into beautiful charts"
        />
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
