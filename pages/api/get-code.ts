import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData } =  req.body;
    axios.defaults.baseURL = 'https://www.chartgpt.dev/';

    let response = await axios.post("/api/get-type", {
        "inputData": inputData
    });
  
    let result = await response.data;
    const chartType = result.trim();

    const prompt = `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
    [{ "name": "a", "value": 12, "color": "#4285F4" }] for Recharts API. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric.\n Make sure the format use double quotes and property names are string literals.
    \n\n${inputData}\n`;

    response = await axios.post("/api/parse-graph", {
        "prompt": prompt
    });

    result = await response.data;
    const parsedData = JSON.parse(result);

    const APIResponse = {"chartType":  chartType, "chartData": parsedData};

    res.status(200).send(APIResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
