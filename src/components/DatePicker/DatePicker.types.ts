import type { Size } from 'uilib/types';
import type { Props as CalendarProps } from 'uilib/components/Calendar/Calendar.types';

export type Value = string | [string, string];

export type Props = {
  className?: string;
  // Date or range of dates. If range is provided, then control will be in range selection mode.
  value: Value;
  onChange: (value: Value) => void;
  size?: Size;
  calendarProps?: Partial<CalendarProps>;
};
