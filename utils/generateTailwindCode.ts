import { GraphQLClient, gql } from "graphql-request";

const generateTailwindCode = async (
  processedData: any,
  openaiApiKey: string
) => {
  const graphQLClient = new GraphQLClient("https://api.grafbase.com/graphql");

  const query = gql`
    mutation generateTailwindCode($data: String!, $apiKey: String!) {
      generateTailwindCode(data: $data, apiKey: $apiKey)
    }
  `;

  const variables = {
    data: JSON.stringify(processedData),
    apiKey: openaiApiKey,
  };

  try {
    const data: any = await graphQLClient.request(query, variables);
    const tailwindCode = data.generateTailwindCode;
    return tailwindCode;
  } catch (error) {
    throw new Error(
      `Failed to fetch Tailwind data: ${(error as Error).message}`
    );
  }
};

export default generateTailwindCode;
