import useAgentSpeechState from '@/hooks/useAgentSpeechState';
import React, { useCallback, useEffect, useState } from 'react'
import { useGameContext } from './GameContext';

interface Bubble {
    id: string;
    letter: string;
    x: number;
    y: number;
    colorClass: string;
    floatDelay: string;
}

type LetterRoomProps = {
    onLetterClicked: (letter: string) => void
}

const LetterRoom = ({ onLetterClicked } : LetterRoomProps) => {

    const { questions , currentRoom ,currentQuestionIndex } = useGameContext()

    const { speak , agentIsSpeaking } = useAgentSpeechState()

    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [hasBubblePopped, setHasBubblePopped] = useState(false);
    const [targetLetter, setTargetLetter] = useState<string>('');
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [askedLetters, setAskedLetters] = useState<string[]>([]);

    // All letters A-Z plus Swedish letters Å, Ä, Ö
    const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");

    const generateBubbles = useCallback((letterToUse?: string) => {
        const currentTarget = letterToUse;

        // console.log("Target: " , currentTarget , questions)

        if (!currentTarget) {
            console.warn('⚠️ No target letter provided to generateBubbles');
            return;
        }

        console.log('🎨 Generating bubbles with target letter:', currentTarget);

        // Pick 6 random letters including target
        const availableLetters = ALL_LETTERS.filter(l => l !== currentTarget);
        const shuffled = [...availableLetters].sort(() => Math.random() - 0.5);
        const randomLetters = shuffled.slice(0, 5);
        const letters = [currentTarget , ...randomLetters].sort(() => Math.random() - 0.5)

        console.log("Letters: " , letters)

        const colorClasses = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-orange-500", "text-purple-500"];
        const floatDelays = ["", "delay-1", "delay-2", "delay-3", "delay-4", "delay-5"];
        const bubbleSize = 160;
        const padding = 32;
        const placedBubbles: { x: number; y: number }[] = [];

        const checkOverlap = (x: number, y: number) => {
            const radius = bubbleSize / 2;
            const centerX = x + radius;
            const centerY = y + radius;

            for (const placed of placedBubbles) {
                const placedCenterX = placed.x + radius;
                const placedCenterY = placed.y + radius;
                const dx = centerX - placedCenterX;
                const dy = centerY - placedCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < bubbleSize) {
                    return true;
                }
            }
            return false;
        };

        const getRandomPosition = (stageWidth: number, stageHeight: number) => {
            const maxX = stageWidth - bubbleSize - padding * 2;
            const maxY = stageHeight - bubbleSize - padding * 2;
            let attempts = 0;
            let x, y;

            do {
                x = padding + Math.random() * maxX;
                y = padding + Math.random() * maxY;
                attempts++;
            } while (checkOverlap(x, y) && attempts < 100);

            placedBubbles.push({ x, y });
            return { x, y };
        };

        const stageWidth = window.innerWidth * 0.6;
        const stageHeight = window.innerHeight - 32;

        const newBubbles = letters.map((letter, index) => {
            const position = getRandomPosition(stageWidth, stageHeight);
            return {
                id: `bubble-${index}-${Date.now()}`,
                letter,
                x: position.x,
                y: position.y,
                colorClass: colorClasses[index],
                floatDelay: floatDelays[index]
            };
        });

        setBubbles(newBubbles as any);
        setHasBubblePopped(false);
    }, [currentRoom]);

    const handleBubbleClick = useCallback(async (letter: string, bubbleId: string) => {
        console.log('🫧 Bubble clicked:', letter);

        setHasBubblePopped(true);

        // Remove the clicked bubble
        setBubbles(prev => prev.filter(b => b.id !== bubbleId));

        // Check if correct
        const isCorrectAnswer = letter === targetLetter;

        onLetterClicked(letter)

        if (isCorrectAnswer) {
            // Correct answer - praise with talking animation

            // Increment correct answers
            const newCount = correctAnswersCount + 1;
            setCorrectAnswersCount(newCount);
            console.log('✅ Correct answers:', newCount);

            if (newCount >= questions.length) {
                // Game complete
                console.log('🎉 Game complete! 10 correct answers');
            } else {
                // Pick next letter
                // const availableLetters = ALL_LETTERS.filter(l => !askedLetters.includes(l));
                // const nextLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

                // console.log('🎯 Next target letter:', nextLetter);
                // setTargetLetter(nextLetter as string);
                setAskedLetters(prev => [...prev, letter as string]);

                // Generate new bubbles and ask for next letter immediately
                // generateBubbles(nextLetter);
                setHasBubblePopped(false);
            }
        } else {
            // Wrong answer - encourage with talking animation

            // Allow retry immediately after speech
            if(bubbles.length < 3) generateBubbles(targetLetter)
        }
        setHasBubblePopped(false);
    }, [hasBubblePopped, correctAnswersCount, askedLetters, generateBubbles , onLetterClicked , bubbles]);

    useEffect(() => {
        if(currentRoom == 'letter') {
            const target = questions[currentQuestionIndex]?.answers[0]
            setTargetLetter(target as string)
            generateBubbles(target)
        }else{
            setTargetLetter('')
            setAskedLetters([])
            setCorrectAnswersCount(0)
            setBubbles([])
            setHasBubblePopped(false)
        }

    } , [currentRoom , questions , currentQuestionIndex])

    useEffect(() => {
        setHasBubblePopped(agentIsSpeaking)
    } , [agentIsSpeaking])

    if(currentRoom !== 'letter') return 

    return (
        <>
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
                style={{ backgroundImage: 'url(/assets/background.jpg)' }}
            />
            <div className="size-full absolute top-0 z-10">

                {
                    bubbles.map((bubble) => (
                        <div
                            key={bubble.id}
                            className={`absolute w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${hasBubblePopped
                                ? 'pointer-events-none cursor-not-allowed'
                                : 'pointer-events-auto cursor-pointer hover:scale-105 active:scale-95'
                                } bubble-float ${bubble.floatDelay}`}
                            style={{
                                left: `${bubble.x}px`,
                                top: `${bubble.y}px`,
                                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1) 40%, transparent 70%), radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.2), transparent 50%)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                            }}
                            onClick={() => {
                                if (!hasBubblePopped) {
                                    handleBubbleClick(bubble.letter, bubble.id);
                                }
                            }}
                        >
                            <span
                                className={`font-black text-7xl ${bubble.colorClass}`}
                                style={{
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), -1px -1px 2px rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                {bubble.letter}
                            </span>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default LetterRoom