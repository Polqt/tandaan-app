"use client";

import { motion } from "framer-motion";
import stringToColor from "@/lib/users/color";

export default function FollowPointer({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const color = stringToColor(info.email || "1");

  return (
    <motion.div
      className="absolute z-50 size-4 rounded-full"
      style={{
        left: x,
        pointerEvents: "none",
        top: y,
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      <svg
        aria-hidden="true"
        className="-translate-x-3 -translate-y-2.5 rotate-[70deg]"
        fill={color}
        focusable="false"
        height={24}
        stroke={color}
        strokeWidth={1}
        viewBox="0 0 16 16"
        width={24}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>
      <motion.div
        style={{
          backgroundColor: color,
        }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        className="min-w-max rounded-full px-2 py-2 text-xs font-bold text-black"
      >
        {info?.name || info.email}
      </motion.div>
    </motion.div>
  );
}
