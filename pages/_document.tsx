import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/chart-gpt-logo.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        <title>ChartGPT</title>
        <meta property="og:title" content="ChartGPT" />
        <meta
          property="og:image"
          content="https://www.chartgpt.dev/chartgpt-og.png"
        />
        <meta property="og:url" content="https://www.chartgpt.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
        <meta
          property="og:description"
          content="A tool that converts text into beautiful charts"
        />
        <meta
          name="description"
          content="A tool that converts text into beautiful charts"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@whoiskatrin" />
        <meta name="twitter:title" content="ChartGPT - text to charts" />
        <meta
          name="twitter:description"
          content="A tool that converts text into beautiful charts"
        />
        <meta
          name="twitter:image"
          content="https://www.chartgpt.dev/chartgpt-og.png"
        />
      </Head>

      <link
        href="https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap"
        rel="stylesheet"
      />

      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3321538724829930"
        crossOrigin="anonymous"
      ></script>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
