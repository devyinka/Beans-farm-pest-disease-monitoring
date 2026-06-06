"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function ProtectedRoute(props: T) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("beanfarm_token");

      if (!token) {
        router.replace("/");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    // Show a clean loading state or spinner while checking the storage card
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#11091f] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#67b978] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4f7059] text-sm font-semibold animate-pulse">
            Authenticating user session...
          </p>
        </div>
      );
    }
    return <Component {...props} />;
  };
}
