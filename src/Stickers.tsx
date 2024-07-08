import React from "react";
import { useTexture, Decal, MeshTransmissionMaterial } from "@react-three/drei";
import { DoubleSide } from "three/src/constants.js";
import { DecalProps } from "@react-three/drei/core/Decal";
import { Vector3, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const PRICE_TAG_IMAGES = ["./price-tag-1.png", "./sticker-2.webp"];
const DEFAULT_SCALE: Vector3 = [0.5, 0.25, 0.25];
const THRESHOLD = 10;

let order = 0;
const Stickers = () => {
  const [initialMousePosition, setInitialMousePosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [stickers, setStickers] = React.useState<DecalProps[]>([]);
  // const textures = useTexture(PRICE_TAG_IMAGES);
  const textures = useLoader(TextureLoader, PRICE_TAG_IMAGES);
  const texturesB = useLoader(TextureLoader, "./logo-javascript.svg");

  const handleOnMouseDown = React.useCallback((event) => {
    setInitialMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleOnMouseUp = React.useCallback(
    (event) => {
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
            rotation: Math.PI * (Math.random() * (2.2 - 1.8) + 1.8),
            scale: DEFAULT_SCALE.map((s) => s + Math.random() * 0.1),
            texture: textures[Math.floor(Math.random() * textures.length)],
            renderOrder: order++,
          },
        ]);
      }
    },
    [stickers, initialMousePosition, textures],
  );

  return (
    <mesh
      castShadow
      receiveShadow
      onPointerDown={handleOnMouseDown}
      onPointerUp={handleOnMouseUp}
    >
      <sphereGeometry args={[1, 64, 64]} />
      {stickers.map((sticker, i) => (
        <Decal key={i} {...sticker}>
          <meshPhysicalMaterial
            map={sticker.texture}
            roughness={0.6}
            clearcoat={0.5}
            metalness={0.8}
            polygonOffsetFactor={-4}
            transparent={true}
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
        transmission={1.0}
        reflectivity={0.2}
        ior={1.4}
        clearcoat={1}
        roughness={0}
        metalness={0.0}
        clearcoatRoughness={0}
        transparent={true}
        side={DoubleSide}
      />
      {/*<meshBasicMaterial color={'#ccc'} transparent={true} opacity={0.5} />*/}
    </mesh>
  );
};

export default React.memo(Stickers);

useTexture.preload(PRICE_TAG_IMAGES);
