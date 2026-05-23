import { STATUS_STYLES } from "@/types/UIStstus";
import { alertHistoryprops, AlertHistoryItem, UIStatus } from "@/types/type";

const getAlertPalette = (status: UIStatus) => {
  const palettes: Record<
    UIStatus,
    {
      outerBg: string;
      cardBg: string;
      borderColor: string;
      headerBg: string;
      headerTitle: string;
      badgeBg: string;
      badgeText: string;
      rowTitle: string;
      rowMeta: string;
      divider: string;
    }
  > = {
    healthy: {
      outerBg: "bg-[#edf1e8]",
      cardBg: "bg-[#1b3a1f]",
      borderColor: "border-[#2f7f3a]",
      headerBg: "bg-[#0f4a27]",
      headerTitle: "text-[#C6FFD8]",
      badgeBg: "bg-[#2d5f35]",
      badgeText: "#7DED9B",
      rowTitle: "text-[#e8f7ea]",
      rowMeta: "text-[#b7d3bc]",
      divider: "divide-[#315f39]",
    },
    disease: {
      outerBg: "bg-[#e9edf6]",
      cardBg: "bg-[#1a2d5f]",
      borderColor: "border-[#4f98ff]",
      headerBg: "bg-[#0f244a]",
      headerTitle: "text-[#e4efff]",
      badgeBg: "bg-[#2d4a8a]",
      badgeText: "#9ec3ff",
      rowTitle: "text-[#edf4ff]",
      rowMeta: "text-[#bacbec]",
      divider: "divide-[#2a457d]",
    },
    pest: {
      outerBg: "bg-[#f3ece3]",
      cardBg: "bg-[#3d2310]",
      borderColor: "border-[#f59e0b]",
      headerBg: "bg-[#2a1204]",
      headerTitle: "text-[#ffd9b0]",
      badgeBg: "bg-[#5a3818]",
      badgeText: "#ffc36b",
      rowTitle: "text-[#fff1e2]",
      rowMeta: "text-[#e0b98b]",
      divider: "divide-[#6b3d18]",
    },
  };

  return palettes[status];
};

export const Alerthistory = ({
  AlertHistory,
  status,
  isLoading,
}: alertHistoryprops) => {
  const ui = STATUS_STYLES[status] ?? STATUS_STYLES.healthy;
  const palette = getAlertPalette(status);

  // Map each alert status to its own row colors for quick visual tracing.
  const getItemStyles = (itemStatus: UIStatus) => {
    const palette: Record<
      UIStatus,
      { dot: string; title: string; meta: string }
    > = {
      healthy: {
        dot: "bg-[#7DED9B]",
        title: "text-[#17311f]",
        meta: "text-[#7f8a7c]",
      },
      disease: {
        dot: "bg-[#4f98ff]",
        title: "text-[#0f244a]",
        meta: "text-[#7590b8]",
      },
      pest: {
        dot: "bg-[#f59e0b]",
        title: "text-[#4a260b]",
        meta: "text-[#b58b53]",
      },
    };

    return palette[itemStatus];
  };

  // Format timestamps into a compact dashboard-friendly label.
  const formatTime = (timestamp: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));

  return (
    <section
      className={`${palette.outerBg} h-full w-full px-4 pb-4 pt-4`}
    >
      <div
        className={`flex h-full min-h-96 flex-col overflow-hidden rounded-xl border-2 ${palette.borderColor} ${palette.cardBg} shadow-[0_2px_8px_rgba(0,0,0,0.08)]`}
      >
        <div className={`${palette.headerBg} px-4 py-3 sm:px-5`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className={`text-lg font-bold ${palette.headerTitle}`}>
              Alert history
            </h2>
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.08em]"
              style={{
                backgroundColor: palette.badgeBg,
                color: palette.badgeText,
              }}
            >
              {AlertHistory.length} total
            </span>
          </div>
        </div>

        {/* Keep the history scrollable inside the card without stretching the dashboard. */}
        <div
          className={`flex flex-1 flex-col overflow-y-auto divide-y ${palette.divider}`}
        >
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center px-4 py-6 text-center text-sm text-[#b7d3bc] sm:px-5">
              Loading alert history...
            </div>
          ) : AlertHistory.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-4 py-6 text-center text-sm text-[#b7d3bc] sm:px-5">
              No alert history yet.
            </div>
          ) : (
            AlertHistory.map((alert: AlertHistoryItem, index) => {
              const item = getItemStyles(alert.status);
              return (
                <div
                  key={`${alert.timestamp}-${index}`}
                  className="flex items-start gap-3 px-4 py-4 sm:px-5"
                >
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${item.dot}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-semibold ${palette.rowTitle}`}
                    >
                      {alert.farmstatus}
                    </div>
                    <div className={`text-xs ${palette.rowMeta}`}>
                      {formatTime(alert.timestamp)}
                      <span className="mx-1">—</span>
                      {alert.smsAlertSent ? "SMS ✓" : "no SMS sent"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
