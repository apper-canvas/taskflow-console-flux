import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  children, 
  className, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  const errorStyles = error ? "border-error focus:border-error focus:ring-error/20" : "";
  
  return (
    <select
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;