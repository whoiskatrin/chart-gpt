import React from "react";

const LoadingDots = () => {
  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen">
        <button className="flex items-center py-2 px-5 mt-5 mb-5 rounded-full bg-blue-600 text-white font-bold">
          <div className="flex items-center justify-center m-[10px]">
            <div className="h-3 w-3 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
            <div className="ml-2 font-sans font-semibold">
              hang on, finding our artistic inspiration{" "}
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default LoadingDots;
