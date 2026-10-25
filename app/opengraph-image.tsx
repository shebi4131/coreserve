import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Coreserve Facilities Group — Property care, properly coordinated";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const manropeExtraBold = readFile(
  join(process.cwd(), "node_modules", "@fontsource", "manrope", "files", "manrope-latin-800-normal.woff"),
);
const brandMark = readFile(join(process.cwd(), "public", "brand", "coreserve-mark.png"))
  .then((file) => `data:image/png;base64,${file.toString("base64")}`);

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#062c50", color: "#ffffff", fontFamily: "Manrope" }}>
      <div style={{ position: "absolute", width: 560, height: 560, border: "2px solid rgba(255,255,255,.08)", borderRadius: "50%", right: -120, top: -170, display: "flex" }} />
      <div style={{ position: "absolute", width: 340, height: 340, border: "66px solid rgba(35,99,147,.18)", borderRadius: "50%", right: 75, bottom: -180, display: "flex" }} />
      <div style={{ width: "100%", padding: "74px 82px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 76, height: 76, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 18, background: "#ffffff" }}>
            <img src={await brandMark} width={68} height={68} style={{ objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontWeight: 800, fontSize: 26, letterSpacing: "-.02em" }}>CORESERVE<span style={{ marginTop: 5, color: "#ffffff", fontSize: 13, letterSpacing: ".17em" }}>FACILITIES GROUP</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 850 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 72, lineHeight: 1.04, fontWeight: 800, letterSpacing: "-.035em" }}><span>Property care,</span><span style={{ color: "#8998a7" }}>properly coordinated.</span></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#c4d4de", fontSize: 19 }}><span>Preston, Lancashire</span><span>+92 330 111 9592</span></div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Manrope", data: await manropeExtraBold, weight: 800, style: "normal" }] },
  );
}
