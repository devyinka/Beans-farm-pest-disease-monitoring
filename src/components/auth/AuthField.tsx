import type { AuthFieldProps } from "./types";

const AuthField = ({
  id,
  label,
  type = "text",
  placeholder,
  required = true,
  value,
  onChange,
}: AuthFieldProps) => {
  return (
    <div className="mb-3.5">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[9px] tracking-[0.12em] uppercase text-[rgba(255,255,255,0.6)]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[9px] border border-[rgba(184,147,255,0.2)] bg-[rgba(184,147,255,0.08)] px-3.5 py-2.5 text-[13px] text-white outline-none transition focus:border-(--purple-light) focus:bg-[rgba(184,147,255,0.12)] focus:shadow-[0_0_0_3px_rgba(184,147,255,0.2)] placeholder:text-[rgba(255,255,255,0.16)]"
      />
    </div>
  );
};

export default AuthField;
