// components/InfoSection.tsx
import React from 'react';

//need to set max-width: 40rem to max-w-4xl class by changing the class to max-w-2xl
const InfoSection: React.FC = () => {
	return (
		<div className='info-container max-w-2xl text-left text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-8'>
			<h2 className='text-left font-semibold text-2xl mb-4 font-inter font-bold sm:text-xl flex items-center bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent'>
				How to use this tool
			</h2>
			<p className='text-left text-gray-700 dark:text-gray-300'>
				<p>
					To get started, simply enter a description of your data and
					the desired single chart type in the input field. Our
					generator will create the chart for you in just a few
					seconds!
				</p>
			</p>
			<h3 className='text-left font-semibold text-xl mt-6 mb-4 font-inter font-bold sm:text-xl flex items-center bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent'>
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
		</div>
	);
};

export default InfoSection;
