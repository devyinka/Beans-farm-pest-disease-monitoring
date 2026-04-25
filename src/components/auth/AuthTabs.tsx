import type { AuthTabsProps } from "./types";

const tabButtonClass = (active: boolean) =>
  `mb-[-1px] cursor-pointer border-b-2 px-5 py-2.5 text-[12px] tracking-[0.06em] transition ${
    active
      ? "border-b-(--purple-light) text-white"
      : "border-b-transparent text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)]"
  }`;

const AuthTabs = ({ activeTab, onTabChange }: AuthTabsProps) => {
  return (
    <div className="mb-8 flex border-b border-[rgba(184,147,255,0.2)]">
      <button
        type="button"
        onClick={() => onTabChange("login")}
        className={tabButtonClass(activeTab === "login")}
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={() => onTabChange("register")}
        className={tabButtonClass(activeTab === "register")}
      >
        Register
      </button>
    </div>
  );
};

export default AuthTabs;
