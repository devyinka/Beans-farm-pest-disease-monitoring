import type { ReactNode } from "react";

export type AuthTab = "login" | "register" | "forgot";
export type AuthSwitchTab = Exclude<AuthTab, "forgot">;
export type AuthSubmitHandler = () => void;

export type AuthFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "tel";
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export type AuthPanelHeaderProps = {
  title: string;
  subtitle: string;
};

export type AuthButtonProps = {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
};

export type AuthLogoBadgeProps = {
  src: string;
  alt: string;
  fallbackText: string;
};

export type AuthTabsProps = {
  activeTab: AuthSwitchTab;
  onTabChange: (tab: AuthSwitchTab) => void;
};

export type LoginPanelProps = {
  loginUser: string;
  loginPass: string;
  onLoginUserChange: (value: string) => void;
  onLoginPassChange: (value: string) => void;
  onSubmit: AuthSubmitHandler;
  onForgot: () => void;
  onSwitchRegister: () => void;
  machineLocation: string;
  onChangeMachineLocation: (value: string) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  successMessage?: string;
};

export type RegisterPanelProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  confirmPassword: string;
  passwordStrength: number;
  strengthColor: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: AuthSubmitHandler;
  onSwitchLogin: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  successMessage?: string;
};

export type ForgotPanelProps = {
  forgotEmail: string;
  resetSent: boolean;
  setResetSent: (value: boolean) => void;
  onForgotEmailChange: (value: string) => void;
  onSubmit: AuthSubmitHandler;
  onBackToLogin: () => void;
};
