import type { AuthPanelHeaderProps } from "./types";

const AuthPanelHeader = ({ title, subtitle }: AuthPanelHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="mb-1 text-[22px] font-bold text-white">{title}</h2>
      <p className="text-xs text-[rgba(255,255,255,0.32)]">{subtitle}</p>
    </div>
  );
};

export default AuthPanelHeader;
