import { useAvatarContext } from '@/components/AnimatedAvatar/AvatarContext';
import { useGameContext } from '@/components/Rooms/GameContext';
import useAgentSpeechState from '@/hooks/useAgentSpeechState';
import useAppWebSocket from '@/hooks/useAppWebSocket';
import useGameAudio from '@/hooks/useGameAudio';
import { AudioFormat, CommitStrategy, useScribe } from '@elevenlabs/react';
import { useEffect, useRef, useState } from 'react';
import MainSidebar from '../components/MainSidebar';
import GameRoomView from '../components/GameRoomView';
import AvatarPanel from '../components/AvatarPanel';
import { useGameFlow } from '@/hooks/useGameFlow';

const MainView = () => {

    const scribeRef = useRef<{ disconnect: () => void; clearTranscripts: () => void } | null>(null);

    const appSocketRef = useRef<{ sendMessage: (data: any) => void } | null>(null);

    const [_ , setSpeechActions] = useState<{ start: string[], end: string[] }>({ start: [], end: [] })

    const { isLoadingAvatar, setCurrentAnimation, setIsAnimationPaused } = useAvatarContext()

    const {
        conversationPaused,
        setConversationPaused,
        currentRoom
    } = useGameContext()

    const { agentIsSpeaking, speak } = useAgentSpeechState()

    const { pauseAudio, resumeAudio, startBackgroundMusic, playWin, playLose, init, toggleBackgroundMute, bgMuted } = useGameAudio({
        backgroundMusicUrl: '/assets/music/bg1.m4a',
        winUrl: '/assets/music/win2.m4a',
        loseUrl: '/assets/music/loose.m4a',
        fadeInDuration: 2,
    })

    const {
        handleWelcomeFlow,
        handleGameFlow,
        hasClickedAvatar,
        hasGreeted,
        awaitingResponse,
        currentFlowState,
        setAwaitingResponse,
        resetActivity,
        setHasGreeted,
        handleActions,
        switchRoom,
        calculateGameRoomTransition,
        handleSwitchToGameView,
        setHasClickedAvatar
    } = useGameFlow({
        speak,
        sendMessage: (data) => appSocketRef.current?.sendMessage(data),
        playWin: () => playWin(),
        playLose: () => playLose(),
        onResetWelcome: () => { }
    })

    const scribe = useScribe({
        modelId: "scribe_v2_realtime",
        audioFormat: AudioFormat.PCM_16000,
        commitStrategy: CommitStrategy.VAD,
        vadSilenceThresholdSecs: 1.5,
        vadThreshold: 0.4,
        minSpeechDurationMs: 100,
        minSilenceDurationMs: 100,
        languageCode: "eng",
        onConnect: () => {

            speak("general-greeting", {
                onStart() {
                    setCurrentAnimation('waving_one_hand')
                },
                onEnd() {
                    setCurrentAnimation('listen')
                    setHasGreeted(true)
                    setAwaitingResponse(true);
                }
            })

        },
        onCommittedTranscript: (data) => {
            appSocketRef.current?.sendMessage({
                type: "transcript",
                payload: { text: data.text }
            })
        },
    });

    scribeRef.current = scribe;

    const appSocket = useAppWebSocket({
        url: `ws${!window.location.host.includes('localhost:') ? 's' : ''}://${window.location.host}/ws`,
        onMessage: (event) => {
            const data = JSON.parse(event.data);

            if (data.type == "transcription_result" && data.payload.text) {

                if (conversationPaused) {
                    scribe.clearTranscripts()
                }

                if (agentIsSpeaking || conversationPaused) return;

                console.log(awaitingResponse, currentFlowState, data.payload.text);

                if (awaitingResponse) {
                    if (currentFlowState == "welcome") return handleWelcomeFlow(data.payload.text.toLowerCase());

                    if (currentFlowState == "game" && currentRoom !== 'letter') return handleGameFlow(data.payload.text.toLowerCase());
                }
            }

            if (data.type == "speech_action" && data.payload) {

                const a = data.payload.speechActions

                const actions = {
                    start: a?.start.length ? a.start : [],
                    end: a?.end.length ? a.end : [],
                }

                setSpeechActions(actions)

                speak(data.payload.audio, {
                    onStart() {
                        handleActions(actions.start)
                    },
                    onEnd() {
                        handleActions(actions.end)
                    }
                })
            }
        },
    });

    appSocketRef.current = appSocket;

    const handleStart = async () => {
        if (isLoadingAvatar) return;
        try {
            if (!scribe.isConnected) {
                const { token } = await fetch('/scribe-token').then((res) => res.json());
                await scribe.connect({
                    token,
                    microphone: {
                        echoCancellation: true,
                        noiseSuppression: true,
                    },
                });
                await init();
                await startBackgroundMusic(true);
            }
            setHasClickedAvatar(true);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.error('Error fetching token:', e);
        }
    };

    useEffect(() => {

        if (!hasGreeted || !hasClickedAvatar) return

        setAwaitingResponse(!conversationPaused)
        setIsAnimationPaused(conversationPaused)
        if (conversationPaused) {
            pauseAudio()
            scribeRef.current?.clearTranscripts()
        } else {
            resumeAudio()
        }
    }, [conversationPaused])

    return (
        <div className='size-full flex p-2 gap-2'>

            <MainSidebar
                bgMuted={bgMuted}
                conversationPaused={conversationPaused}
                currentFlowState={currentFlowState}
                currentRoom={currentRoom}
                onReset={resetActivity}
                onSwitchRoom={switchRoom}
                onToggleMute={toggleBackgroundMute}
                onTogglePause={() => setConversationPaused(!conversationPaused)}
            />

            {
                currentFlowState == 'game' &&
                <GameRoomView
                    currentRoom={currentRoom}
                    onLetterClicked={handleGameFlow}
                    calculateGameRoomTransition={calculateGameRoomTransition}
                />
            }

            <AvatarPanel
                onStart={handleStart}
                isLoadingAvatar={isLoadingAvatar}
                hasClickedAvatar={hasClickedAvatar}
                hasGreeted={hasGreeted}
                currentFlowState={currentFlowState}
                onStartGame={handleSwitchToGameView}
            />


        </div>
    )
}

export default MainView