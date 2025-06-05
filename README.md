# Chart-GPT - text to beautiful charts within seconds

<div align="center">
    <img src="https://raw.githubusercontent.com/whoiskatrin/chart-gpt/main/public/chartgpt-og.png" width="600" />
     <img src="https://github.com/whoiskatrin/chart-gpt/blob/main/update.png" width="900" />
</div>

## Getting Started

This fork replaces Supabase and NextAuth with [Clerk](https://clerk.com/) for authentication and uses a Cloudflare Worker to store user credits.

To get started, first clone this repository:

```
git clone https://github.com/whoiskatrin/chart-gpt.git
cd chart-gpt
```

Then duplicate the `.env.example` template with `cp .env.example .env` and add your API keys for the language models you'd like to use:

```
BARD_KEY="your-bard-key"
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-claude-key"
```

Then install the dependencies and start the development server:

```
npm install
npm run dev
# or
yarn
yarn dev
```

This will start the development server at http://localhost:3000.

To use the full functionality of the credit system as well, you'll need to setup Clerk for authentication, Stripe for payments and a Cloudflare Worker to store user credits. Configure the required environment variables found in the `.env.example` file.

You can choose which model to generate chart data from by selecting "Bard", "OpenAI" or "Claude" in the UI. The backend automatically routes the request to the respective API.

To run the unit tests:

```
npm test
```

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork this repository.
2. Clone your forked repository:
3. For your changes:
4. Make your changes, commit them, and push them to your forked repository:
5. Create a pull request on this repository.
