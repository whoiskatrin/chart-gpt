import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import type * as Radix from '@radix-ui/react-primitive';
import {
  Content,
  Group,
  Icon as IconPrimitive,
  Item,
  ItemIndicator,
  ItemText,
  Label as LabelPrimitive,
  SelectGroupProps as RadixSelectGroupProps,
  SelectItemProps as RadixSelectItemProps,
  SelectProps as RadixSelectProps,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  SelectContentProps,
  SelectIconProps,
  SelectPortalProps,
  SelectTriggerProps,
  SelectValueProps,
  Separator,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select';
import { Icon, Text } from '@tremor/react';
import { clsx } from 'clsx';
import React, { ElementType, forwardRef } from 'react';
import { LabelProps } from 'recharts';

export type SelectSize = 'sm' | 'md' | 'lg';
export const SelectSizes: { [key: string]: SelectSize } = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
};

export type SelectItemProps = {
  isDisabled?: boolean;
  className?: string;
} & Omit<RadixSelectItemProps, 'disabled'>;

export const SelectItem = forwardRef<
  React.ElementRef<typeof Item>,
  Radix.ComponentPropsWithoutRef<typeof Item> & SelectItemProps
>(({ children, textValue, isDisabled, className, ...props }, forwardedRef) => {
  return (
    <Item
      className={clsx(
        'text-sm mx-1 flex h-8 items-center rounded pl-[34px] pr-2 transition',
        'focus:bg-zinc-100 dark:focus:bg-zinc-800 cursor-pointer select-none outline-none focus:outline-none',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className
      )}
      disabled={isDisabled}
      {...props}
      ref={forwardedRef}
    >
      <ItemIndicator className="absolute left-2">
        <Icon
          icon={CheckIcon}
          size="sm"
          className="text-zinc-500 dark:text-zinc-400"
        />
      </ItemIndicator>
      <span className="truncate">
        <ItemText>{textValue || children}</ItemText>
      </span>
    </Item>
  );
});

export type SelectGroupProps = {
  label?: string;
  className?: string;
  separatorTop?: boolean;
  separatorBottom?: boolean;
} & RadixSelectGroupProps;

export const SelectGroup = forwardRef<
  React.ElementRef<typeof Group>,
  Radix.ComponentPropsWithoutRef<typeof Group> & SelectGroupProps
>(
  (
    {
      children,
      label,
      className,
      separatorTop = true,
      separatorBottom = false,
    },
    ref
  ) => {
    return (
      <>
        {separatorTop && <SelectSeparator className="mt-1" />}
        <Group ref={ref} className={clsx('mt-1', className)}>
          {label && (
            <LabelPrimitive className="text-zinc-700 mt-3 ml-3 mb-1 uppercase">
              {label}
            </LabelPrimitive>
          )}
          {children}
        </Group>
        {separatorBottom && <SelectSeparator className="my-1" />}
      </>
    );
  }
);

const SelectSeparator = forwardRef<
  React.ElementRef<typeof Separator>,
  Radix.ComponentPropsWithoutRef<typeof Separator> & { className?: string }
>(({ className }, ref) => {
  return (
    <Separator ref={ref} className={clsx('bg-zinc-100 h-px', className)} />
  );
});

export type IconColor =
  | 'blue'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink';

export type SelectProps = {
  label?: LabelProps;
  size?: SelectSize;
  isDisabled?: boolean;
  isRequired?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  leftIcon?: ElementType<any>;
  wrapperClassName?: string;
  className?: string;
  contentClassName?: string;
  leftIconColor?: IconColor;
  items?: SelectItemProps[];
} & Omit<RadixSelectProps, 'dir' | 'disabled' | 'required'> &
  Omit<SelectTriggerProps, 'asChild'> &
  Omit<SelectValueProps, 'asChild'> &
  Omit<SelectIconProps, 'asChild'> &
  SelectPortalProps &
  Omit<SelectContentProps, 'asChild'>;

export const Select = forwardRef<
  React.ElementRef<typeof Root>,
  Radix.ComponentPropsWithoutRef<typeof Root> & SelectProps
>(
  (
    {
      label,
      children,
      items,
      size = 'md',
      helpMessage,
      errorMessage,
      leftIcon,
      isDisabled,
      isRequired,
      value,
      onValueChange,
      defaultValue,
      name,
      open,
      onOpenChange,
      defaultOpen,
      placeholder,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      position = 'popper',
      side,
      sideOffset,
      align,
      alignOffset,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      arrowPadding,
      sticky,
      hideWhenDetached,
      wrapperClassName,
      className,
      contentClassName,
      leftIconColor,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <div className={clsx('relative h-fit w-full', wrapperClassName)}>
        <Root
          dir="ltr"
          name={name}
          disabled={isDisabled}
          required={isRequired}
          defaultValue={defaultValue}
          value={value}
          onValueChange={onValueChange}
          onChange={onValueChange}
          defaultOpen={defaultOpen}
          open={open}
          onOpenChange={onOpenChange}
          {...props}
        >
          <Trigger
            className={clsx(
              'data-[placeholder]:text-zinc-700/[50%] dark:data-[placeholder]:text-zinc-300/[50%] bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-md inline-flex w-full min-w-[244px] select-none items-center justify-between rounded-md pl-3 shadow-sm',
              'border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-500/30 border outline-none transition focus:outline-none focus:ring',
              'data-[disabled]:bg-gray-50 dark:data-[disabled]:bg-black data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75',
              className,
              {
                'h-8': size === 'sm',
                'h-10': size === 'md',
                'h-12': size === 'lg',
              },
              {
                'pl-[38px]': !!leftIcon,
              },
              {
                '!border-red-500 focus:!ring-red-500/30': !!errorMessage,
              }
            )}
            ref={forwardedRef}
          >
            {leftIcon && (
              <IconPrimitive
                className={clsx(
                  'text-zinc-700/[75%] pointer-events-none absolute left-1.5'
                )}
              >
                <Icon icon={leftIcon} size="md" color={leftIconColor} />
              </IconPrimitive>
            )}
            <span className="truncate">
              <Value placeholder={placeholder} aria-label={value} />
            </span>
            <IconPrimitive>
              <Icon
                icon={ChevronDownIcon}
                className="text-zinc-800 dark:text-zinc-100 pointer-events-none mt-[3px] pr-3"
                size="md"
              />
            </IconPrimitive>
          </Trigger>
          <Content
            onCloseAutoFocus={onCloseAutoFocus}
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            position={position}
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            avoidCollisions={avoidCollisions}
            collisionBoundary={collisionBoundary}
            collisionPadding={collisionPadding}
            arrowPadding={arrowPadding}
            sticky={sticky}
            hideWhenDetached={hideWhenDetached}
            className={clsx(
              'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-50 mt-1.5 max-h-[var(--radix-select-content-available-height)] w-[244px] overflow-auto rounded-md border py-1 shadow-lg focus:outline-none',
              contentClassName
            )}
          >
            <ScrollUpButton className="flex justify-center">
              <Icon
                icon={ChevronUpIcon}
                className="text-zinc-700 h-3.5 text-sm"
              />
            </ScrollUpButton>
            <Viewport>
              {items
                ? items.map(item => <SelectItem key={item.value} {...item} />)
                : children}
            </Viewport>
            <ScrollDownButton className="flex justify-center">
              <Icon
                icon={ChevronDownIcon}
                className="text-zinc-700 h-3.5 text-sm"
              />
            </ScrollDownButton>
          </Content>
        </Root>
        {(errorMessage || helpMessage) && (
          <div
            className={clsx(
              'mt-2 flex items-start gap-1 text-xs',
              { 'opacity-75': isDisabled },
              {
                'text-red-700 ': !!errorMessage,
                'text-zinc-700': !!helpMessage,
              }
            )}
          >
            <Text className="flex-wrap text-sm">
              {errorMessage || helpMessage}
            </Text>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
SelectGroup.displayName = 'SelectGroup';
SelectItem.displayName = 'SelectItem';
SelectSeparator.displayName = 'SelectSeparator';
