// components/FormInput.tsx
import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function FormInput({
  label,
  error,
  icon,
  ...props
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
              {icon}
            </span>
          </div>
        )}
        <input
          {...props}
          className={`appearance-none relative block w-full px-3 py-3 border ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          } rounded-md sm:text-sm ${
            icon ? "pl-10" : "pl-3"
          } bg-white dark:bg-gray-700 transition-colors duration-200`}
        />
      </div>
      {error && (
        <p
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          id={`${props.id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
