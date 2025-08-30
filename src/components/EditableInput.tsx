import React, { useState, useRef, useEffect } from 'react';

interface EditableInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  small?: boolean;
}

const EditableInput: React.FC<EditableInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = 'Click to edit',
  small = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      setIsEditing(false);
    }
  };

  const commonClasses = `w-full bg-transparent focus:outline-none text-slate-900 ${small ? 'p-1 text-sm' : 'p-2'}`;
  const displayClasses = `cursor-pointer ${!value && 'text-slate-400'}`;
  const inputClasses = `bg-white border-primary-DEFAULT border-2 rounded-md transition duration-200`;

  const renderInput = () => {
    const props = {
      ref: inputRef as any,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: `${commonClasses} ${inputClasses}`,
      placeholder: placeholder,
    };
    if (type === 'textarea') {
      return <textarea {...props} rows={small ? 1 : 3} />;
    }
    return <input {...props} type={type} />;
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>}
      {isEditing ? (
        renderInput()
      ) : (
        <div onClick={() => setIsEditing(true)} className={`${commonClasses} ${displayClasses} border-2 border-transparent rounded-md hover:bg-slate-100`}>
          {value || <span className="text-slate-400 italic">{placeholder}</span>}
        </div>
      )}
    </div>
  );
};

export default EditableInput;
