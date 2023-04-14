const OPENAI_API_KEY = "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";
const OPENAI_API_URL =
  "https://api.openai.com/v1/engines/davinci-codex/completions";

export async function generateTailwindCSS(node: any): Promise<string> {
  const prompt = `Convert the following Figma design node to Tailwind CSS:

Node type: ${node.type}
${JSON.stringify(node, null, 2)}

Tailwind CSS code:
`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Error generating Tailwind CSS code: " + response.status);
    }

    const data = await response.json();
    const generatedCode = data.choices[0]?.text.trim();
    console.log(generatedCode);
    return generatedCode;
  } catch (error) {
    console.error("Error generating Tailwind CSS code:", error);
    return "";
  }
}
