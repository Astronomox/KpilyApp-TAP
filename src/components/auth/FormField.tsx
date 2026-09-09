import { forwardRef } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, hint, error, id, ...inputProps }, ref) {
    const fieldId = id ?? inputProps.name;
    return (
      <div className={styles.group}>
        <label htmlFor={fieldId} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={styles.input}
          aria-invalid={Boolean(error)}
          {...inputProps}
        />
        {hint && !error && <span className={styles.hint}>{hint}</span>}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);
