import { Switch as HeadlessSwitch } from '@headlessui/react';
import clsx from 'clsx';

type ToggleSize = 'sm' | 'md' | 'lg';
export const ToggleSizes: { [key: string]: ToggleSize } = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
};

export interface ToggleProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  size?: ToggleSize;
  label: string;
  disabled?: boolean;
  id?: string;
}

export const Toggle = ({
  id,
  checked,
  setChecked,
  size = 'md',
  label,
  disabled = false,
}: ToggleProps) => {
  return (
    <HeadlessSwitch
      id={id}
      checked={checked}
      disabled={disabled}
      onChange={setChecked}
      className={clsx(
        'bg-gray-200 dark:bg-gray-500/20 relative inline-flex items-center rounded-full border border-transparent',
        'outline-none transition focus:outline-none focus-visible:border focus-visible:ring',
        {
          '!bg-blue-500': checked,
        },
        {
          'h-5 w-[36px]': size === 'sm',
          'h-6 w-11': size === 'md',
          'h-8 w-[60px]': size === 'lg',
        }
      )}
    >
      <span className="sr-only">{label}</span>
      <span
        className={clsx(
          'inline-block transform rounded-full bg-white shadow-sm transition duration-75',
          {
            'h-[14px] w-[14px]': size === 'sm',
            'h-4 w-4': size === 'md',
            'h-[22px] w-[22px]': size === 'lg',
          },
          {
            'translate-x-[3px]': size === 'sm' && !checked,
            'translate-x-[18px]': size === 'sm' && checked,

            'translate-x-[4px]': size === 'md' && !checked,
            'translate-x-[23px]': size === 'md' && checked,

            'translate-x-[5px]': size === 'lg' && !checked,
            'translate-x-[32px]': size === 'lg' && checked,
          }
        )}
      />
    </HeadlessSwitch>
  );
};
