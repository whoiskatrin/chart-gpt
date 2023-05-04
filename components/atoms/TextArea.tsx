import { TextareaHTMLAttributes } from 'react';

export const TextArea = ({
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      rows={5}
      className="bg-white dark:bg-zinc-900 w-full min-w-[10rem] rounded-md shadow-sm border-gray-300 dark:border-gray-700 text-md placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent focus:border-blue-500 focus:ring-blue-500/30 border outline-none transition focus:outline-none focus:ring"
      {...props}
    />
  );
};
