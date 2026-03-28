import * as React from 'react';

import { Checkbox } from '@/shared/components/ui/checkbox';
import { Divider } from '@/shared/components/ui/divider';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterSection {
  title: string;
  options: FilterOption[];
}

export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: FilterSection[];
  selectedValues: string[];
  onToggleValue?: (value: string, checked: boolean) => void;
}

export function FilterPanel({
  sections,
  selectedValues,
  onToggleValue,
  ...props
}: FilterPanelProps) {
  return (
    <aside className="surface grid gap-5 p-5" {...props}>
      <div className="grid gap-1">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Filters</p>
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">Refine discovery</h3>
      </div>
      {sections.map((section, sectionIndex) => (
        <div key={section.title} className="grid gap-3">
          {sectionIndex ? <Divider /> : null}
          <p className="text-sm font-medium text-foreground">{section.title}</p>
          <div className="grid gap-3">
            {section.options.map((option) => {
              const checked = selectedValues.includes(option.value);

              return (
                <Checkbox
                  key={option.value}
                  checked={checked}
                  onCheckedChange={(next) => onToggleValue?.(option.value, Boolean(next))}
                  label={
                    <span className="flex items-center gap-2">
                      <span>{option.label}</span>
                      {typeof option.count === 'number' ? (
                        <span className="text-muted-foreground">({option.count})</span>
                      ) : null}
                    </span>
                  }
                />
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
