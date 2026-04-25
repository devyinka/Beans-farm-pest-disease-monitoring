import type { AuthButtonProps } from "./types";

const AuthButton = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  loadingLabel = "Processing...",
}: AuthButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className="mt-2 w-full rounded-[9px] border-none bg-[linear-gradient(135deg,#6d28d9_0%,#8b3dff_55%,#c084fc_100%)] px-3 py-3.25 text-[13px] font-bold tracking-[0.06em] text-white shadow-[0_8px_22px_rgba(139,61,255,0.34)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
};

export default AuthButton;
