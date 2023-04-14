import { GraphQLClient } from "graphql-request";
import { query as gqlQuery } from "grafbase";

const generateTailwindCode = async (processedData, openaiApiKey) => {
  const graphQLClient = new GraphQLClient("https://api.grafbase.com/graphql");

  const query = gqlQuery`
    mutation generateTailwindCode($data: String!, $apiKey: String!) {
      generateTailwindCode(data: $data, apiKey: $apiKey)
    }
  `;

  const variables = {
    data: JSON.stringify(processedData),
    apiKey: openaiApiKey,
  };

  try {
    const data = await graphQLClient.request(query, variables);
    const tailwindCode = data.generateTailwindCode;
    return tailwindCode;
  } catch (error) {
    throw new Error(`Failed to generate Tailwind CSS code: ${error.message}`);
  }
};

export default generateTailwindCode;
