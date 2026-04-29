import AuthButton from "./SubmitButton";
import AuthField from "./AuthField";
import AuthPanelHeader from "./AuthPanelHeader";
import type { ForgotPanelProps } from "./types";
import { use, useState, useEffect } from "react";
import BACKENDURL from "@/API";
import Router from "next/router";

const ForgotPanel = ({
  forgotEmail,
  resetSent,
  setResetSent,
  onForgotEmailChange,
  onSubmit,
  onBackToLogin,
}: ForgotPanelProps) => {
  const [resetCode, onResetCodeChange] = useState("");
  const [resetPassword, onResetPasswordChange] = useState("");
  const [confirmResetPassword, onConfirmResetPasswordChange] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    //
    if (resetSuccess) {
      timer = setTimeout(() => {
        Router.push("/dashboard");
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resetSuccess]);

  const handleResetpassword = async () => {
    let res;
    setResetError("");
    setResetSuccess("");

    // 1. Check Password Match
    if (resetPassword !== confirmResetPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    setIsResetSubmitting(true);

    try {
      res = await BACKENDURL.post(`${BACKENDURL}/auth/reset-password`, {
        email: forgotEmail,
        resetCode,
        newPassword: resetPassword,
      });
      if (res.status === 200) {
        setResetSuccess("Password reset successful. Redirecting...");
      }
    } catch (error) {
      setResetError("Failed to reset password.");
      return;
    }
    if (res.status === 200) {
      setResetSuccess("Password reset successful. Redirecting...");
      setResetSent(false);
    } else {
      setResetError("Password reset failed.");
    }
    // placeholder action until backend reset password integration
    console.info("Reset password payload", {
      forgotEmail,
      resetCode,
      resetPassword,
      confirmResetPassword,
    });
  };

  return (
    <div>
      <AuthPanelHeader
        title="Reset password"
        subtitle="We'll send a reset code to your email"
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <AuthField
          id="forgot-email"
          type="email"
          label="Email address"
          placeholder="example@mail.com"
          value={forgotEmail}
          onChange={onForgotEmailChange}
        />
        <AuthButton type="submit">Send reset link →</AuthButton>
      </form>

      {resetSent && (
        <div>
          <div className="mt-3.5 mb-3.5 rounded-[9px] border border-[rgba(184,147,255,0.3)] bg-[rgba(184,147,255,0.14)] px-4 py-3 text-xs leading-[1.6] text-(--purple-accent)">
            check your inbox for the reset code and change your password.
          </div>
          <AuthField
            id="reset-code"
            type="text"
            label="Reset code"
            placeholder="Enter reset code"
            value={resetCode}
            onChange={onResetCodeChange}
          />
          <AuthField
            id="reset-password"
            type="password"
            label="New password"
            placeholder="Enter new password"
            value={resetPassword}
            onChange={onResetPasswordChange}
          />
          <AuthField
            id="confirm-reset-password"
            type="password"
            label="Confirm new password"
            placeholder="Confirm new password"
            value={confirmResetPassword}
            onChange={onConfirmResetPasswordChange}
          />
          <AuthButton type="submit" onClick={handleResetpassword}>
            Reset password →
          </AuthButton>
          <div className="mt-3.5 rounded-[9px] border border-[rgba(184,147,255,0.3)] bg-[rgba(184,147,255,0.14)] px-4 py-3 text-xs leading-[1.6] text-(--purple-accent)">
            if you don't receive the email within a few minutes, please check
            your spam folder or try again.
          </div>
        </div>
      )}

      <p className="mt-4.5 text-center text-xs text-[rgba(255,255,255,0.28)]">
        <button
          type="button"
          onClick={onBackToLogin}
          className="cursor-pointer font-semibold text-(--purple-light) hover:text-white hover:underline"
        >
          ← Back to sign in
        </button>
      </p>
    </div>
  );
};

export default ForgotPanel;
