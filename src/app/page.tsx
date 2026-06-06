import TopNav from "@/components/Topnav";
import AuthPage from "@/components/auth/AuthPage";
import AuthProjectPanel from "@/components/auth/ProjectTitlepanel";

export default function Home() {
  return (
    <div>
      <div suppressHydrationWarning={true}></div>
      <TopNav />
      <div
        className="grid w-full min-h-155 grid-cols-1 bg-[linear-gradient(135deg,#06030d_0%,#1a0a2b_50%,#2f1451_100%)] shadow-[inset_0_-120px_180px_rgba(139,61,255,0.25)] lg:grid-cols-[1fr_340px]"
        style={{
          ["--purple-light" as string]: "#c084fc",
          ["--purple-accent" as string]: "#efe4ff",
        }}
      >
        <AuthProjectPanel />
        <AuthPage />
      </div>
    </div>
  );
}
