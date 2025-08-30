'use client';

import { ExpenseCalendarProps } from '@/types/expenses';
import { format, isSameMonth, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExpenseCalendar({
  currentDate,
  calendarDays,
  dailyTotals,
  onMonthChange,
  onDateSelect,
  formatDateString,
}: ExpenseCalendarProps) {
  return (
    <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-3 mobile:mb-4">
        <h2 className="text-base mobile:text-lg font-semibold">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        <div className="flex gap-1 mobile:gap-2">
          <button
            onClick={() => onMonthChange('prev')}
            className="p-1 mobile:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mobile:w-5 mobile:h-5" />
          </button>
          <button
            onClick={() => onMonthChange('next')}
            className="p-1 mobile:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 mobile:w-5 mobile:h-5" />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div
            key={day}
            className="text-center text-xs mobile:text-sm font-medium text-gray-500 py-1 mobile:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 날짜 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-12 mobile:h-16" />;
          }

          const dayStr = formatDateString(day);
          const dayTotal = dailyTotals[dayStr] || 0;
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={dayStr}
              onClick={() => onDateSelect(day)}
              className={`
                h-12 mobile:h-16 p-1 mobile:p-2 text-left border rounded-lg transition-all hover:bg-accent-50
                ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 text-gray-400'}
                ${isTodayDate ? 'ring-1 mobile:ring-2 ring-accent-500' : ''}
                ${dayTotal > 0 ? 'bg-accent-50 border-accent-200' : ''}
              `}
            >
              <div className="text-xs mobile:text-sm font-medium">
                {format(day, 'd')}
              </div>
              {dayTotal > 0 && (
                <div className="text-xs mobile:text-xs text-accent-600 mt-0.5 mobile:mt-1 leading-tight">
                  {dayTotal.toLocaleString()}원
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
