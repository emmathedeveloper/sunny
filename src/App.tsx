import BearViewer from "./components/AnimatedAvatar/Avatar";
import { AvatarProvider } from "./components/AnimatedAvatar/AvatarContext";
import { GameProvider } from "./components/Rooms/GameContext";
import "./index.css";
import MainView from "./views/MainView";


export function App() {

  return (
    <div className="size-full">
      <AvatarProvider>
        <GameProvider>
          <MainView />
        </GameProvider>
      </AvatarProvider>
    </div>
  );
}

export default App;
