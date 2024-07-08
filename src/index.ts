import * as THREE from "three";

interface Props {
  path: string;
  width?: number;
  height?: number;
}

const map = new Map<string, THREE.Texture | undefined>();
export async function importSVG(
  props: Props,
): Promise<THREE.Texture | undefined> {
  const { path, width, height } = props;
  return new Promise<THREE.Texture | undefined>((resolve, reject) => {
    if (map.has(path)) {
      const texture = map.get(path);
      resolve(texture);
      return;
    }

    const targetWidth = width ?? 512 * 10;
    const targetHeight = height ?? 512 * 10;
    const canvas = new OffscreenCanvas(256, 256);

    const ctx = canvas.getContext("2d");
    if (ctx === null) return reject("init failed");
    ctx.imageSmoothingEnabled = true;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    console.log("canvas.width", canvas.width);

    const svgImage = new Image();

    svgImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const svgWidth = svgImage.width;
      const svgHeight = svgImage.height;

      const scale = Math.min(targetWidth / svgWidth, targetHeight / svgHeight);
      ctx.drawImage(svgImage, 0, 0, svgWidth * scale, svgHeight * scale);

      // download(canvas);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      map.set(path, texture);
      resolve(texture);
    };

    // Set the source of the image to the SVG URL
    svgImage.src = path;
    console.log("src", path);
    svgImage.onerror = (e) => {
      reject(e);
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = function (canvas: HTMLCanvasElement) {
  const link = document.createElement("a");
  link.download = "filename.png";
  link.href = canvas.toDataURL();
  link.click();
};
