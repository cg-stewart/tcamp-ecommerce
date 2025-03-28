"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
}

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
  placeholder = "Select date range",
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border border-luxury-charcoal" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <input 
        type="hidden" 
        name="date" 
        value={dateRange?.from && dateRange?.to 
          ? `${format(dateRange.from, "MMMM d, yyyy")} - ${format(dateRange.to, "MMMM d, yyyy")}` 
          : ""
        } 
        required
      />
      {/* Add ISO dates for better processing on the backend */}
      <input 
        type="hidden" 
        name="dateStart" 
        value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""} 
      />
      <input 
        type="hidden" 
        name="dateEnd" 
        value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""} 
      />
    </div>
  )
}
