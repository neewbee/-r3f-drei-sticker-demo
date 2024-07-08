import React from "react";
import { useTexture, Decal, MeshTransmissionMaterial } from "@react-three/drei";
import { DoubleSide } from "three/src/constants.js";
import { DecalProps } from "@react-three/drei/core/Decal";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { importSVG } from "./index.ts";
import viteSVG from "./assets/vite.svg";
import logoJavascript from "./assets/jslogo.svg";
import webGLLOGO from "./assets/webgl.svg";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";

const THRESHOLD = 10;

const pngs = [
  {
    src: "./smiley.png",
    scale: [-0.5, 0.5, 0.25],
  },
];

const svgs = [
  {
    src: logoJavascript,
    scale: [-0.5, -0.5, 0.25],
  },
  {
    src: viteSVG,
    scale: [-0.5, -0.5, 0.1],
  },
  {
    src: webGLLOGO,
    scale: [-0.5, -0.5, 0.1],
  },
];

const imageArray = [...pngs, ...svgs];

const PNG_IMAGES = pngs.map((png) => png.src);

const svgTextures: Array<THREE.Texture | undefined> = [];

void Promise.all(
  svgs.map((e) => {
    return importSVG({ path: e.src, width: 2500, height: 2500 });
  }),
).then((texture) => {
  texture.filter(Boolean).forEach((text) => svgTextures.push(text));
});

let order = 0;
const Stickers = () => {
  const [initialMousePosition, setInitialMousePosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [stickers, setStickers] = React.useState<DecalProps[]>([]);
  const pngTextures = useLoader(THREE.TextureLoader, PNG_IMAGES);

  const handleOnMouseDown = React.useCallback(
    (event: { clientX: number; clientY: number }) => {
      setInitialMousePosition({ x: event.clientX, y: event.clientY });
    },
    [],
  );

  const handleOnMouseUp = React.useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const textures = [...pngTextures, ...svgTextures];
      const index = Math.floor(Math.random() * textures.length);
      if (
        !(
          Math.abs(event.clientX - initialMousePosition.x) > THRESHOLD ||
          Math.abs(event.clientY - initialMousePosition.y) > THRESHOLD
        )
      ) {
        setStickers([
          ...stickers,
          {
            position: event.point,
            // @ts-expect-error https://github.com/pmndrs/react-three-fiber/issues/2668
            rotation: Math.PI * (Math.random() * (2.2 - 1.8) + 1.8),
            // scale: data[index].scale,
            // @ts-expect-error https://github.com/pmndrs/react-three-fiber/issues/2668
            scale: imageArray[index].scale?.map((s) => s + Math.random() * 0.1),
            // @ts-expect-error https://github.com/pmndrs/react-three-fiber/issues/2668
            texture: textures[index],
            renderOrder: order++,
          },
        ]);
      }
    },
    [stickers, initialMousePosition, pngTextures, svgTextures],
  );

  return (
    <mesh onPointerDown={handleOnMouseDown} onPointerUp={handleOnMouseUp}>
      <sphereGeometry args={[1, 64, 64]} />
      {stickers.map((sticker, i) => (
        <Decal key={i} {...sticker}>
          <meshPhysicalMaterial
            // @ts-expect-error TODO
            map={sticker["texture"]}
            roughness={0.9}
            clearcoat={0.0}
            alphaTest={0.01}
            metalness={0.1}
            polygonOffsetFactor={-4}
            transparent={false}
            polygonOffset={true}
            map-flipY={false}
            depthTest={true}
            depthWrite={false}
            toneMapped={false}
            side={DoubleSide}
          />
        </Decal>
      ))}
      <MeshTransmissionMaterial
        transmission={0.99}
        reflectivity={0.0}
        ior={2.0}
        clearcoat={1}
        roughness={0.0}
        metalness={0.0}
        clearcoatRoughness={0}
        transparent={false}
      />
      {/*<meshBasicMaterial color={'#ccc'} transparent={true} opacity={0.5} />*/}
    </mesh>
  );
};

export default React.memo(Stickers);

useTexture.preload(PNG_IMAGES);
