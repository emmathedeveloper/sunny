import { useAvatarContext } from "@/components/AnimatedAvatar/AvatarContext";
import { useRef, useState } from "react";




type speakOptions = {
    onStart?: () => void
    onEnd?: () => void
}


export default function useAgentSpeechState() {

    const { setVisemeFrames , audioContextRef , currentVisemeIndexRef , speechStartTimeRef } = useAvatarContext()
    
    const [agentIsSpeaking, setAgentIsSpeaking] = useState(false)
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);


    async function loadAudioBuffer(url: string , visemesUrl: string) {

        if (!audioContextRef.current) throw new Error("Missing Audio Context")

        const [audio , visemes] = await Promise.all([fetch(url) ,fetch(visemesUrl)]);
        const arrayBuffer = await audio.arrayBuffer();
        const parsedVisemes = await visemes.json()
        return [arrayBuffer , parsedVisemes]
    }


    const speak = async (audioBuffer: ArrayBuffer | string, callbacks?: speakOptions) => {

        return new Promise<any>(async (res, rej) => {
            try {

                // Stop any currently playing audio
                if (sourceRef.current) {
                    sourceRef.current.stop();
                    sourceRef.current.disconnect();
                    sourceRef.current = null;
                }

                // Set agent as speaking while audio plays
                setAgentIsSpeaking(true);

                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                }

                let buff: ArrayBuffer;

                if (typeof audioBuffer == 'string') {
                    const [audio , visemes] = await loadAudioBuffer(`./assets/agent/audio/${audioBuffer}.ogg` , `./assets/agent/lipsync/${audioBuffer}.json`)
                    
                    buff = audio as ArrayBuffer
                    
                    speechStartTimeRef.current = audioContextRef.current.currentTime
                    currentVisemeIndexRef.current = 0

                    setVisemeFrames(visemes.mouthCues)
                } else {
                    buff = audioBuffer
                }

                const audioContext = audioContextRef.current;
                const decodedAudio = await audioContext.decodeAudioData(buff.slice(0));
                const source = audioContext.createBufferSource();
                source.buffer = decodedAudio;
                source.connect(audioContext.destination);
                sourceRef.current = source;
                source.start(0);

                callbacks?.onStart?.()

                // Calculate duration and set agent as not speaking when done
                const duration = decodedAudio.duration * 1000;
                setTimeout(() => {
                    setAgentIsSpeaking(false);
                    callbacks?.onEnd?.()
                    res('')
                }, duration);
            } catch (error) {
                console.error("Error playing audio:", error);
                setAgentIsSpeaking(false);
                rej(error)
            }
        })
    };

    return { agentIsSpeaking, setAgentIsSpeaking, speak };
}