import { useState, useEffect, useMemo, useCallback } from "react";

interface Bubble {
    id: string;
    letter: string;
    x: number;
    y: number;
    colorClass: string;
    floatDelay: string;
}

function Activity2BContent() {
    const [avatarReady, setAvatarReady] = useState(false);
    const [avatarKey, setAvatarKey] = useState(0);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [hasBubblePopped, setHasBubblePopped] = useState(false);
    const [targetLetter, setTargetLetter] = useState<string>('');
    const [hasStarted, setHasStarted] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [askedLetters, setAskedLetters] = useState<string[]>([]);

    // All letters A-Z plus Swedish letters Å, Ä, Ö
    const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");

    // Handle avatar ready
    const handleAvatarReady = useCallback(() => {
        console.log('✅ Avatar is fully loaded and ready');
        setAvatarReady(true);
    }, []);

    // Listen for game completion event
    useEffect(() => {
        const handleGameComplete = (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('🎉 Letter game completed:', customEvent.detail);

            setTimeout(() => {
                console.log('🔄 Resetting game after completion');
                handleReset();
            }, 5000);
        };

        window.addEventListener('letterGameComplete', handleGameComplete);
        return () => {
            window.removeEventListener('letterGameComplete', handleGameComplete);
        };
    }, []);
    // Generate bubbles with random positions
    const generateBubbles = useCallback((letterToUse?: string) => {
        const currentTarget = letterToUse || targetLetter;

        if (!currentTarget) {
            console.warn('⚠️ No target letter provided to generateBubbles');
            return;
        }

        console.log('🎨 Generating bubbles with target letter:', currentTarget);

        // Pick 6 random letters including target
        const availableLetters = ALL_LETTERS.filter(l => l !== currentTarget);
        const shuffled = [...availableLetters].sort(() => Math.random() - 0.5);
        const randomLetters = shuffled.slice(0, 5);
        const letters = [currentTarget, ...randomLetters].sort(() => Math.random() - 0.5);

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
    }, [targetLetter]);

    // Initialize bubbles
    useEffect(() => {
        if (targetLetter) {
            generateBubbles();
        }
    }, [targetLetter, generateBubbles]);

    // // Handle reset
    // const handleReset = useCallback(() => {
    //     console.log('🔄 Resetting activity');
    //     stopSpeaking();
    //     setAvatarReady(false);
    //     setAvatarKey(prev => prev + 1);
    //     setTargetLetter('');
    //     setHasStarted(false);
    //     setCorrectAnswersCount(0);
    //     setAskedLetters([]);
    //     setBubbles([]);
    //     setHasBubblePopped(false);
    // }, [stopSpeaking]);

    // Handle bubble click - simple game logic
    const handleBubbleClick = useCallback(async (letter: string, bubbleId: string) => {
        console.log('🫧 Bubble clicked:', letter);

        setHasBubblePopped(true);

        // Remove the clicked bubble
        setBubbles(prev => prev.filter(b => b.id !== bubbleId));

        // Check if correct
        const isCorrectAnswer = letter === targetLetter;

        if (isCorrectAnswer) {
            // Correct answer - praise with talking animation
            const praises = [
                "Great job!",
                "Excellent!",
                "Well done!",
                "Perfect!",
                "You found it!"
            ];
            const praise = praises[Math.floor(Math.random() * praises.length)];

            await speak(praise, 'Talking');
            // Increment correct answers
            const newCount = correctAnswersCount + 1;
            setCorrectAnswersCount(newCount);
            console.log('✅ Correct answers:', newCount);

            if (newCount >= 10) {
                // Game complete
                console.log('🎉 Game complete! 10 correct answers');
            } else {
                // Pick next letter
                const availableLetters = ALL_LETTERS.filter(l => !askedLetters.includes(l));
                const nextLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

                console.log('🎯 Next target letter:', nextLetter);
                setTargetLetter(nextLetter);
                setAskedLetters(prev => [...prev, nextLetter]);

                // Generate new bubbles and ask for next letter immediately
                generateBubbles(nextLetter);
                await speak(Now find the letter ${ nextLetter }!, 'Talking');
                setHasBubblePopped(false);
            }
        } else {
            // Wrong answer - encourage with talking animation
            const encouragements = [
                Try again! Look for ${ targetLetter }.,
                    Not quite.Find the letter ${ targetLetter }.,
        Keep looking for ${ targetLetter }!
      ];
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

    await speak(encouragement, 'Talking');

    // Allow retry immediately after speech
    setHasBubblePopped(false);
}
  }, [hasBubblePopped, ttsStatus.isSpeaking, targetLetter, speak, correctAnswersCount, askedLetters, generateBubbles, handleReset]);

// Handle play button click
const handlePlayButtonClick = useCallback(async () => {
    if (!hasStarted && avatarReady && !ttsStatus.isSpeaking) {
        console.log('🎮 Play button clicked - starting letter activity');
        setHasStarted(true);
        setCorrectAnswersCount(0);
        setAskedLetters([]);

        // Pick first random letter
        const firstLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
        setTargetLetter(firstLetter);
        setAskedLetters([firstLetter]);
        console.log('🎯 First target letter:', firstLetter);

        // Wait for bubbles to generate, then speak
        setTimeout(async () => {
            await speak(Hello! Can you find the letter ${ firstLetter } ? Tap on it!, 'Talking');
        }, 500);
    }
}, [hasStarted, avatarReady, ttsStatus.isSpeaking, speak]);

return (
    <div className="flex h-screen bg-[#191919] p-2 gap-2">
        {/* Left Sidebar */}
        <aside className="w-20 bg-linear-to-b from-[#252D2D] to-[#3F4952] rounded-xl flex flex-col items-center py-4 justify-between">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center p-2">
                    <img src="/logo.png" alt="eMi Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            <div className="flex-1" />

            <div>
                <button
                    onClick={handleReset}
                    className="w-11 h-11 rounded-lg bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
                    title="Reset activity"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                    </svg>
                </button>
            </div>
        </aside>

        {/* Left Card - Bubbles Activity */}
        <div className="flex-1 bg-white rounded-xl border border-black/10 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
                style={{ backgroundImage: 'url(/background.jpg)' }}
            />{/* Bubble Stage */}
            <div className="absolute inset-0 pointer-events-none">

            </div>
        </div>

        {/* Right Card - Avatar */}
        <div className="w-[400px] bg-white rounded-xl border border-black/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/background.jpg)' }} />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full">
                    <AnimatedAvatar
                        key={avatarKey}
                        className="w-full h-full"
                        isAgentSpeaking={ttsStatus.isSpeaking}
                        externalMorphTargets={stableMorphTargets}
                        externalAnimation={currentAnimation  undefined}
                    onAnimationsReady={handleAvatarReady}
                    disableListenAnimation={true}
            />
                </div>
            </div>

            {/* Loading indicator */}
            {!avatarReady && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-xl z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">Loading avatar...</p>
                    </div>
                </div>
            )}

            {/* Play button */}
            {avatarReady && !hasStarted && (
                <div className="absolute bottom-20 right-20 z-20">
                    <button
                        onClick={handlePlayButtonClick}
                        className="bg-red-500 text-white w-20 h-20 rounded-full shadow-xl font-medium text-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                        title="Start activity"
                    >
                        ▶️
                    </button>
                </div>
            )}

            {/* Error display */}
            {ttsStatus.error && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl shadow-xl max-w-md text-center z-20">
                    <p className="text-sm font-medium">{ttsStatus.error}</p>
                </div>
            )}
        </div>
    </div >
);
}

export default function Activity2B() {
    return (
        <ChatProvider>
            <Activity2BContent />
        </ChatProvider>
    );
}