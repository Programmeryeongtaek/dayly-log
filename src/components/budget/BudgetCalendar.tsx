"use client";

import { BudgetCalendarProps } from "@/types/budget";
import { format, isSameMonth, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function BudgetCalendar({
  currentDate,
  calendarDays,
  dailyTotals,
  onMonthChange,
  onDateSelect,
  formatDateString,
}: BudgetCalendarProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-3 ">
        <h2 className="text-base font-semibold">
          {format(currentDate, "yyyy년 M월", { locale: ko })}
        </h2>
        <div className="flex gap-1 ">
          <button
            onClick={() => onMonthChange("prev")}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMonthChange("next")}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1 "
          >
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 날짜 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-16" />;
          }

          const dayStr = formatDateString(day);
          const dayData = dailyTotals[dayStr];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const hasData =
            dayData && (dayData.income > 0 || dayData.expense > 0);

          return (
            <button
              key={dayStr}
              onClick={() => onDateSelect(day)}
              className={`
                flex flex-col h-16 p-1 text-left border rounded-lg transition-all hover:bg-accent-50
                ${isCurrentMonth ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 text-gray-400"}
                ${isTodayDate ? "ring-1  ring-accent-500" : ""}
                ${hasData ? "bg-accent-50 border-accent-200" : ""}
              `}
            >
              <div className="text-xs font-medium mb-1">{format(day, "d")}</div>

              {hasData && (
                <div className="hidden tablet:block">
                  {dayData.net > 0 ? (
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-2 h-2 mr-1 flex-shrink-0" />
                      <span className="truncate font-medium">
                        +{dayData.net.toLocaleString()}
                      </span>
                    </div>
                  ) : dayData.net < 0 ? (
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-2 h-2 mr-1 flex-shrink-0" />
                      <span className="truncate font-medium">
                        {dayData.net.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 font-medium">0원</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
