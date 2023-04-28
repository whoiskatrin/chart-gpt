import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { LIBRARY_PROMPT, CHART_TYPES, UNSUPPORTED_CHART_TYPE_CODE, UNSUPPORTED_CHART_TYPE_TEXT, 
  INTERNAL_SERVER_ERROR_CODE, INTERNAL_SERVER_ERROR_TEXT } from "../constants";
import { sanitizeURL } from "../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData } =  req.body;
    axios.defaults.baseURL = sanitizeURL(`${process.env.VERCEL_URL}`);

    let response = await axios.post("/api/get-type", {
        "inputData": inputData
    });
  
    let result = await response.data;
    const chartType = result.trim();

    if (!CHART_TYPES.has(chartType)) {
      res.status(400).send({"errorCode": UNSUPPORTED_CHART_TYPE_TEXT, "errorText": UNSUPPORTED_CHART_TYPE_CODE});
    }

    const prompt = LIBRARY_PROMPT(inputData);

    response = await axios.post("/api/parse-graph", {
        "prompt": prompt
    });

    result = await response.data;
    const parsedData = JSON.parse(result);

    const APIResponse = {"chartType":  chartType, "chartData": parsedData};

    res.status(200).send(APIResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send({"errorCode": INTERNAL_SERVER_ERROR_CODE, "errorText": INTERNAL_SERVER_ERROR_TEXT});
  }
}
