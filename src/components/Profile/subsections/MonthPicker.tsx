import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const MonthPicker = ({ 
  selectedDate, 
  onChange 
}: { 
  selectedDate: Date;
  onChange: (date: Date) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(selectedDate.getFullYear());
  
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(year, monthIndex);
    onChange(newDate);
    setIsOpen(false);
  };

  const handlePrevYear = () => setYear(year - 1);
  const handleNextYear = () => setYear(year + 1);

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(selectedDate, "MMMM yyyy")}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 w-64 mt-2 bg-popover border rounded-md shadow-md z-50">
          <div className="p-2">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevYear}
                className="h-7 w-7 p-0"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <div className="font-semibold">{year}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextYear}
                className="h-7 w-7 p-0"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9",
                    selectedDate.getMonth() === index && 
                    selectedDate.getFullYear() === year && 
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;