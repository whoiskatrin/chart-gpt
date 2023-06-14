declare module 'bard-ai' {
  export function init(key: string): Promise<void>;
  export function askAI(prompt: string, useJSON?: boolean): Promise<string>;
}
