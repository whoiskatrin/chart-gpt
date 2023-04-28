import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Chart } from '../components/ChartComponent';
import axios from 'axios';
import SquigglyLines from '../components/SquigglyLines';
import LoadingDots from '../components/LoadingDots';
import Head from 'next/head';
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import InfoSection from '../components/InfoSection';

const CHART_TYPES = [
	'area',
	'bar',
	'line',
	'composed',
	'scatter',
	'pie',
	'radar',
	'radialbar',
	'treemap',
	'funnel',
];

const HomePage = () => {
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [chartType, setChartType] = useState('');
	const [chartData, setChartData] = useState([]);
	const [error, setError] = useState(false);
	const [shouldRenderChart, setShouldRenderChart] = useState(false);

	const chartComponent = useMemo(() => {
		return <Chart data={chartData} chartType={chartType} />;
	}, [chartData, chartType]);

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();

		setError(false);
		setIsLoading(true);

		try {
			const chartTypeResponse = await axios.post('/api/get-type', {
				inputData: inputValue,
			});

			if (!CHART_TYPES.includes(chartTypeResponse.data.toLowerCase()))
				return setError(true);

			setChartType(chartTypeResponse.data);

			const libraryPrompt = `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12, "color": "#4285F4" }] for Recharts API. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric.\n Make sure the format use double quotes and property names are string literals. \n\n${inputValue}\n`;

			const chartDataResponse = await axios.post('/api/parse-graph', {
				prompt: libraryPrompt,
			});

			let parsedData;

			try {
				parsedData = JSON.parse(chartDataResponse.data);
			} catch (error) {
				setError(true);
				console.error('Failed to parse chart data:', error);
			}

			setChartData(parsedData);
			setChartType(chartTypeResponse.data);
			setShouldRenderChart(true);
		} catch (error) {
			setError(true);
			console.error('Failed to generate graph data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setInputValue(event.target.value);
	};

	const handleCaptureClick = async (selector: string) => {
		const element = document.querySelector<HTMLElement>(selector);
		if (!element) {
			return;
		}
		const canvas = await html2canvas(element);
		const dataURL = canvas.toDataURL('image/png');
		downloadjs(dataURL, 'chart.png', 'image/png');
	};

	return (
		<div className='flex flex-col px-4 items-center justify-center min-h-screen bg-gradient-to-r from-slate-300 to-indigo-50 overflow-x-hidden'>
			<Header />
			<Head>
				<title>AI tool to convert text to beautiful chart</title>
			</Head>
			<div className='flex flex-col items-center w-full max-w-xl mb-6 gap-6 border-gray-300 bg-indigo-50 dark:text-white dark:bg-black dark:border dark:border-white/20 rounded-2xl p-4 h-52'>
				<form onSubmit={handleSubmit} className='w-full max-w-xl mb-6'>
					<div className='flex flex-col items-center justify-center h-44'>
						<label
							htmlFor='textInput'
							className='block font-inter font-semibold text-gray-700 dark:text-gray-200'
						>
							Describe your data with desired Chart type
							<SquigglyLines />
						</label>

						<textarea
							id='input'
							rows={3}
							placeholder=''
							className='appearance-none font-inter mt-8 border border-gray-300 dark:border-gray-600 shadow-sm flex flex-col items-center justify-center rounded-lg w-full max-w-md py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline text-left min-h-[46%]'
							value={inputValue}
							required
							autoFocus
							onChange={handleInputChange}
							onKeyDown={(event) => {
								if (
									event.key === 'Enter' &&
									(event.metaKey || event.ctrlKey)
								) {
									handleSubmit(event);
								}
							}}
						/>

						<button
							type='submit'
							className='cursor-pointer font-inter font-semibold py-2 px-4 mt-10 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center mt-3'
						>
							Draw
						</button>
					</div>
				</form>
			</div>
			{error ? (
				<p style={{ color: 'red' }}>Ooops! Could not generate</p>
			) : (
				<div className='w-full max-w-xl mb-6 p-4'>
					{isLoading ? (
						<div className='flex items-center justify-center h-96'>
							<LoadingDots />
						</div>
					) : (
						shouldRenderChart && (
							<>
								<div
									className='flex items-center justify-center p-4'
									style={{
										width: '100%',
										height: '300px',
										overflow: 'scroll',
									}}
								>
									{chartComponent}
								</div>
								<div className='flex flex-col items-center justify-center p-4'>
									<button
										type='button'
										className='cursor-pointer font-inter font-semibold py-2 px-4 mt-10 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center mt-3'
										onClick={() =>
											handleCaptureClick(
												'.recharts-wrapper'
											)
										}
									>
										Download
									</button>
								</div>
							</>
						)
					)}
					<InfoSection />
				</div>
			)}
			<footer className='text-center font-inter text-gray-700 text-sm mb-4'>
				Made with ❤️ using React, Next.js, Recharts, OpenAI and Tailwind
				CSS
			</footer>
		</div>
	);
};

export default HomePage;
