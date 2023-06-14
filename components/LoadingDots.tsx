import { Ripples } from '@uiball/loaders';

const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center mx-auto">
      <span className="shrink-0">
        <Ripples size={45} speed={2} color="#3b82f6" />
      </span>
      <span className="ml-2 text-zinc-900 dark:text-zinc-100">
        Hang on, finding our artistic inspiration
      </span>
    </div>
  );
};

export default LoadingDots;
