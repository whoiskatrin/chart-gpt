import { TextareaHTMLAttributes } from 'react';

export const TextArea = ({
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      rows={5}
      className="w-full min-w-[10rem] focus:outline-none focus:ring-1 rounded-md border shadow-sm border-gray-300 dark:border-gray-700 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
      {...props}
    />
  );
};
