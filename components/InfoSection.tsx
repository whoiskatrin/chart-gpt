// components/InfoSection.tsx
import { Card, Text, Title } from "@tremor/react";
import React from "react";

const InfoSection: React.FC = () => {
	return (
		<Card className='max-w-xl mb-8 dark:bg-gray-800'>
			<Title className='bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent font-bold sm:text-xl text-2xl mb-4'>
				How to use this tool
			</Title>
			<Text>
				To get started, simply enter a description of your data and the desired
				single chart type in the input field. Our generator will create the
				chart for you in just a few seconds!
			</Text>
			<h3 className='text-xl mt-6 mb-4 font-inter font-bold sm:text-xl flex items-center bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent'>
				Supported Chart Types
			</h3>
			<ul className='text-left list-disc pl-6 text-gray-700 dark:text-gray-300 marker:text-sky-400'>
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
		</Card>
	);
};

export default InfoSection;
