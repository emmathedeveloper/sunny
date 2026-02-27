import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';
import { ANIMATION_MAP, useAvatarContext } from './AvatarContext';
import { useFrame } from '@react-three/fiber';

const visemeMapping = {
  A: "Mbp",
  B: "Cdest",
  C: "Ai",
  D: "Ai",
  E: "O",
  F: "Uw",
  G: "Fv",
  H: "L",
  X: "Neutral",
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

  const { scene, animations } = useGLTF('/assets/models/Grizzly_3.glb') as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const missingMorphTargetsRef = useRef(new Set<string>());

  useFrame(() => {

    if (!visemeFrames.length || !audioContextRef.current) return;

    const elapsed =
      audioContextRef.current.currentTime - speechStartTimeRef.current;

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

      const desiredHeight = environment === 'small' ? 3.0 : 3.8;
      const scaleFactor = desiredHeight / size.y;
      group.current.scale.setScalar(scaleFactor);

      const scaledCenter = center.clone().multiplyScalar(scaleFactor);
      const scaledMinY = box.min.y * scaleFactor;

      group.current.position.x = -scaledCenter.x;
      group.current.position.z = -scaledCenter.z + 4;
      const extraDown = 0.16; 
      group.current.position.y = -scaledMinY - extraDown;


      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;


        }

        if (child.isSkinnedMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
          const allVisemeTargets = Object.values(visemeMapping).filter(v => v) as string[]

          allVisemeTargets.forEach((visemeTarget) => {
            const index = child.morphTargetDictionary[visemeTarget];
            if (index !== undefined && child.morphTargetInfluences[index] !== undefined) {
              child.morphTargetInfluences[index] = 0;
            }
          });
        }
      });
      
      setIsLoadingAvatar(false);
    }
  }, [scene, actions, setIsLoadingAvatar, environment]);

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
      action.weight = 0.8;
    }

    if (action && isAnimationPaused) {
      Object.values(actions).forEach((a) => {
        if (a !== action) {
          a?.fadeOut(0.5);
        }
      });

      action.paused = isAnimationPaused;
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

    if (!morphTargetFound && !missingMorphTargetsRef.current.has(target)) {
      missingMorphTargetsRef.current.add(target);

      const availableTargets: string[] = [];
      scene.traverse((child: any) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          availableTargets.push(...Object.keys(child.morphTargetDictionary));
        }
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