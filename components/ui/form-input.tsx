'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Icon } from './icon';

type FormInputSize = 'sm' | 'md' | 'lg';

type FormInputProps = {
  size?: FormInputSize;
  filled?: boolean;
  required?: boolean;
} & Omit<ComponentPropsWithoutRef<'input'>, 'size'> &
  Omit<ComponentPropsWithoutRef<'textarea'>, 'size'>;

const SIZE_CLASS: Record<FormInputSize, string> = {
  sm: 'h-[41px] px-[20px] py-[10px]',
  md: 'h-[52px] px-[20px]',
  lg: 'h-[130px] p-[20px]',
};

const baseClass =
  'w-full rounded-[10px] text-[16px] text-[#333] placeholder:text-[14px] placeholder:text-[#666] outline-none';

export const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(function FormInput(
  { size = 'md', filled = false, required = false, className, ...props },
  ref
) {
  const stateClass = filled
    ? 'bg-white border border-[#b3b3b3]'
    : 'bg-[#fbfbfb]';

  const combinedClass = `${baseClass} ${SIZE_CLASS[size]} ${stateClass} ${className ?? ''}`;

  return (
    <span className="relative inline-flex w-full items-center">
      {size === 'lg' ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={combinedClass}
          {...(props as ComponentPropsWithoutRef<'textarea'>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={combinedClass}
          {...(props as ComponentPropsWithoutRef<'input'>)}
        />
      )}
      {required && (
        <span className="pointer-events-none absolute right-3">
          <Icon name="required" size={10} />
        </span>
      )}
    </span>
  );
});
