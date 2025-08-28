"use client";
import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ModernDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  hasError?: boolean;
  id?: string;
  name?: string;
}

// Custom input component for the date picker
const CustomInput = forwardRef<HTMLInputElement, {
  value: string;
  onClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  className: string;
  placeholder: string;
  hasError?: boolean;
  id?: string;
  name?: string;
}>(({ value, onClick, onChange, onBlur, className, placeholder, id, name }, ref) => (
  <div className="relative group">
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      onChange={onChange}
      onBlur={onBlur}
      className={`${className} pr-12 cursor-pointer transition-all duration-300 hover:shadow-md focus:shadow-lg`}
      placeholder={placeholder}
      readOnly
      id={id}
      name={name}
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
));

CustomInput.displayName = 'CustomInput';

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  value,
  onChange,
  onBlur,
  className,
  placeholder = "তারিখ নির্বাচন করুন",
  hasError,
  id,
  name
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      onChange(formattedDate);
    } else {
      onChange('');
    }
  };

  return (
    <div className="modern-datepicker">
      <style jsx global>{`
        .modern-datepicker .react-datepicker-wrapper {
          width: 100%;
        }
        
        .modern-datepicker .react-datepicker__input-container {
          width: 100%;
        }
        
        .react-datepicker {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          background: white;
          overflow: hidden;
        }
        
        .react-datepicker__header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          border-radius: 0;
          padding: 16px 0;
          position: relative;
        }
        
        .react-datepicker__current-month {
          color: #1e293b;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .react-datepicker__day-names {
          margin-bottom: 0;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
        }
        
        .react-datepicker__day-name {
          color: #64748b;
          font-weight: 500;
          width: 2.5rem;
          line-height: 2rem;
          margin: 0.166rem;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .react-datepicker__navigation {
          top: 18px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #f1f5f9;
          transition: all 0.2s ease;
          z-index: 2;
        }
        
        .react-datepicker__navigation:hover {
          background: #e2e8f0;
        }
        
        .react-datepicker__navigation--previous {
          left: 16px;
          border-right-color: #64748b;
        }
        
        .react-datepicker__navigation--next {
          right: 16px;
          border-left-color: #64748b;
        }
        
        .react-datepicker__navigation:hover *::before {
          border-color: #475569;
        }
        
        .react-datepicker__month-container {
          padding: 16px;
          background: white;
        }
        
        .react-datepicker__day {
          width: 2.25rem;
          height: 2.25rem;
          line-height: 2.25rem;
          margin: 0.125rem;
          border-radius: 6px;
          color: #334155;
          font-weight: 400;
          transition: all 0.2s ease;
          cursor: pointer;
          font-size: 14px;
        }
        
        .react-datepicker__day:hover {
          background: #f1f5f9;
          color: #1e293b;
        }
        
        .react-datepicker__day--selected {
          background: #3b82f6;
          color: white;
          font-weight: 500;
        }
        
        .react-datepicker__day--selected:hover {
          background: #2563eb;
        }
        
        .react-datepicker__day--today {
          background: #fef3c7;
          color: #92400e;
          font-weight: 500;
        }
        
        .react-datepicker__day--today:hover {
          background: #fde68a;
        }
        
        .react-datepicker__day--outside-month {
          color: #cbd5e1;
          opacity: 0.6;
        }
        
        .react-datepicker__day--disabled {
          color: #cbd5e1;
          cursor: not-allowed;
          opacity: 0.4;
        }
        
        .react-datepicker__day--disabled:hover {
          background: transparent;
        }
        
        .react-datepicker__triangle {
          display: none;
        }
        
        .react-datepicker-popper {
          z-index: 9999;
        }
        
        .react-datepicker-popper[data-placement^="bottom"] {
          margin-top: 8px;
        }
        
        .react-datepicker-popper[data-placement^="top"] {
          margin-bottom: 8px;
        }
        
        /* Month and Year Dropdowns */
        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 200px;
          overflow-y: auto;
        }
        
        .react-datepicker__month-option,
        .react-datepicker__year-option {
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }
        
        .react-datepicker__month-option:hover,
        .react-datepicker__year-option:hover {
          background: #f1f5f9;
          color: #1e293b;
        }
        
        .react-datepicker__month-option--selected,
        .react-datepicker__year-option--selected {
          background: #3b82f6;
          color: white;
        }
        
        @media (max-width: 640px) {
          .react-datepicker {
            width: 100%;
            max-width: 320px;
            margin: 0 auto;
          }
          
          .react-datepicker__day {
            width: 2rem;
            height: 2rem;
            line-height: 2rem;
            font-size: 13px;
            margin: 0.1rem;
          }
          
          .react-datepicker__day-name {
            width: 2rem;
            line-height: 1.5rem;
            font-size: 11px;
          }
          
          .react-datepicker__current-month {
            font-size: 15px;
          }
          
          .react-datepicker__month-container {
            padding: 12px;
          }
          
          .react-datepicker__header {
            padding: 12px 0;
          }
        }
      `}</style>
      
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        onBlur={onBlur}
        customInput={
          <CustomInput
            value=""
            onClick={() => {}}
            onChange={() => {}}
            onBlur={() => {}}
            className={className || ''}
            placeholder={placeholder}
            hasError={hasError}
            id={id}
            name={name}
          />
        }
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={100}
        scrollableYearDropdown
        maxDate={new Date()}
        placeholderText={placeholder}
        autoComplete="off"
        popperClassName="modern-datepicker-popper"
        calendarClassName="modern-datepicker-calendar"
        wrapperClassName="modern-datepicker-wrapper"
      />
    </div>
  );
};

export default ModernDatePicker;