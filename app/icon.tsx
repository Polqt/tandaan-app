import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #0f766e, #0f172a)",
        borderRadius: "8px",
        color: "white",
        display: "flex",
        fontSize: 18,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      T
    </div>,
    size,
  );
}
