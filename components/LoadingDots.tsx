import React from 'react';
import styles from '../styles/loading-dots.module.css';

const LoadingDots = () => {

	return (
		<>
		<div className='flex items-center justify-center w-screen h-screen'>
			<button className='flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white font-bold'>
			<div className="flex items-center justify-center m-[10px]"> 
            <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
            <div className="ml-2"> Processing... </div>
        </div>
		</button>
		</div>
		</>
	);
};

export default LoadingDots;
