import Avatar from '@/components/AnimatedAvatar/Avatar';
import { useAvatarContext } from '@/components/AnimatedAvatar/AvatarContext';
import { useGameContext } from '@/components/Rooms/GameContext';
import LetterRoom from '@/components/Rooms/LetterRoom';
import useAgentSpeechState from '@/hooks/useAgentSpeechState';
import useAppWebSocket from '@/hooks/useAppWebSocket';
import useGameAudio from '@/hooks/useGameAudio';
import { QUESTIONS, ROOM_INTRO_MESSAGE, type QuestionType } from '@/lib/client/questions';
import { getRandomItem, PRAISE_MESSAGES, userAgreed } from '@/lib/client/utils';
import { cn } from '@/lib/utils';
import { AudioFormat, CommitStrategy, useScribe } from '@elevenlabs/react';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { Fragment, useCallback, useEffect, useState } from 'react';

const MainView = () => {

    const {
        conversationPaused,
        setConversationPaused,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentRoom,
        setCurrentRoom,
        questionFailureCount,
        setQuestionFailureCount,
        readyForNewRoom,
        setReadyForNewRoom,
        questions,
        setQuestions,
        updateQuestions
    } = useGameContext()

    const { playLose, playWin, pauseAudio, resumeAudio, startBackgroundMusic, init } = useGameAudio({
        backgroundMusicUrl: '/assets/music/bg1.m4a',
        winUrl: '/assets/music/win2.m4a',
        loseUrl: '/assets/music/loose.m4a',
        fadeInDuration: 2,
        bgVolume: .2
    })

    const { isLoadingAvatar, setCurrentAnimation, setIsAnimationPaused } = useAvatarContext()

    const [hasClickedAvatar, setHasClickedAvatar] = useState(false)

    const [hasGreeted, setHasGreeted] = useState(false)

    const { agentIsSpeaking, speak } = useAgentSpeechState();

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const [currentFlowState, setCurrentFlowState] = useState<"welcome" | "game" | "goodbye">("welcome");

    const [speechActions, setSpeechActions] = useState<{ start: string[], end: string[] }>({ start: [], end: [] })


    const { socket, sendMessage, isConnected } = useAppWebSocket({
        url: `ws${!window.location.host.includes('localhost:') ? 's' : ''}://${window.location.host}/ws`,
        onMessage: (event) => {
            const data = JSON.parse(event.data);

            if (data.type == "transcription_result" && data.payload.text) {

                if (conversationPaused) {
                    scribe.clearTranscripts()
                }

                //Don't send transcript to server if agent is speaking or if the game is paused to avoid interruptions
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
            console.log("Connected to Scribe");

            speak("general-greeting" , {
                onStart(){
                    setCurrentAnimation('waving_one_hand')
                },
                onEnd(){
                    setCurrentAnimation('listen')
                    setHasGreeted(true)
                    setAwaitingResponse(true);
                }
            })

        },
        onPartialTranscript: (data) => {
            // console.log("Partial:", data.text);
        },

        onCommittedTranscript: (data) => {
            sendMessage({
                type: "transcript",
                payload: { text: data.text }
            })
        },
    });



    const handleStart = async () => {

        if (isLoadingAvatar) return

        try {
            // Fetch a single use token from the server

            if (!scribe.isConnected) {
                const { token } = await fetch("/scribe-token").then(res => res.json());

                await scribe.connect({
                    token,
                    microphone: {
                        echoCancellation: true,
                        noiseSuppression: true,
                    },
                });

                await init()
                await startBackgroundMusic(true)
            }

            setHasClickedAvatar(true)

        } catch (e) {
            console.error("Error fetching token:", e);
            return;
        }
    };

    const handleSetAwaitingResponse = (value: boolean) => {
        setAwaitingResponse(value);
    }

    const handleWelcomeFlow = async (transcript: string) => {
        console.log("You said:", transcript);

        if (userAgreed(transcript)) {

            handleSwitchToGameView()

            // switchToGameView();

        } else if (transcript.toLowerCase().includes("no")) {
            sendMessage({
                type: "speak",
                payload: {
                    text: "",
                    speechActions: {
                        start: ['animation:talking'],
                        end: ['animation:idle']
                    }
                },
            });

            speak('general-refuse-to-play', {
                onStart() {
                    setCurrentAnimation('talking')
                },
                onEnd() {
                    setCurrentAnimation('idle')
                    setAwaitingResponse(false)
                }
            })

        } else {

            speak('general-did-not-catch', {
                onStart() {
                    setCurrentAnimation('talking')
                },
                onEnd() {
                    setCurrentAnimation('idle')
                    setAwaitingResponse(true)
                }
            })
        }
    }

    const handleGameFlow = useCallback(async (transcript: string) => {

        const currentQuestion = questions[currentQuestionIndex];

        const rooms = Object.keys(QUESTIONS)

        const isLastRoom = rooms.at(-1) == currentRoom

        const isLastQuestion = currentQuestionIndex === questions.length - 1

        if (readyForNewRoom && !isLastRoom && userAgreed(transcript)) {

            const currentRoomIndex = rooms.findIndex(r => r == currentRoom)

            const nextRoom = rooms[currentRoomIndex + 1] as keyof typeof QUESTIONS

            if (nextRoom) {
                switchRoom(nextRoom)
            }

            return
        }

        if (readyForNewRoom && !isLastRoom && !userAgreed(transcript)) {
            await speak('general-refuse-to-play', {
                onStart() {
                    setCurrentAnimation('talking')
                },
                onEnd() {
                    setCurrentAnimation('idle')
                    setAwaitingResponse(false)
                    reset()
                }
            })

            reset()

            return
        }

        //Check if answer is correct
        if (currentQuestion && currentQuestion.answers.some(answer => transcript.toLowerCase().includes(answer.toLowerCase()))) {

            //Check if this is the last question.
            if (isLastQuestion && isLastRoom) {

                await speak('general-congratulations', {
                    onStart() {
                        setCurrentAnimation('thumbs_up_happy')
                    },
                    onEnd() {
                        setCurrentAnimation('idle')
                        setAwaitingResponse(false)
                        reset()
                    }
                })

                return
            }

            if (isLastQuestion) {
                await speak(`general-play-more`, {
                    onStart() {
                        setCurrentAnimation('talking')
                    },
                    onEnd() {
                        setCurrentAnimation('listen')

                        setReadyForNewRoom(true)

                        setAwaitingResponse(true)
                    }
                })

                return
            }

            await speak(`praise-${Math.floor(Math.random() * PRAISE_MESSAGES.length)}`, {
                onStart() {
                    setCurrentAnimation('thumbs_up')
                    playWin()
                    setAwaitingResponse(false)
                },
                onEnd() {
                    setTimeout(() => {
                        setCurrentAnimation('idle')
                        askNextQuestion()
                    }, 2000)
                }
            })


        } else {
            if (currentQuestion) {

                if (questionFailureCount >= 1) {
                    await speak(`${currentRoom}-${currentQuestion.id}-${Math.floor(Math.random() * currentQuestion.helpPhrases.length)}-help-phrase`, {
                        onStart() {
                            setCurrentAnimation('sad_idle')
                            playLose()
                            setQuestionFailureCount(p => p + 1)
                        },
                        onEnd() {
                            setCurrentAnimation('listen')
                            setAwaitingResponse(true)
                        }
                    })
                } else {
                    await speak(`game-wrong-answer`, {
                        onStart() {
                            setCurrentAnimation('sad_idle')
                            playLose()
                            setQuestionFailureCount(p => p + 1)
                        },
                    })

                    await speak(`${currentRoom}-${currentQuestion.id}`, {
                        onStart() {
                            setCurrentAnimation('talking')
                        },
                        onEnd() {
                            setCurrentAnimation('listen')
                            setAwaitingResponse(true)
                        }
                    })
                }
            }
        }


    }, [currentRoom, currentQuestionIndex, questions, currentRoom, currentQuestionIndex, questions, readyForNewRoom, questionFailureCount, speak, playWin, playLose, setCurrentAnimation, setAwaitingResponse, setReadyForNewRoom, setQuestionFailureCount])

    const handleSwitchToGameView = () => {

        speak(`general-lets-start`, {
            onStart() {
                setCurrentAnimation('talking')
            },
            onEnd() {
                setCurrentAnimation('idle')
                switchRoom(currentRoom)
            },
        })
    }

    const switchRoom = async (room: keyof typeof QUESTIONS) => {

        let questions: QuestionType[]

        if (room == 'letter') {

            questions = updateQuestions(room)
        } else {
            questions = QUESTIONS[room]

            setQuestions(QUESTIONS[room])
        }

        if (conversationPaused) return

        const currentQuestion = questions[0];

        if (currentQuestion) {

            await speak(`${room}-intro`, {
                onStart() {
                    setCurrentAnimation('talking')
                    setCurrentFlowState('game')
                    setCurrentRoom(room)
                    setReadyForNewRoom(false)
                },
                onEnd() {
                    setCurrentQuestionIndex(0)
                },
            })

            await speak(`${room}-${currentQuestion.id}`, {
                onStart() {
                    setCurrentAnimation('talking')
                },
                onEnd() {
                    if (room == 'letter') {
                        setCurrentAnimation('idle')
                    } else {
                        setCurrentAnimation('listen')
                        setAwaitingResponse(true);
                    }
                },
            })

            return;
        }
    }

    const resetRoom = async () => {

        const room = currentRoom

        const currentQuestion = questions[0];

        if (currentQuestion) {

            await speak(`${room}-intro`, {
                onStart() {
                    setCurrentAnimation('talking')
                    setConversationPaused(false)
                    setCurrentRoom(room)
                },
                onEnd() {
                    setCurrentQuestionIndex(0)
                },
            })

            await speak(`${room}-${currentQuestion.id}`, {
                onStart() {
                    setCurrentAnimation('talking')
                },
                onEnd() {
                    setCurrentAnimation('listen')
                    setAwaitingResponse(true);
                },
            })

            return;
        }


    }

    const reset = () => {
        setCurrentFlowState("welcome")
        setCurrentRoom("playground")
        setReadyForNewRoom(false)
        setAwaitingResponse(false)
        setCurrentQuestionIndex(0)
        setCurrentAnimation('idle')
    }

    const resetActivity = () => {
        if (currentFlowState == 'game') {
            resetRoom()
        }

        if (currentFlowState == 'welcome') {
            setHasGreeted(false)
            setHasClickedAvatar(false)
            setCurrentAnimation('idle')
            scribe.disconnect()
        }
    }

    const handleActions = (actions: string[]) => {

        for (const action of actions) {

            const [key, value] = action.split(':')

            if (key == 'animation' && value) {
                setCurrentAnimation(value as any)
            }

            if (key == 'action') {

                if (value == 'stop_listen') return setAwaitingResponse(false)

                if (value == 'listen') return setAwaitingResponse(true)

                if (value == 'next_question') return askNextQuestion()

                if (value == 'has_greeted') return setHasGreeted(true)

                // if (value == 'switch_to_game_view') return switchToGameView()

                if (value == 'reset') return reset()

                if (value == 'play_win_sound') return playWin()

                if (value == 'play_lose_sound') return playLose()

                if (value == 'increment_failure_count') return setQuestionFailureCount(p => p + 1)

                if (value?.startsWith('set_flow_state')) {
                    const [_, state] = value.split('|')

                    setCurrentFlowState(state as any)
                }
            }
        }
    }

    const askNextQuestion = async () => {
        const nextQuestion = questions[currentQuestionIndex + 1]

        if (!nextQuestion) return;

        await speak(`${currentRoom}-${nextQuestion.id}`, {
            onStart() {
                setCurrentAnimation('talking')
                setCurrentQuestionIndex(p => p + 1)
            },
            onEnd() {
                if (currentRoom == 'letter') {
                    setCurrentAnimation('idle')
                } else {
                    setCurrentAnimation('listen')
                    setAwaitingResponse(true)
                }
            }
        })
    }

    const toggleMic = (enabled: boolean) => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                stream.getAudioTracks().forEach(track => {
                    track.enabled = false;
                });
            });
    }

    const calculateGameRoomTransition = (room: any) => {

        const roomIndex = Object.keys(QUESTIONS).findIndex(r => r == room)

        return `calc(-${roomIndex * 100}%)`
    }

    useEffect(() => {

        // if (!hasGreeted || !hasClickedAvatar) return

        setAwaitingResponse(!conversationPaused)
        setIsAnimationPaused(conversationPaused)
        if (conversationPaused) {
            pauseAudio()
            scribe.clearTranscripts()
        } else {
            resumeAudio()
        }
    }, [conversationPaused])

    return (
        <div className='size-full flex p-2 gap-2'>
            <aside className="w-20 bg-linear-to-b from-[#252D2D] to-[#3F4952] rounded-xl flex flex-col items-center py-4 justify-between">
                {/* Top Section */}
                <div className="flex flex-col items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 flex items-center justify-center p-2">
                        <img
                            src="./assets/logo.png"
                            alt="eMi Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Level Numbers - Vertically Centered */}
                {/* TODO: Show only when appState === 'game' */}
                {currentFlowState === "game" && (
                    <div className="flex flex-col gap-6">
                        {Object.keys(QUESTIONS).map((room, i) => (
                            <button
                                key={i + 1}
                                onClick={() => {
                                    switchRoom(room as any)
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${currentRoom === room
                                    ? "border-2 border-[#F8CB16] text-white"
                                    : "text-white/30 hover:text-white/50"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Bottom Reset Button */}
                <div className='flex flex-col gap-2'>

                        <button
                            className="w-11 h-11 rounded-lg bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors text-white"
                            title="Reset conversation"
                            onClick={() => {
                                setConversationPaused(!conversationPaused)
                            }}
                        >
                            {conversationPaused ? <PlayIcon /> : <PauseIcon />}
                        </button>

                    <button
                        onClick={resetActivity}
                        className="w-11 h-11 rounded-lg bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
                        title="Reset conversation"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                        >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                        </svg>
                    </button>
                </div>
            </aside>

            {
                currentFlowState == 'game' &&
                (
                    <div className="flex-1 w-full h-full bg-white rounded-xl border border-black/10 overflow-hidden relative scale-in">
                        {/* Background Image */}
                        <div
                            style={{ transform: `translateX(${calculateGameRoomTransition(currentRoom)})` }}
                            className='absolute size-full overflow-visible top-0 left-0 transition-transform'>
                            {
                                Object.keys(QUESTIONS).map((q, i) => (
                                    <Fragment key={i}>

                                        q != 'letter' ? <img
                                            style={{ transform: `translateX(calc(${i * 100 + '%'}))` }}
                                            className='absolute top-0 size-full object-cover' src={`./assets/${q}.jpg`} />
                                        : <div
                                            style={{ transform: `translateX(calc(${i * 100 + '%'}))` }}
                                            className='absolute top-0 size-full'
                                        >
                                            <LetterRoom onLetterClicked={handleGameFlow} />
                                        </div>
                                    </Fragment>
                                ))
                            }
                        </div>
                    </div>
                )
            }


            <div
                onClick={handleStart}
                className={cn(
                    'rounded-xl border border-black/10 relative overflow-hidden bg-cover bg-center bg-no-repeat h-full',
                    currentFlowState != 'welcome' ? 'w-[30%]' : 'w-full'
                )}
                style={{ backgroundImage: 'url(./assets/background.jpg)' }}
            >
                <Avatar />

                {!isLoadingAvatar && !hasClickedAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src="./assets/pointing_thumb.gif"
                                alt="Click to start"
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                                style={{
                                    marginLeft: "15%",
                                    animation: "smoothFloat 5s ease-in-out infinite",
                                }}
                            />
                        </div>
                    </div>
                )}

                {hasClickedAvatar && hasGreeted && currentFlowState !== 'game' && (
                    <div className="absolute bottom-20 right-20 z-20">
                        <button
                            onClick={() => handleSwitchToGameView()}
                            className="bg-red-500 text-white w-20 h-20 rounded-full shadow-xl font-medium text-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                            title="Start game"
                        >
                            ▶
                        </button>
                    </div>
                )}
            </div>


        </div>
    )
}

export default MainView