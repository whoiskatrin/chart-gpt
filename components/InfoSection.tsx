// components/InfoSection.tsx
import React from "react";

const InfoSection: React.FC = () => {
  return (
    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
      <h2 className="font-semibold text-2xl mb-4 text-gray-800 dark:text-gray-200">
        How to use this tool
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        <p>
          To get started, simply enter a description of your data and the
          desired single chart type in the input field. Our generator will
          create the chart for you in just a few seconds!
        </p>
      </p>
      <h3 className="font-semibold text-xl mt-6 mb-4 text-gray-800 dark:text-gray-200">
        Supported Chart Types
      </h3>
      <ul className=" pl-6 text-gray-700 dark:text-gray-300">
        <li>Area Chart</li>
        <li>Bar Chart</li>
        <li>Line Chart</li>
        <li>Composed Chart</li>
        <li>Scatter Chart</li>
        <li>Pie Chart</li>
        <li>Radar Chart</li>
        <li>Radial Bar Chart</li>
        <li>Treemap</li>
        <li>Funnel Chart</li>
      </ul>
    </div>
  );
};

export default InfoSection;
