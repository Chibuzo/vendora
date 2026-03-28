'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { inputShellVariants } from '@/shared/components/ui/input';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  suggestions?: string[];
  onSuggestionSelect?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchInput({
  className,
  suggestions = [],
  onSuggestionSelect,
  size = 'md',
  value,
  onChange,
  ...props
}: SearchInputProps) {
  const generatedId = React.useId();
  const listId = `${generatedId}-listbox`;
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [internalValue, setInternalValue] = React.useState('');

  const currentValue = typeof value === 'string' ? value : internalValue;
  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(currentValue.toLowerCase())
  );

  function updateValue(nextValue: string) {
    if (typeof value !== 'string') {
      setInternalValue(nextValue);
    }
  }

  return (
    <div className="relative">
      <div className={cn(inputShellVariants({ size, state: 'default' }), 'pr-3', className)}>
        <Search className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <input
          {...props}
          value={currentValue}
          onChange={(event) => {
            updateValue(event.target.value);
            setOpen(true);
            onChange?.(event);
          }}
          onFocus={(event) => {
            setOpen(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            window.setTimeout(() => setOpen(false), 120);
            props.onBlur?.(event);
          }}
          onKeyDown={(event) => {
            if (!filteredSuggestions.length) {
              props.onKeyDown?.(event);
              return;
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((current) => (current + 1) % filteredSuggestions.length);
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((current) => (current <= 0 ? filteredSuggestions.length - 1 : current - 1));
            }

            if (event.key === 'Enter' && activeIndex >= 0) {
              event.preventDefault();
              const selected = filteredSuggestions[activeIndex];
              updateValue(selected);
              onSuggestionSelect?.(selected);
              setOpen(false);
            }

            props.onKeyDown?.(event);
          }}
          className="h-full flex-1 bg-transparent outline-none"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
        />
      </div>
      {open && filteredSuggestions.length ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-card/95 p-1 shadow-soft-lg backdrop-blur-xl"
        >
          {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                'flex w-full items-center rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm text-foreground transition',
                index === activeIndex ? 'bg-primary-50 text-primary-900' : 'hover:bg-neutral-100'
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                updateValue(suggestion);
                onSuggestionSelect?.(suggestion);
                setOpen(false);
              }}
            >
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
