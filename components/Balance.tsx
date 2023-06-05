import { FC } from 'react';

interface BalanceProps {
  creditsRemaining: number | null | undefined;
  creditsLoading: boolean;
}

export const Balance: FC<BalanceProps> = ({
  creditsRemaining,
  creditsLoading,
}) => {
  if (creditsLoading) {
    return (
      <div>Loading...</div> // replace with your loading state
    );
  }

  if (typeof creditsRemaining === 'undefined') {
    return (
      <div>Error: No credit information available.</div> // replace with your error state
    );
  }

  return (
    <div className="rounded-full font-sans flex items-center justify-center text-sm font-medium px-4 py-1 bg-gradient-to-r from-blue-500 ">
      Remaining credits: {creditsRemaining}
    </div>
  );
};

export default Balance;
