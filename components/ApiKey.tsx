import React from "react";

type Props = {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
}

export default function ApiKey({ apiKey="", setApiKey}: Props) {
  const [inputValue, setInputValue] = React.useState(apiKey);
  const [maskApiKey, setMaskApiKey] = React.useState(mask(apiKey));
  
  // Function should return apiKey with all but last 4 characters masked
  function mask (apiKey: string) {
    const length = apiKey.length;
    return apiKey.slice(0, length - 4).replace(/./g, '*') + apiKey.slice(length - 4);
  }
  
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setApiKey(inputValue);
    setMaskApiKey(mask(inputValue));
  }

  const handleReset = () => {
    setInputValue("");
    setApiKey("");
    setMaskApiKey("");
  }
  
  return (    
    <div className="pt-5">
      { apiKey === "" ? 
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="border border-gray-300 rounded-md py-3 w-full" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}/>
          <button
            type="submit"
            className="mt-2 p-2 cursor-pointer font-semibold rounded-xl blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl"
          >
                Save
          </button>
        </form>
        :
        <div>
          <input 
            type="text" 
            className="border border-gray-300 rounded-md py-3 w-full" 
            value={maskApiKey} 
            disabled={true}
          />
          <button type="button" 
            className="mt-2 p-2 cursor-pointer font-semibold rounded-xl bg-red-600 text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      } 
    </div>
  );
}
