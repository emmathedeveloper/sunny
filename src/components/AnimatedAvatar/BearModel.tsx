import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';
import { ANIMATION_MAP, useAvatarContext } from './AvatarContext';
import { useFrame } from '@react-three/fiber';

// Viseme mapping for lip sync
const visemeMapping = {
  // "viseme_sil": null, // silence
  // "viseme_PP": "viseme_PP", // P, B, M
  // "viseme_FF": "viseme_FF", // F, V
  // "viseme_TH": "viseme_TH", // TH
  // "viseme_DD": "viseme_DD", // T, D, N, L
  // "viseme_kk": "viseme_kk", // K, G
  // "viseme_CH": "viseme_CH", // CH, J, SH
  // "viseme_SS": "viseme_SS", // S, Z
  // "viseme_nn": "viseme_nn", // N
  // "viseme_RR": "viseme_RR", // R
  // "viseme_aa": "viseme_AA", // A (as in cat)
  // "viseme_AA": "viseme_AA", // A (as in cat)
  // "viseme_E": "viseme_E",   // E (as in red)
  // "viseme_I": "viseme_I",   // I (as in bit)
  // "viseme_O": "viseme_O",   // O (as in hot)
  // "viseme_U": "viseme_U",   // U (as in put)
  // // Handle versions without the viseme_ prefix
  // "sil": null,
  // "PP": "viseme_PP",
  // "FF": "viseme_FF",
  // "TH": "viseme_TH",
  // "DD": "viseme_DD",
  // "kk": "viseme_kk",
  // "CH": "viseme_CH",
  // "SS": "viseme_SS",
  // "nn": "viseme_nn",
  // "RR": "viseme_RR",
  // "aa": "viseme_AA",
  // "E": "viseme_E",
  // "I": "viseme_I",
  // "O": "viseme_O",
  // "U": "viseme_U",

  A: "Mbp",   // closed - M, B, P ✓ exact match
  B: "Cdest", // slightly open - K, S, T, D, N, R
  C: "Ai",    // open - EH, EY
  D: "Ai",    // wide open - AA, AE (same as C, just more open)
  E: "O",     // rounded - AO, AW ✓ exact match
  F: "Uw",    // puckered - OW, UW ✓ exact match
  G: "Fv",    // teeth - F, V ✓ exact match
  H: "L",     // relaxed open - L, TH ✓ exact match
  X: "Neutral", // idle/silence
} as const;

type GLTFResult = GLTF & {
  nodes: any;
  materials: any;
};

interface BearModelProps {
  environment?: 'big' | 'small';
}

export function BearModel({ environment = 'big' }: BearModelProps) {
  const { setIsLoadingAvatar, currentAnimation, isAnimationPaused, visemeFrames, audioContextRef, speechStartTimeRef, currentVisemeIndexRef } = useAvatarContext();
  const group = useRef<THREE.Group>(null);

  const { scene, animations, nodes } = useGLTF('/assets/models/Grizzly_3.glb') as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const missingMorphTargetsRef = useRef(new Set<string>());

  useFrame(() => {

    if (!visemeFrames.length || !audioContextRef.current) return;

    const elapsed =
      audioContextRef.current.currentTime - speechStartTimeRef.current;

    // Advance index only forward (O(1) instead of searching every frame)
    while (
      currentVisemeIndexRef.current < visemeFrames.length - 1 &&
      elapsed >= (visemeFrames[currentVisemeIndexRef.current + 1]?.start as number)
    ) {
      currentVisemeIndexRef.current++;
    }

    const frame = visemeFrames[currentVisemeIndexRef.current];

    if (!frame) return

    const morphTarget = visemeMapping[frame.value as keyof typeof visemeMapping];

    if (morphTarget) {
      lerpMorphTarget(morphTarget, 1, 0.2);
    }

    // Reset other viseme targets
    const allVisemeTargets = Object.values(visemeMapping).filter(v => v) as string[];
    allVisemeTargets.forEach((visemeTarget) => {
      if (visemeTarget !== morphTarget) {
        lerpMorphTarget(visemeTarget, 0, 0.1);
      }
    });
  })

  useEffect(() => {
    if (scene && group.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Adjust scale and position based on environment
      const desiredHeight = environment === 'small' ? 3.0 : 3.8;
      const zOffset = environment === 'small' ? 3.6 : 4.6; // smaller value = further back
      const scaleFactor = desiredHeight / size.y;
      console.log('Original size:', size);
      console.log('Scale factor:', scaleFactor);

      group.current.scale.setScalar(scaleFactor);

      // compute scaled center and bottom from original bbox (safer than re-querying scene)
      const scaledCenter = center.clone().multiplyScalar(scaleFactor);
      const scaledMinY = box.min.y * scaleFactor;

      // center horizontally (x/z) and push slightly down on y
      //  const extraForward = 0.3;
      group.current.position.x = -scaledCenter.x;
      // increase to move further forward
      //  const extraForward = 0.3;
      group.current.position.z = -scaledCenter.z + 4;
      const extraDown = 0.16; // increase to move further down
      group.current.position.y = -scaledMinY - extraDown;


      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;


        }

        if (child.isSkinnedMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
          const allVisemeTargets = Object.values(visemeMapping).filter(v => v) as string[]

          // Reset all viseme targets
          allVisemeTargets.forEach((visemeTarget) => {
            const index = child.morphTargetDictionary[visemeTarget];
            if (index !== undefined && child.morphTargetInfluences[index] !== undefined) {
              child.morphTargetInfluences[index] = 0;
            }
          });
        }
      });



      console.log('Bear loaded successfully');
      console.log('Available animations:', Object.keys(actions));

      setIsLoadingAvatar(false);
    }
  }, [scene, actions, setIsLoadingAvatar]);

  useEffect(() => {
    if (!currentAnimation || !actions) return;

    const animationName = ANIMATION_MAP[currentAnimation as keyof typeof ANIMATION_MAP];
    const action = actions[animationName];

    if (action && !isAnimationPaused) {
      Object.values(actions).forEach((a) => {
        if (a !== action) {
          a?.fadeOut(0.5);
        }
      });

      action.reset().fadeIn(0.5).play();
      action.weight = 0.8; // Reduce animation influence to 80% (change 0.8 to whatever you prefer: 0.5 = 50%, 0.7 = 70%, etc.)
      console.log('Playing animation:', animationName);
    }

    if (action && isAnimationPaused) {
      Object.values(actions).forEach((a) => {
        if (a !== action) {
          a?.fadeOut(0.5);
        }
      });

      action.paused = isAnimationPaused;
      console.log('Paused animation:', animationName);
    }
  }, [currentAnimation, actions, isAnimationPaused]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    if (!scene) return;

    let morphTargetFound = false;

    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) {
          return;
        }

        morphTargetFound = true;
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });

    // Log missing viseme targets (once per target) and available morph targets
    if (target.startsWith('viseme_') && !morphTargetFound && !missingMorphTargetsRef.current.has(target)) {
      missingMorphTargetsRef.current.add(target);

      // Find all available morph targets in the scene
      const availableTargets: string[] = [];
      scene.traverse((child: any) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          availableTargets.push(...Object.keys(child.morphTargetDictionary));
        }
      });

      console.warn("⚠️ AnimatedAvatarModel: Viseme morph target not found (one-time warning):", {
        target,
        value,
        availableTargets: availableTargets.length > 0 ? availableTargets : 'none'
      });
    }
  };

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/assets/models/Grizzly_3.glb');