import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type Ref, type RefObject, type SetStateAction } from "react";
import type { Scene } from "three";
import * as THREE from "three";

type VisemeFrame = {
    start: number,
    end: number,
    value: string
}

type AvatarContextType = {
    isLoadingAvatar: boolean,
    setIsLoadingAvatar: Dispatch<SetStateAction<boolean>>,
    currentAnimation: keyof typeof ANIMATION_MAP | null,
    setCurrentAnimation: Dispatch<SetStateAction<keyof typeof ANIMATION_MAP | null>>,
    isAnimationPaused: boolean,
    setIsAnimationPaused: Dispatch<SetStateAction<boolean>>,
    currentViseme: string,
    setCurrentViseme: Dispatch<SetStateAction<string>>,
    visemeFrames: VisemeFrame[],
    setVisemeFrames: Dispatch<SetStateAction<VisemeFrame[]>>,
    audioContextRef: RefObject<AudioContext | null>,
    speechStartTimeRef: RefObject<number>,
    currentVisemeIndexRef: RefObject<number>,
}

export const ANIMATION_MAP = {
    'idle': 'Idle',
    'happy_idle': "Happy Idle",
    'laughing': 'Laughing',
    'listen': 'Listen',
    'sad_idle': 'Sad Idle',
    'sad_idle_kick': 'Sad Idle Kick',
    'better_luck_next_time': 'Sad_Better_Luck_Nect_Time',
    'talking': 'Talking',
    'thumbs_up': 'Thumbs_Up',
    'thumbs_up_happy': 'Thumbs Up Happy',
    'waving_one_hand': 'Waving_One_Hand'
}

const AvatarContext = createContext<AvatarContextType>({} as any)

const AvatarProvider = ({ children }: { children?: ReactNode }) => {

    const [isLoadingAvatar, setIsLoadingAvatar] = useState(true)

    const [currentAnimation, setCurrentAnimation] = useState<keyof typeof ANIMATION_MAP | null>("idle");

    const [isAnimationPaused, setIsAnimationPaused] = useState(false);

    const [currentViseme, setCurrentViseme] = useState<string>('')

    const currentVisemeIndexRef = useRef(0);

    const [visemeFrames, setVisemeFrames] = useState<VisemeFrame[]>([])

    const audioContextRef = useRef<AudioContext | null>(null);

    const speechStartTimeRef = useRef<number>(0);

    const scene = useRef<Scene | null>(null)

    useEffect(() => {

    } , []);

    function applyViseme(visemeName: string) {

        if(!scene.current) return

        scene.current.traverse((child: any) => {
            if (
                child instanceof THREE.Mesh &&
                child.morphTargetDictionary &&
                child.morphTargetInfluences
            ) {
                Object.keys(child.morphTargetDictionary).forEach((key) => {
                    const index = child.morphTargetDictionary![key];

                    if(index) child.morphTargetInfluences![index] =
                        key === visemeName ? 1 : 0;
                });
            }
        });
    }


    return (
        <AvatarContext.Provider value={{
            isLoadingAvatar,
            setIsLoadingAvatar,
            currentAnimation,
            setCurrentAnimation,
            isAnimationPaused,
            setIsAnimationPaused,
            currentViseme,
            setCurrentViseme,
            audioContextRef,
            speechStartTimeRef,
            visemeFrames,
            setVisemeFrames,
            currentVisemeIndexRef
        }}>
            {children}
        </AvatarContext.Provider>
    )
}

const useAvatarContext = () => useContext<AvatarContextType>(AvatarContext)

export { AvatarProvider, useAvatarContext }