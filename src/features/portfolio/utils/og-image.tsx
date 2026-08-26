import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const OG_FONT_FAMILY = "Noto Sans";
const OG_FONT_WEIGHT = 700;
const OG_BACKGROUND_COLOR = "#0a0d12";
const OG_FOREGROUND_COLOR = "#eef0f2";
const OG_MUTED_COLOR = "#a6adba";
const OG_ACCENT_COLOR = "#ff7a45";

interface OgImageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

// Google Fonts' default next/og font has no Vietnamese diacritics, so the
// vi locale's OG image would render tofu glyphs without this — fetch a
// Vietnamese-capable font, subset to only the glyphs this image actually uses.
async function loadOgFont(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans:wght@${OG_FONT_WEIGHT}&text=${encodeURIComponent(text)}`;
  const cssResponse = await fetch(cssUrl);
  const css = await cssResponse.text();
  const fontUrlMatch = css.match(/src: url\(([^)]+)\)/);

  if (!fontUrlMatch) {
    throw new Error("Could not find a font file URL in the Google Fonts CSS response");
  }

  const fontResponse = await fetch(fontUrlMatch[1]);
  return fontResponse.arrayBuffer();
}

export async function renderOgImage({ eyebrow, title, subtitle }: OgImageProps): Promise<ImageResponse> {
  const fontData = await loadOgFont(`${eyebrow}${title}${subtitle}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: OG_BACKGROUND_COLOR,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: OG_ACCENT_COLOR,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            color: OG_FOREGROUND_COLOR,
            marginTop: 24,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: OG_MUTED_COLOR,
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [{ name: OG_FONT_FAMILY, data: fontData, weight: OG_FONT_WEIGHT, style: "normal" }],
    },
  );
}
