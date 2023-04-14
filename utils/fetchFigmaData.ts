import { GraphQLClient, gql } from "graphql-request";

const fetchFigmaData = async (fileId: any) => {
  const graphQLClient = new GraphQLClient("https://api.grafbase.com/graphql");

  const query = gql`
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
    const data: any = await graphQLClient.request(query, variables);
    return data.figma.data;
  } catch (error) {
    throw new Error(`Failed to fetch Figma data: ${(error as Error).message}`);
  }
};

export default fetchFigmaData;
