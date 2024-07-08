import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Stickers from "./Stickers.js";

const App = () => (
  <Suspense fallback={<span>loading...</span>}>
    <Canvas shadows camera={{ position: [2, 2, 9], fov: 16 }}>
      <Perf position="top-right" showGraph={false} />
      <Stickers />
      <Environment preset="city" background={true} />
      <OrbitControls makeDefault />
    </Canvas>
  </Suspense>
);

export default App;
