import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-text font-semibold mb-2">
        {label} {required && <span className="text-alert">*</span>}
      </label>
      <input
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
          error ? 'border-alert' : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-alert text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;