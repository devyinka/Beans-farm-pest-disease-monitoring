"use client";
import Image from "next/image";
import { useState } from "react";

import type { AuthLogoBadgeProps } from "./types";

const AuthLogoBadge = ({ src, alt, fallbackText }: AuthLogoBadgeProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="flex h-14.5 w-14.5 items-center justify-center rounded-[14px] border border-[rgba(184,147,255,0.28)] bg-[rgba(184,147,255,0.1)] shadow-[0_8px_24px_rgba(139,61,255,0.22)]">
      {imageFailed ? (
        <span className="px-1 text-center text-[9px] font-bold tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
          {fallbackText}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
};

export default AuthLogoBadge;
