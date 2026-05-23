import AuthLogoBadge from "./Logo";
import AuthProjectDetailsPanel from "./Mydetail";

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

        <p className="mb-4 text-[11px] font-extrabold tracking-[0.16em] uppercase text-(--purple-light)">
          Final Year Project — Telecom Engineering
        </p>
        <h1 className="mb-4 text-4xl leading-[1.1] font-extrabold text-white">
          Intelligent system for early
          <br />
          <span className="text-(--purple-light)">Pest and disease</span>
          <br />
          Detection in beans farm.
        </h1>
        <p className="mb-9 max-w-95 text-[13.5px] leading-[1.75] text-[rgba(255,255,255,0.38)]">
          Real-time environmental monitoring with machine learning for early
          detection of pests and diseases.
        </p>

        <div className="mb-10 grid grid-cols-2 gap-2.5">
          {[
            ["🌡", " 5 Live sensors", "Temp, humidity, soil moisture"],
            ["🤖", "ML prediction", "Random Forest accuracy"],
            ["📡", "GSM / SIM800L", "Works on major networks"],
            ["🔫", "Remote spraying control","Automated pest management"],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="rounded-[10px] border border-[rgba(184,147,255,0.2)] bg-[rgba(255,255,255,0.06)] px-4 py-3.5"
            >
              <p className="mb-1 text-lg">{icon}</p>
              <p className="text-[11px] font-semibold text-[rgba(255,255,255,0.9)]">
                {title}
              </p>
              <p className="mt-0.5 text-[10px] leading-normal text-[rgba(255,255,255,0.28)]">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <AuthProjectDetailsPanel />
      </div>
    </div>
  );
};

export default AuthProjectPanel;
