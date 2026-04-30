import AuthButton from "./SubmitButton";
import AuthField from "./AuthField";
import AuthPanelHeader from "./AuthPanelHeader";
import type { LoginPanelProps } from "./types";
import { useMemo, useState } from "react";

const LoginPanel = ({
  loginUser,
  loginPass,
  onLoginUserChange,
  onLoginPassChange,
  onSubmit,
  onForgot,
  onSwitchRegister,
  machineLocation,
  onChangeMachineLocation,
  isSubmitting = false,
  errorMessage = "",
  successMessage = "",
}: LoginPanelProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const canSubmit = useMemo(
    () =>
      loginUser.trim().length > 0 &&
      loginPass.trim().length > 0 &&
      machineLocation.trim().length > 0,
    [loginUser, loginPass, machineLocation],
  );

  return (
    <div>
      <AuthPanelHeader
        title="Welcome back"
        subtitle="Sign in to access the monitoring dashboard"
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <AuthField
          id="login-user"
          type="email"
          label="Username or email"
          placeholder="Your email is your Username"
          value={loginUser}
          onChange={onLoginUserChange}
        />
        <AuthField
          id="login-pass"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="••••••••"
          value={loginPass}
          onChange={onLoginPassChange}
        />
        <div className="-mt-1 mb-2 flex items-center justify-end">
          {/* <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[rgba(255,255,255,0.55)]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-3.5 w-3.5 accent-(--purple-light)"
            />
            Keep me signed in
          </label> */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="cursor-pointer text-[11px] font-semibold text-(--purple-light) hover:text-(--purple-accent) "
          >
            {showPassword ? "Hide" : "Show"} password
          </button>
        </div>
        <AuthField
          id="unit"
          type="text"
          label="Machine location"
          placeholder="System location"
          value={machineLocation}
          onChange={onChangeMachineLocation}
        />
        <div className="-mt-1 mb-3 text-right">
          <button
            type="button"
            onClick={onForgot}
            className="cursor-pointer text-[11px] font-semibold text-(--purple-light) hover:text-(--purple-accent)"
          >
            Forgot password?
          </button>
        </div>

        {errorMessage ? (
          <div className="mb-2 rounded-[9px] border border-[rgba(255,147,64,0.38)] bg-[rgba(255,147,64,0.14)] px-3 py-2 text-[11px] text-[#ffd2b0]">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-2 rounded-[9px] border border-[rgba(142,232,155,0.38)] bg-[rgba(142,232,155,0.14)] px-3 py-2 text-[11px] text-[#c8ffd0]">
            {successMessage}
          </div>
        ) : null}

        <AuthButton
          type="submit"
          disabled={!canSubmit}
          isLoading={isSubmitting}
          loadingLabel="Signing in..."
        >
          Sign in →
        </AuthButton>
      </form>
      <p className="mt-3.5 text-center text-xs text-[rgba(255,255,255,0.28)]">
        No account?{" "}
        <button
          type="button"
          onClick={onSwitchRegister}
          className="cursor-pointer font-semibold text-(--purple-light) hover:text-white hover:underline"
        >
          Create one
        </button>
      </p>
    </div>
  );
};

export default LoginPanel;
