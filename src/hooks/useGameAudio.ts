import { useEffect, useRef, useCallback, useState } from "react";

type UseGameAudioOptions = {
    backgroundMusicUrl: string;
    winUrl: string;
    loseUrl: string;
    bgVolume?: number;
    duckVolume?: number;   // recommended 0.3–0.4
    fadeDuration?: number;
    fadeInDuration?: number;
};

export default function useGameAudio({
    backgroundMusicUrl,
    winUrl,
    loseUrl,
    bgVolume = .3,
    duckVolume = 0,
    fadeDuration = 0.5,
    fadeInDuration = 1,
}: UseGameAudioOptions) {
    const ctxRef = useRef<AudioContext | null>(null);

    const bgGainRef = useRef<GainNode | null>(null);
    const fxGainRef = useRef<GainNode | null>(null);

    const bgSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const bgBufferRef = useRef<AudioBuffer | null>(null);
    const winBufferRef = useRef<AudioBuffer | null>(null);
    const loseBufferRef = useRef<AudioBuffer | null>(null);

    const resultPlayingRef = useRef(false);

    const [paused, setPaused] = useState(false);
    const [bgMuted, setBgMuted] = useState(false);
    const bgVolumeRef = useRef(bgVolume);

    const init = useCallback(async () => {
        if (ctxRef.current) return;

        const ctx = new AudioContext();
        ctxRef.current = ctx;

        const bgGain = ctx.createGain();
        const fxGain = ctx.createGain();

        bgGain.connect(ctx.destination);
        fxGain.connect(ctx.destination);

        bgGain.gain.value = 0; // start silent (for fade-in)
        fxGain.gain.value = 0;

        bgGainRef.current = bgGain;
        fxGainRef.current = fxGain;

        const [bgRes, winRes, loseRes] = await Promise.all([
            fetch(backgroundMusicUrl),
            fetch(winUrl),
            fetch(loseUrl),
        ]);

        const [bgBuffer, winBuffer, loseBuffer] = await Promise.all([
            ctx.decodeAudioData(await bgRes.arrayBuffer()),
            ctx.decodeAudioData(await winRes.arrayBuffer()),
            ctx.decodeAudioData(await loseRes.arrayBuffer()),
        ]);

        bgBufferRef.current = bgBuffer;
        winBufferRef.current = winBuffer;
        loseBufferRef.current = loseBuffer;
    }, [backgroundMusicUrl, winUrl, loseUrl]);


    const startBackgroundMusic = useCallback(async (fade = false) => {
        if (!ctxRef.current || !bgBufferRef.current || !bgGainRef.current)
            return;

        const ctx = ctxRef.current;
        await ctx.resume();

        if (bgSourceRef.current) return;

        const source = ctx.createBufferSource();
        source.buffer = bgBufferRef.current;
        source.loop = true;

        source.connect(bgGainRef.current);

        if (fade) {
            const now = ctx.currentTime;

            bgGainRef.current.gain.setValueAtTime(0, now);
            bgGainRef.current.gain.linearRampToValueAtTime(
                bgVolume,
                now + fadeInDuration
            );
        }

        source.start();
        bgSourceRef.current = source;
    }, [bgVolume, fadeInDuration]);

    const playResult = useCallback(
        (type: "win" | "lose") => {
            if (
                !ctxRef.current ||
                !bgGainRef.current ||
                !fxGainRef.current ||
                paused
            )
                return;

            if (resultPlayingRef.current) return;

            const buffer =
                type === "win"
                    ? winBufferRef.current
                    : loseBufferRef.current;

            if (!buffer) return;

            resultPlayingRef.current = true;

            const ctx = ctxRef.current;
            const now = ctx.currentTime;

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(fxGainRef.current);

            // Duck background
            bgGainRef.current.gain.cancelScheduledValues(now);
            bgGainRef.current.gain.linearRampToValueAtTime(
                duckVolume,
                now + fadeDuration
            );

            // Fade FX in
            fxGainRef.current.gain.setValueAtTime(0, now);
            fxGainRef.current.gain.linearRampToValueAtTime(
                .6,
                now + fadeDuration
            );

            source.start();

            source.onended = () => {
                const t = ctx.currentTime;

                fxGainRef.current?.gain.linearRampToValueAtTime(
                    0,
                    t + fadeDuration
                );

                bgGainRef.current?.gain.linearRampToValueAtTime(
                    bgVolume,
                    t + fadeDuration
                );

                resultPlayingRef.current = false;
            };
        },
        [bgVolume, duckVolume, fadeDuration, paused]
    );

    const playWin = () => playResult("win");
    const playLose = () => playResult("lose");

    const pauseAudio = useCallback(async () => {
        if (!ctxRef.current) return;

        await ctxRef.current.suspend();
        setPaused(true);
    }, []);

    const resumeAudio = useCallback(async () => {
        if (!ctxRef.current) return;

        await ctxRef.current.resume();
        setPaused(false);
    }, []);

    const muteBackgroundMusic = useCallback(() => {
        if (!bgGainRef.current) return;
        bgGainRef.current.gain.value = 0;
        setBgMuted(true);
    }, []);

    const unmuteBackgroundMusic = useCallback(() => {
        if (!bgGainRef.current) return;
        bgGainRef.current.gain.value = bgVolumeRef.current;
        setBgMuted(false);
    }, []);

    const toggleBackgroundMute = useCallback(() => {
        if (bgMuted) {
            unmuteBackgroundMusic();
        } else {
            muteBackgroundMusic();
        }
    }, [bgMuted, muteBackgroundMusic, unmuteBackgroundMusic]);

    useEffect(() => {
        return () => {
            ctxRef.current?.close();
        };
    }, []);

    return {
        init,
        startBackgroundMusic,
        playWin,
        playLose,
        pauseAudio,
        resumeAudio,
        muteBackgroundMusic,
        unmuteBackgroundMusic,
        toggleBackgroundMute,
        paused,
        bgMuted,
    };
}