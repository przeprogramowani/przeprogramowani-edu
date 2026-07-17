import { useCallback, useRef, type FormEvent, type KeyboardEvent } from 'react';

interface UserQueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function UserQueryInput({ value, onChange, onSubmit, disabled, placeholder }: UserQueryInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (value.trim() && !disabled) {
          onSubmit();
        }
      }
    },
    [value, disabled, onSubmit]
  );

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    },
    [value, disabled, onSubmit]
  );

  return (
    <form onSubmit={handleFormSubmit} className="flex gap-3">
      <label className="sr-only" htmlFor="prompt">
        Ask something
      </label>
      <textarea
        ref={textareaRef}
        id="prompt"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Ask me anything about your project…'}
        className="h-24 flex-1 resize-none rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        disabled={disabled}
      />
      <button
        type="submit"
        className="flex h-24 w-28 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
        disabled={disabled}>
        {disabled ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
