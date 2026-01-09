export interface RenderOptions {
  quote: string;
  isEnglish: boolean;
  backgroundImage: HTMLImageElement;
}

const CANVAS_WIDTH = 1170;
const CANVAS_HEIGHT = 2532;
const TEXT_COLOR = "#F0EAD6";
const TEXT_MAX_WIDTH_RATIO = 0.7;
const TEXT_VERTICAL_POSITION = 0.55;

export async function renderWallpaper(options: RenderOptions): Promise<string> {
  const { quote, isEnglish, backgroundImage } = options;

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  // Draw background with cover fill
  drawBackgroundCover(ctx, backgroundImage);

  // Draw text
  drawText(ctx, quote, isEnglish);

  // Convert to PNG
  return canvas.toDataURL("image/png");
}

function drawBackgroundCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
) {
  const canvasAspect = CANVAS_WIDTH / CANVAS_HEIGHT;
  const imgAspect = img.width / img.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgAspect > canvasAspect) {
    // Image is wider than canvas
    drawHeight = CANVAS_HEIGHT;
    drawWidth = img.width * (CANVAS_HEIGHT / img.height);
    offsetX = (CANVAS_WIDTH - drawWidth) / 2;
    offsetY = 0;
  } else {
    // Image is taller than canvas
    drawWidth = CANVAS_WIDTH;
    drawHeight = img.height * (CANVAS_WIDTH / img.width);
    offsetX = 0;
    offsetY = (CANVAS_HEIGHT - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  isEnglish: boolean
) {
  const maxWidth = CANVAS_WIDTH * TEXT_MAX_WIDTH_RATIO;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT * TEXT_VERTICAL_POSITION;

  // Font settings
  const fontFamily = isEnglish
    ? "'Times New Roman', Georgia, serif"
    : "'SimSun', 'Source Han Serif SC', serif";
  const fontSize = isEnglish ? 52 : 56;
  const lineHeight = fontSize * 1.6;

  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Wrap text
  const lines = wrapText(ctx, text, maxWidth);

  // Calculate total height
  const totalHeight = lines.length * lineHeight;
  let startY = centerY - totalHeight / 2 + lineHeight / 2;

  // Draw each line
  lines.forEach((line) => {
    ctx.fillText(line, centerX, startY);
    startY += lineHeight;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
