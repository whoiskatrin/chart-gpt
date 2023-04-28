export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const LIBRARY_PROMPT = (val: String) => `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12, "color": "#4285F4" }] for Recharts API. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric.\n Make sure the format use double quotes and property names are string literals. \n\n${val}\n Provide JSON data only.`

export const CHART_TYPES = new Set(["area", "bar", "line", "composed", "scatter", "pie",
                                   "radar", "radialbar", "treemap", "funnel"]);  

export const UNSUPPORTED_CHART_TYPE_CODE = "UNSUPPORTED_CHART_TYPE";
export const UNSUPPORTED_CHART_TYPE_TEXT = "Unsupported Chart Type";
export const INTERNAL_SERVER_ERROR_CODE = "INTERNAL_SERVER_ERROR";
export const INTERNAL_SERVER_ERROR_TEXT = "Internal Server Error";