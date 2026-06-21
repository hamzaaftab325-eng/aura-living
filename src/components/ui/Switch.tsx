'use client';

/**
 * Switch — Accessible toggle switch component.
 *
 * Replaces inline checkbox toggles in SettingsView and other forms.
 * Uses proper ARIA roles for screen reader support.
 *
 * @param checked - Whether the switch is on
 * @param onChange - Callback when toggle state changes
 * @param label - Accessible label for the switch
 *
 * @example
 * <Switch checked={emailNotifications} onChange={setEmailNotifications} label="Email notifications" />
 */
export default function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        checked ? 'aura-bg-gold' : 'aura-bg-dark-tint-20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        } mt-0.5`}
      />
    </button>
  );
}
