import * as React from 'react';

import { Select, type SelectProps } from '@/shared/components/ui/select';

export interface SortDropdownProps extends Omit<SelectProps, 'label'> {
  label?: string;
}

export function SortDropdown({ label = 'Sort by', ...props }: SortDropdownProps) {
  return <Select label={label} {...props} />;
}
