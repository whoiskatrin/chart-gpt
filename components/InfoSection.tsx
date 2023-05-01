import React, { ReactNode } from "react";

const ListItem = ({ children }: { children: ReactNode }) => (
  <li className="text-white">{children}</li>
);

const InfoSection: React.FC = () => {
  return (
    <div>
      <div className="mt-6 flex-auto flex flex-col justify-center items-center">
        <div className="shadow-lg from-gray-700 to-gray-400 w-10 h-10 rounded-full flex justify-center items-center font-bold text-white mb-4 bg-[url('/Blue.png')] bg-cover">
          1
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">
          Write your text query
        </h2>
        <p className="text-gray-500 px-8 text-center">
          Simply enter your data and desireed chart type and we will generate
          the chart for you.
        </p>
        <div className="w-full max-w-[720px]">
          <div className="bg-custom-gray text-base font-mono rounded-xl mt-8 mb-6 p-4 shadow-xl dark:shadow-outline-bright flex flex-col space-y-2 w-full">
            <span className="text-green-500 dark:text-green-400">
              you can request any data out there
            </span>
            <span className="text-white">---</span>
            <div className="Typist">
              <span className="font-semibold text-md pb-4 leading-loose text-white ">
                ## Example
              </span>
              <br />
              <span className="text-white">
                show me a bar chart with COVID-19 cases in London in March 2020
              </span>
              <span className="animate-pulse opacity-0">|</span>
            </div>
          </div>
        </div>
        <div className="w-1 h-16 bg-gray-200 rounded dark:bg-opacity-20"></div>
        <div className="mt-6 flex-auto flex flex-col items-center w-full">
          <div className="shadow-lg from-gray-700 to-gray-400 w-10 h-10 rounded-full flex justify-center items-center font-bold text-white mb-4 bg-[url('/Blue.png')] bg-cover">
            2
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">
            Supported charts
          </h2>
          <p className="text-gray-500 px-8 text-center">
            We are actively working to add more chart types in the new version
            of the app.
          </p>
          <div className="w-full max-w-[720px]">
            <div className="bg-custom-gray text-base font-mono rounded-xl mt-8 mb-6 p-4 shadow-xl dark:shadow-outline-bright flex flex-col space-y-2 w-full">
              <span className="text-green-500 dark:text-green-400">
                we use Recharts and Tremor libraries to draw
              </span>
              <span className="text-white">---</span>
              <div className="Typist">
                <span className="font-semibold text-md pb-4 leading-loose text-white ">
                  ## List
                </span>
                <br />
                <span className="text-white">
                  <ul className="text-left list-disc pl-6 text-white marker:text-blue-500">
                    <ListItem>Area Chart</ListItem>
                    <ListItem>Bar Chart</ListItem>
                    <ListItem>Line Chart</ListItem>
                    <ListItem>Composed Chart</ListItem>
                    <ListItem>Scatter Chart</ListItem>
                    <ListItem>Pie Chart</ListItem>
                    <ListItem>Radar Chart</ListItem>
                    <ListItem>Radial Bar Chart</ListItem>
                    <ListItem>Treemap</ListItem>
                    <ListItem>Funnel Chart</ListItem>
                  </ul>
                </span>
                <span className="animate-pulse opacity-0">|</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
