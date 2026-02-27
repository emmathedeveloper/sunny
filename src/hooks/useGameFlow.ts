import { useCallback, useState } from 'react';
import { QUESTIONS, type QuestionType } from '@/lib/client/questions';
import { phraseExists, PRAISE_MESSAGES, userAgreed } from '@/lib/client/utils';
import { useGameContext, type RoomType } from '@/components/Rooms/GameContext';
import { useAvatarContext } from '@/components/AnimatedAvatar/AvatarContext';

export type FlowState = 'welcome' | 'game' | 'goodbye';

type SpeakOptions = {
    onStart?: () => void;
    onEnd?: () => void;
};

export type UseGameFlowParams = {
    speak: (id: string, options?: SpeakOptions) => Promise<void> | void;
    sendMessage: (msg: { type: string; payload?: unknown }) => void;
    playWin: () => void;
    playLose: () => void;
    onResetWelcome?: () => void;
};

export function useGameFlow({
    speak,
    sendMessage,
    playWin,
    playLose,
    onResetWelcome,
}: UseGameFlowParams) {
    const [currentFlowState, setCurrentFlowState] = useState<FlowState>('welcome');
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [hasClickedAvatar, setHasClickedAvatar] = useState(false);

    const { setCurrentAnimation } = useAvatarContext()

    const {
        currentQuestion,
        resetForNextRoom,
        getNextQuestion,
        readyForNewRoom,
        currentRoom,
        conversationPaused,
        setConversationPaused,
        correctStreak,
        setCorrectStreak,
        setCurrentRoom,
        QUESTIONS_PER_ROOM,
        setCorrectCount,
        correctCount,
        difficulty,
        setFailureStreak,
        setReadyForNewRoom,
        questionFailureCount,
        setQuestionFailureCount
    } = useGameContext()

    const handleWelcomeFlow = async (transcript: string) => {

        if (userAgreed(transcript)) {

            handleSwitchToGameView()

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

        const rooms = Object.keys(QUESTIONS)

        const isLastRoom = rooms.at(-1) == currentRoom

        const isLastQuestion = correctCount >= QUESTIONS_PER_ROOM - 1

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
        if (currentQuestion && currentQuestion.answers.some(answer => phraseExists(transcript, answer))) {

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

            if (correctStreak >= 1) {

                let transitionMessage = ''

                switch (difficulty) {
                    case "easy":
                        transitionMessage = "easy-to-medium"
                        break;
                    case "medium":
                        transitionMessage = "medium-to-hard"
                        break;
                    default:
                        transitionMessage = "easy-to-medium"
                        break;
                }

                await speak(`praise-${Math.floor(Math.random() * PRAISE_MESSAGES.length)}`, {
                    onStart() {
                        setCurrentAnimation('thumbs_up')
                        playWin()
                        setAwaitingResponse(false)
                        setCorrectCount(p => p + 1)
                        setCorrectStreak(0)
                        setQuestionFailureCount(0)
                    },
                    onEnd() {
                        setTimeout(() => {
                            speak(`game-difficulty-transition-${transitionMessage}`, {
                                onStart() {
                                    setCurrentAnimation('talking')
                                    setCorrectStreak(0)
                                },
                                onEnd() {
                                    setCurrentAnimation('idle')
                                    askNextQuestion()
                                }
                            })
                        }, 2000)
                    }
                })
            } else {
                await speak(`praise-${Math.floor(Math.random() * PRAISE_MESSAGES.length)}`, {
                    onStart() {
                        setCurrentAnimation('thumbs_up')
                        playWin()
                        setAwaitingResponse(false)
                        setCorrectCount(p => p + 1)
                        setCorrectStreak(p => p + 1)
                        setQuestionFailureCount(0)
                    },
                    onEnd() {
                        setTimeout(() => {
                            setCurrentAnimation('idle')
                            askNextQuestion()
                        }, 2000)
                    }
                })
            }


        } else {
            if (currentQuestion) {

                //If a question has been failed two or more times, change the question
                if (questionFailureCount >= 2) {

                    let transitionMessage = ''

                    switch (difficulty) {
                        case "medium":
                            transitionMessage = "medium-to-easy"
                            break;
                        case "hard":
                            transitionMessage = "hard-to-medium"
                            break;
                        default:
                            transitionMessage = "medium-to-easy"
                            break;
                    }

                    //Let the child know they answered wrong and that we will move to the next question
                    await speak(`game-wrong-answer`, {
                        onStart() {
                            setAwaitingResponse(false)
                            setCurrentAnimation('sad_idle')
                            playLose()
                        },
                    })

                    await speak(`game-difficulty-transition-${transitionMessage}`, {
                        onStart() {
                            setCurrentAnimation('talking')
                            setQuestionFailureCount(0)
                            //Increment the failure streak
                            setFailureStreak(p => p + 1)
                        },
                        onEnd() {
                            askNextQuestion()
                        }
                    })


                } else if (questionFailureCount >= 1) {
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


    }, [currentRoom, currentQuestion, currentRoom, readyForNewRoom, questionFailureCount, speak, playWin, playLose, setCurrentAnimation, setAwaitingResponse, setReadyForNewRoom, setQuestionFailureCount])

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

    const switchRoom = async (room: RoomType) => {

        if (conversationPaused) return

        resetForNextRoom();

        const currentQuestion = getNextQuestion(room, []);

        if (currentQuestion) {

            await speak(`${room}-intro`, {
                onStart() {
                    setCurrentAnimation('talking')
                    setCurrentFlowState('game')
                    setCurrentRoom(room)
                    setReadyForNewRoom(false)
                    setQuestionFailureCount(0)
                }
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

        resetForNextRoom()

        const room = currentRoom

        const currentQuestion = getNextQuestion(room, []);

        if (currentQuestion) {

            await speak(`${room}-intro`, {
                onStart() {
                    setCurrentAnimation('talking')
                    setConversationPaused(false)
                    setCurrentRoom(room)
                    setQuestionFailureCount(0)
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
        setCurrentAnimation('idle')
        setQuestionFailureCount(0)
        resetForNextRoom()
    }

    const resetActivity = useCallback(() => {
        if (currentFlowState === 'game') {
            resetRoom();
        }
        if (currentFlowState === 'welcome') {
            setHasGreeted(false);
            setHasClickedAvatar(false);
            setCurrentAnimation('idle');
            onResetWelcome?.();
        }
    }, [currentFlowState, resetRoom, setCurrentAnimation, onResetWelcome]);

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

        const nextQuestion = getNextQuestion(currentRoom);

        if (!nextQuestion) return;

        await speak(`${currentRoom}-${nextQuestion.id}`, {
            onStart() {
                setCurrentAnimation('talking')
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

    const calculateGameRoomTransition = (room: any) => {

        const roomIndex = Object.keys(QUESTIONS).findIndex(r => r == room)

        return `calc(-${roomIndex * 100}%)`
    }

    return {
        currentFlowState,
        awaitingResponse,
        setAwaitingResponse,
        hasGreeted,
        setHasGreeted,
        hasClickedAvatar,
        setHasClickedAvatar,
        handleWelcomeFlow,
        handleGameFlow,
        handleSwitchToGameView,
        handleActions,
        switchRoom,
        resetRoom,
        reset,
        resetActivity,
        askNextQuestion,
        calculateGameRoomTransition,
    };
}
