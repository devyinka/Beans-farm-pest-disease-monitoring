const AuthProjectDetailsPanel = () => {
  const projectDetails = [
    ["Name", "Salam Sodiq"],
    ["Matric No", "2021/1/81914CM"],
    ["Department", "Telecommunication Engineering"],
    [
      "Project Title",
      "Intelligent system for early Pest and disease Detection in bean farm.",
    ],
    ["Supervisor", "Engr. Dr. B. A. Salihu"],
  ];

  return (
    <div className="meta-card mt-4 mb-5 rounded-xl border border-[rgba(184,147,255,0.2)] bg-[rgba(255,255,255,0.04)] p-5">
      {/* Title */}
      <div className="meta-title mx-auto mb-4 w-[92%] text-lg font-extrabold tracking-wide text-[rgb(184,147,255)] md:text-xl">
        Project Details
      </div>

      {/* Content */}
      <div className="meta-grid mx-auto w-[92%] space-y-3">
        {projectDetails.map(([label, value]) => (
          <div
            key={label}
            className="grid w-full grid-cols-[140px_1fr] items-start gap-x-4 text-base md:text-lg"
          >
            {/* Label */}
            <span className="font-semibold text-white/70 max-sm:text-sm">
              {label}:
            </span>

            {/* Value */}
            <span
              className={`font-extrabold text-white/70 leading-relaxed wrap-break-word ${
                label === "Project Title"
                  ? "max-sm:text-[12px] max-sm:leading-5"
                  : label === "Department"
                    ? "max-sm:text-[13px] max-sm:leading-5"
                    : "max-sm:text-[12px]"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthProjectDetailsPanel;
