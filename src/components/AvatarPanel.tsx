import Avatar from '@/components/AnimatedAvatar/Avatar';
import { cn } from '@/lib/utils';
import type { FlowState } from '@/hooks/useGameFlow';

type AvatarPanelProps = {
    onStart: () => void;
    isLoadingAvatar: boolean;
    hasClickedAvatar: boolean;
    hasGreeted: boolean;
    currentFlowState: FlowState;
    onStartGame: () => void;
};

export default function AvatarPanel({
    onStart,
    isLoadingAvatar,
    hasClickedAvatar,
    hasGreeted,
    currentFlowState,
    onStartGame,
}: AvatarPanelProps) {
    return (
        <div
            onClick={onStart}
            className={cn(
                'rounded-xl border border-black/10 relative overflow-hidden bg-cover bg-center bg-no-repeat h-full',
                currentFlowState !== 'welcome' ? 'w-[30%]' : 'w-full'
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
                                marginLeft: '15%',
                                animation: 'smoothFloat 5s ease-in-out infinite',
                            }}
                        />
                    </div>
                </div>
            )}
            {hasClickedAvatar && hasGreeted && currentFlowState !== 'game' && (
                <div className="absolute bottom-20 right-20 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onStartGame();
                        }}
                        className="bg-red-500 text-white w-20 h-20 rounded-full shadow-xl font-medium text-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                        title="Start game"
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
}
