import { QUESTIONS } from '@/lib/client/questions';
import { PauseIcon, PlayIcon } from 'lucide-react';
import type { FlowState } from '@/hooks/useGameFlow';
import type { RoomType } from '@/components/Rooms/GameContext';

type MainSidebarProps = {
    currentFlowState: FlowState;
    currentRoom: string;
    conversationPaused: boolean;
    bgMuted: boolean;
    onSwitchRoom: (room: RoomType) => Promise<void>;
    onTogglePause: () => void;
    onToggleMute: () => void;
    onReset: () => void;
};

export default function MainSidebar({
    currentFlowState,
    currentRoom,
    conversationPaused,
    bgMuted,
    onSwitchRoom,
    onTogglePause,
    onToggleMute,
    onReset,
}: MainSidebarProps) {
    return (
        <aside className="w-20 bg-linear-to-b from-[#252D2D] to-[#3F4952] rounded-xl flex flex-col items-center py-4 justify-between">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center p-2">
                    <img
                        src="./assets/logo.png"
                        alt="eMi Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {currentFlowState === 'game' && (
                <div className="flex flex-col gap-6">
                    {Object.keys(QUESTIONS).map((room, i) => (
                        <button
                            key={i + 1}
                            onClick={() => onSwitchRoom(room as RoomType)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                                currentRoom === room
                                    ? 'border-2 border-[#F8CB16] text-white'
                                    : 'text-white/30 hover:text-white/50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <button
                    className="w-11 h-11 rounded-lg bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors text-white"
                    title="Mute/Unmute background music"
                    onClick={onToggleMute}
                >
                    {bgMuted ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <line x1="23" y1="9" x2="17" y2="15"></line>
                            <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                    )}
                </button>
                {currentFlowState === 'game' && (
                    <button
                        className="w-11 h-11 rounded-lg bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors text-white"
                        title="Pause/Play conversation"
                        onClick={onTogglePause}
                    >
                        {conversationPaused ? <PlayIcon /> : <PauseIcon />}
                    </button>
                )}
                <button
                    onClick={onReset}
                    className="w-11 h-11 rounded-lg bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors text-white"
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
    );
}
