import clsx from 'clsx';
import { Tooltip as RechartsTooltip, TooltipProps } from 'recharts';

export const Tooltip = ({
  legendColor,
  ...props
}: { legendColor?: string } & TooltipProps<any, any>) => {
  return (
    <RechartsTooltip
      wrapperStyle={{ outline: 'none' }}
      isAnimationActive={false}
      cursor={{ fill: '#d1d5db', opacity: '0.15' }}
      position={{ y: 0 }}
      {...props}
      content={({ active, payload, label }) => {
        return active && payload ? (
          <div className="bg-white text-sm rounded-md border shadow-lg">
            <div className="border-b py-2 px-4">
              <p className="text-elem text-gray-700 font-medium">{label}</p>
            </div>
            <div className="space-y-1 py-2 px-4">
              {payload.map(({ value, name }, idx: number) => (
                <div
                  key={`id-${idx}`}
                  className="flex items-center justify-between space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={clsx(
                        'shrink-0 h-3 w-3 border-white rounded-full border-2 shadow-md'
                      )}
                      style={{ backgroundColor: legendColor }}
                    />
                    <p className="font-medium tabular-nums text-right whitespace-nowrap text-gray-700">
                      {value}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-normal text-gray-500">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }}
    />
  );
};
