import React from "react";

type Props = {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
}

export default function ApiKey({ apiKey, setApiKey}: Props) {
  const [inputValue, setInputValue] = React.useState(apiKey);
  
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setApiKey(inputValue);
  }
  
  return (    
    <div className="p-5 border-t-2">
      <form onSubmit={handleSubmit} className="flex flex-row gap-2 justify-center">
        <input 
          type="text" 
          className="base-2/3 border border-gray-300 rounded-md px-2 py-1" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}/>
        <button type="submit" className=" base-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
