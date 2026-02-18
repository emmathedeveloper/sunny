import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Grid,
  PerspectiveCamera,
} from "@react-three/drei";
import { BearModel } from "./BearModel";
import { useAvatarContext } from "./AvatarContext";

const Avatar: React.FC = () => {
  const { isLoadingAvatar } = useAvatarContext();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Canvas
        style={{
          background: "transparent",
        }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0); // Transparent background
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={75} />

        <ambientLight intensity={0.4} />

        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}

        />

        <spotLight
          position={[-10, 10, -5]}
          intensity={0.5}
          angle={0.3}
          penumbra={1}
        />

        <hemisphereLight intensity={0.3} groundColor="#444444" />

        <BearModel />

        <Environment preset="sunset"  />
      </Canvas>

      {isLoadingAvatar && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-xl z-20">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading avatar...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
