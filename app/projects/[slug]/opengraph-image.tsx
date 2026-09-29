import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { getProjectBySlug } from "@/lib/data/projects";
import { formatPrice } from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Deep Group project";

const dataUri = (file: string, mime: string) =>
  `data:${mime};base64,${fs.readFileSync(path.join(process.cwd(), "public", file)).toString("base64")}`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProjectBySlug(slug)!;
  const cover = dataUri(p.images.cover.src, "image/jpeg");
  const logo = dataUri("logo-mark.png", "image/png");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#650727",
            borderTop: "4px solid #c9943c",
            padding: "28px 48px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52 }}>{p.name}</div>
            <div style={{ fontSize: 26, color: "#f6ecd9" }}>
              {`${p.location.locality} · ${p.price.onRequest || !p.price.min ? "Price on request" : `from ${formatPrice(p.price.min)}`}`}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" height={90} style={{ height: 90 }} />
        </div>
      </div>
    ),
    size,
  );
}
