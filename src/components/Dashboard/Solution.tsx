import { UIStatus, FarmUpdatePayload } from "@/types/type";
import { solutionProps } from "@/types/type";

const getActionLabel = (status: UIStatus): string => {
  const labels: Record<UIStatus, string> = {
    healthy: "RECOMMENDED ACTION",
    disease: "DISEASE INTERVENTION REQUIRED",
    pest: "PEST INTERVENTION REQUIRED",
  };
  return labels[status];
};

const getSolutionPalette = (status: UIStatus) => {
  const palettes: Record<
    UIStatus,
    {
      outerBg: string;
      cardBg: string;
      borderColor: string;
      labelBg: string;
      labelText: string;
      titleColor: string;
      descriptionColor: string;
      metaColor: string;
      progressTrack: string;
      progressFill: string;
    }
  > = {
    healthy: {
      outerBg: "bg-[#edf1e8]",
      cardBg: "bg-[#1b3a1f]",
      borderColor: "border-[#2f7f3a]",
      labelBg: "bg-[#2d5f35]",
      labelText: "#7DED9B",
      titleColor: "text-white",
      descriptionColor: "text-[#a8d5aa]",
      metaColor: "text-[#c8e7cb]",
      progressTrack: "#2f7f3a",
      progressFill: "#7DED9B",
    },
    disease: {
      outerBg: "bg-[#e9edf6]",
      cardBg: "bg-[#1a2d5f]",
      borderColor: "border-[#4f98ff]",
      labelBg: "bg-[#2d4a8a]",
      labelText: "#d7e6ff",
      titleColor: "text-white",
      descriptionColor: "text-[#a8bce8]",
      metaColor: "text-[#d7e6ff]",
      progressTrack: "#4f98ff",
      progressFill: "#9ec3ff",
    },
    pest: {
      outerBg: "bg-[#f3ece3]",
      cardBg: "bg-[#3d2310]",
      borderColor: "border-[#f59e0b]",
      labelBg: "bg-[#5a3818]",
      labelText: "#ffd7a6",
      titleColor: "text-white",
      descriptionColor: "text-[#d4a574]",
      metaColor: "text-[#ffd7a6]",
      progressTrack: "#f59e0b",
      progressFill: "#ffc36b",
    },
  };

  return palettes[status];
};

export const Solution = ({ farmData, status }: solutionProps) => {
  const actionLabel = getActionLabel(status);
  const palette = getSolutionPalette(status);

  return (
    <section
      className={`${palette.outerBg} h-full w-full px-4 pb-4 pt-4 xl:max-w-105 xl:justify-self-center`}
    >
      <div
        className={`flex h-full min-h-72 flex-col rounded-xl border-2 ${palette.borderColor} ${palette.cardBg} p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]`}
      >
        {/* Header Label */}
        <div
          className={`mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.08em] ${palette.labelBg}`}
        >
          <span style={{ color: palette.labelText }}>{actionLabel}</span>
        </div>

        {/* Title from AI */}
        <h2 className={`mb-2 text-xl font-bold ${palette.titleColor}`}>
          {farmData.AIData.spray_action}
        </h2>

        {/* Description from AI */}
        <p
          className={`mb-4 text-sm leading-relaxed ${palette.descriptionColor}`}
        >
          {farmData.AIData.description}
        </p>

        {/* Confidence Footer */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={palette.metaColor}>ML confidence</span>
            <span style={{ color: palette.labelText }}>
              {Math.round(farmData.AIData.confidence)}%
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: palette.progressTrack }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${farmData.AIData.confidence}%`,
                backgroundColor: palette.progressFill,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};
