import AuthButton from "./SubmitButton";
import AuthField from "./AuthField";
import AuthPanelHeader from "./AuthPanelHeader";
import type { RegisterPanelProps } from "./types";

const RegisterPanel = ({
  firstName,
  lastName,
  email,
  phone,
  location,
  password,
  confirmPassword,
  passwordStrength,
  strengthColor,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onLocationChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onSwitchLogin,
}: RegisterPanelProps) => {
  return (
    <div>
      <AuthPanelHeader
        title="Create account"
        subtitle="Set up your farm monitoring access"
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-2.5">
          <AuthField
            id="reg-first"
            label="First name"
            placeholder="Salam"
            value={firstName}
            onChange={onFirstNameChange}
          />
          <AuthField
            id="reg-last"
            label="Last name"
            placeholder="Sodiq"
            value={lastName}
            onChange={onLastNameChange}
          />
        </div>
        <AuthField
          id="reg-email"
          type="email"
          label="Email address"
          placeholder="farmer@email.com"
          value={email}
          onChange={onEmailChange}
        />
        <AuthField
          id="reg-phone"
          type="tel"
          label="Phone (for SMS alerts)"
          placeholder="Number for Sms-alert"
          value={phone}
          onChange={onPhoneChange}
        />
        <AuthField
          id="reg-location"
          label="Machine-location"
          placeholder="machine location"
          value={location}
          onChange={onLocationChange}
        />
        <AuthField
          id="reg-pass"
          type="password"
          label="Password"
          placeholder="Create a strong password"
          value={password}
          onChange={onPasswordChange}
        />
        <div className="mb-3.5 h-0.75 overflow-hidden border border-[rgba(184,147,255,0.24)] bg-[rgba(184,147,255,0.2)]">
          <div
            className="h-full transition-[width,background] duration-300"
            style={{ width: `${passwordStrength}%`, background: strengthColor }}
          />
        </div>
        <AuthField
          id="reg-confirm"
          type="password"
          label="Confirm password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
        />
        <AuthButton type="submit">Create account →</AuthButton>
      </form>
      <p className="mt-3.5 text-center text-xs text-[rgba(255,255,255,0.28)]">
        Already registered?{" "}
        <button
          type="button"
          onClick={onSwitchLogin}
          className="cursor-pointer font-semibold text-(--purple-light) hover:text-white hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterPanel;
