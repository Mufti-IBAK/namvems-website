import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  required = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-text font-semibold mb-2">
        {label} {required && <span className="text-alert">*</span>}
      </label>
      <textarea
        rows={rows}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-vertical ${
          error ? 'border-alert' : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-alert text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;