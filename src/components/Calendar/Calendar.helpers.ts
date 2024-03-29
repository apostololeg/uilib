import type { Date } from 'uilib/types';

import * as T from './Calendar.types';

const CACHE = {}; // [year-month] = days

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getWeekDaysArray = (startOfWeek = 1) => {
  const weekDays = [];

  for (let i = startOfWeek; i < startOfWeek + 7; i++) {
    weekDays.push(i % 7);
  }

  return weekDays;
};

export const isWeekend = (day: number) => {
  const num = day % 7;
  return num === 5 || num === 6;
};

export const isSameDay = (day1: Date, day2: Date) => {
  return (
    day1.day === day2.day &&
    day1.month === day2.month &&
    day1.year === day2.year
  );
};

export const getDaysArray = (year, month, startOfWeek): T.Day[] => {
  const key = `${year}-${month}-${startOfWeek}`;

  if (CACHE[key]) return CACHE[key];

  let monthIndex = month - 1; // JavaScript's Date months are 0-indexed.
  let date = new Date(year, monthIndex, 1);
  let result = [];
  let startDay = (date.getDay() - startOfWeek + 7) % 7;

  if (startDay > 0) {
    let prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

    for (let i = 0; i < startDay; i++) {
      result.unshift({
        day: prevMonthLastDay - i,
        month: monthIndex,
        year: monthIndex === 0 ? year - 1 : year,
        currentMonth: false,
      });
    }
  }

  while (date.getMonth() === monthIndex) {
    result.push({
      day: date.getDate(),
      month: monthIndex + 1,
      year: year,
      currentMonth: true,
    });
    date.setDate(date.getDate() + 1);
  }

  let nextMonthDay = 1;
  const nextMonthStartDay = result.length % 7;

  if (nextMonthStartDay > 0) {
    for (let i = nextMonthStartDay; i < 7; i++) {
      result.push({
        day: nextMonthDay,
        month: monthIndex + 2 > 12 ? 1 : monthIndex + 2,
        year: monthIndex === 11 ? year + 1 : year,
        currentMonth: false,
      });
      nextMonthDay++;
    }
  }

  CACHE[key] = result;

  return result;
};

export const valueToDate = (day: Date) =>
  new Date(day.year, day.month - 1, day.day ?? 1);
