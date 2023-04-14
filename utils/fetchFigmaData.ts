import { GraphQLClient } from "graphql-request";
import { query as gqlQuery } from "grafbase";

const fetchFigmaData = async (fileId) => {
  const graphQLClient = new GraphQLClient("https://api.grafbase.com/graphql");

  const query = gqlQuery`
    query fetchFigmaData($fileId: String!, $apiKey: String!) {
      figma(fileId: $fileId, apiKey: $apiKey) {
        data
      }
    }
  `;

  const variables = {
    fileId: fileId,
    apiKey: process.env.NEXT_PUBLIC_FIGMA_API_KEY,
  };

  try {
    const data = await graphQLClient.request(query, variables);
    return data.figma.data;
  } catch (error) {
    throw new Error(`Failed to fetch Figma data: ${error.message}`);
  }
};

export default fetchFigmaData;
