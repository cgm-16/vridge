'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  id: string;
};

export function PasswordInput({ id, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn(
        'flex h-[60px] items-center gap-2.5 rounded-[10px] border border-[#b3b3b3] bg-white px-5',
        className
      )}
    >
      <Icon name="password" size={24} alt="lock" className="shrink-0" />
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="flex-1 bg-transparent text-lg outline-none placeholder:text-[#999]"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="shrink-0"
        aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        <Icon name={show ? 'hidden' : 'show'} size={24} />
      </button>
    </div>
  );
}
