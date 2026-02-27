import LetterRoom from '@/components/Rooms/LetterRoom';
import { QUESTIONS } from '@/lib/client/questions';

type GameRoomViewProps = {
    currentRoom: string;
    onLetterClicked: (letter: string) => void;
    calculateGameRoomTransition: (room: string) => string;
};

export default function GameRoomView({
    currentRoom,
    onLetterClicked,
    calculateGameRoomTransition,
}: GameRoomViewProps) {
    return (
        <div className="flex-1 w-full h-full bg-white rounded-xl border border-black/10 overflow-hidden relative scale-in">
            <div
                style={{ transform: `translateX(${calculateGameRoomTransition(currentRoom)})` }}
                className="absolute size-full overflow-visible top-0 left-0 transition-transform"
            >
                {Object.keys(QUESTIONS).map((q, i) => (
                    q !== 'letter' ? (
                        <img
                            key={q}
                            style={{ transform: `translateX(calc(${i * 100}%))` }}
                            className="absolute top-0 size-full object-cover"
                            src={`./assets/${q}.jpg`}
                            alt=""
                        />
                    ) : (
                        <div
                            key={q}
                            style={{ transform: `translateX(calc(${i * 100}%))` }}
                            className="absolute top-0 size-full"
                        >
                            <LetterRoom onLetterClicked={onLetterClicked} />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
