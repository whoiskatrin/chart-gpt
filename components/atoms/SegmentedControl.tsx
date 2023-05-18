import { Tab } from '@headlessui/react';
import { Icon } from '@tremor/react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { ElementType, Fragment, PropsWithChildren, ReactNode } from 'react';

export interface SegmentedControlProps extends PropsWithChildren {
  defaultTab?: number;
  /**Only applied when using items, otherwise you'll need to apply individually.*/
  fullWidth?: boolean;
  items?: Omit<SegmentedControlItemProps, 'fullWidth'>[];
  selectedIndex?: number;
  setSelectedIndex?: (index: number) => void;
}

export interface SegmentedControlItemProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  icon?: ElementType<any>;
}

/** Pass `tab` as the index of the tab you want to open by default. */
export const SegmentedControl = ({
  children,
  defaultTab,
  items,
  fullWidth,
  selectedIndex,
  setSelectedIndex,
}: SegmentedControlProps) => {
  return (
    <Tab.Group
      defaultIndex={defaultTab}
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
    >
      {items && (
        <SegmentedControlList fullWidth={fullWidth}>
          {items.map((item, index) => (
            <SegmentedControlListItem
              key={index}
              fullWidth={fullWidth}
              {...item}
            />
          ))}
        </SegmentedControlList>
      )}
      {children}
    </Tab.Group>
  );
};

export const SegmentedControlList = ({
  children,
  className,
  fullWidth = false,
}: PropsWithChildren & { className?: string; fullWidth?: boolean }) => {
  return (
    <Tab.List
      className={clsx(
        'bg-zinc-100 dark:bg-zinc-800 flex h-10 appearance-none items-center overflow-auto rounded-lg p-1',
        {
          'max-w-fit': !fullWidth,
        },
        className
      )}
    >
      {children}
    </Tab.List>
  );
};

export const SegmentedControlListItem = ({
  children,
  className,
  fullWidth = false,
  icon,
}: SegmentedControlItemProps) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <div
          className={clsx(
            'relative flex h-8 min-w-[124px] cursor-pointer appearance-none items-center justify-center focus:outline-none',
            {
              'w-full': fullWidth,
            },
            className
          )}
        >
          {selected && (
            <motion.div
              className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 absolute inset-0 z-[1] flex items-center justify-center rounded-md border-[0.5px]"
              layoutId="active"
              transition={{
                duration: 0.15,
              }}
            />
          )}
          <span className="z-[2] flex items-center justify-center">
            {icon && (
              <Icon
                size="sm"
                icon={icon}
                className="mr-3 text-zinc-700 dark:text-zinc-300"
              />
            )}
            {children}
          </span>
        </div>
      )}
    </Tab>
  );
};

export const SegmentedControlPanelGroup = ({ children }: PropsWithChildren) => {
  return <Tab.Panels>{children}</Tab.Panels>;
};

export const SegmentedControlPanel = ({ children }: PropsWithChildren) => {
  return <Tab.Panel className="focus:outline-none">{children}</Tab.Panel>;
};
