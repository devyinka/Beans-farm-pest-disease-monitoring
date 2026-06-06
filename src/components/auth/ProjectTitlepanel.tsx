import HeroHeader from "./heroHeader";
import AuthLogoBadge from "./Logo";
import AuthProjectDetailsPanel from "./Mydetail";
import SmartAgriGrid from "./smartAgricGrid";

const AuthProjectPanel = () => {
  return (
    <div className="flex w-full flex-col justify-between border-t border-[rgba(184,147,255,0.2)] bg-[linear-gradient(135deg,#0b0714_0%,#1a0a2b_60%,#2d1050_100%)] px-6 py-10 lg:border-t-0 lg:border-r lg:px-13 lg:py-14">
      <div>
        <div className="mb-10 flex items-center gap-4">
          <AuthLogoBadge
            src="/school-logo.png"
            alt="School logo"
            fallbackText="School"
          />
          <div className="h-8 w-px bg-[rgba(255,255,255,0.15)]" />
          <AuthLogoBadge
            src="/department-logo.png"
            alt="Department logo"
            fallbackText="Dept"
          />
        </div>
        <HeroHeader />
        <SmartAgriGrid />
        <AuthProjectDetailsPanel />
      </div>
    </div>
  );
};

export default AuthProjectPanel;
