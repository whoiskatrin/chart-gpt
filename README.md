# Chart-GPT - text to beautiful charts within seconds

<div align="center">
    <img src="https://raw.githubusercontent.com/whoiskatrin/chart-gpt/main/public/chartgpt-og.png" width="600" />
     <img src="https://github.com/whoiskatrin/chart-gpt/blob/main/update.png" width="900" />
</div>

## Getting Started

To get started, first clone this repository:

```
git clone https://github.com/whoiskatrin/chart-gpt.git
cd chart-gpt
```

Then duplicate the `.env.example` template with `cp .env.example .env` and add your PaLM API key:

```
BARD_KEY="your-api-key"
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

To use the full functionality of the credit system as well, you'll need to setup Supabase, Stripe, and NextAuth with Google — and their respective environment variables found in the `.env.example` file.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork this repository.
2. Clone your forked repository:
3. For your changes:
4. Make your changes, commit them, and push them to your forked repository:
5. Create a pull request on this repository.
