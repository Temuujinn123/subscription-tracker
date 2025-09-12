// components/PasswordInput.tsx
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
  required = false,
  id = "password",
  name = "password",
  placeholder = "Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`appearance-none relative block w-full px-3 py-3 border ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          } rounded-md focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-200`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <FiEyeOff
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          ) : (
            <FiEye
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      {error && (
        <p
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          id={`${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
