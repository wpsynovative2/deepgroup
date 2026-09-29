import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Deep Group: homes and workspaces along the Western line";

const dataUri = (file: string, mime: string) =>
  `data:${mime};base64,${fs.readFileSync(path.join(process.cwd(), "public", file)).toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "white" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri("images/hero/hero.jpg", "image/jpeg")} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover", objectPosition: "bottom" }} />
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUri("logo-full.png", "image/png")} alt="" height={130} style={{ height: 130 }} />
          <div style={{ marginTop: 14, fontSize: 44, color: "#650727" }}>Homes and workspaces along the Western line</div>
        </div>
      </div>
    ),
    size,
  );
}
