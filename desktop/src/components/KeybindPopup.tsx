import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import KeybindSelector from "./KeybindSelector";

interface KeybindPopupProps {
  closeKeybinds: () => void;
}
const KeybindPopup = ({ closeKeybinds }: KeybindPopupProps) => {
  const leftPageKeybind = useSelector(
    (state: any) => state.userSettings.leftPageKeybind
  );

  const rightPageKeybind = useSelector(
    (state: any) => state.userSettings.rightPageKeybind
  );

  const leftChapterKeybind = useSelector(
    (state: any) => state.userSettings.leftChapterKeybind
  );

  const rightChapterKeybind = useSelector(
    (state: any) => state.userSettings.rightChapterKeybind
  );

  const sidebarKeybind = useSelector(
    (state: any) => state.userSettings.sidebarKeybind
  );

  const exitKeybind = useSelector(
    (state: any) => state.userSettings.exitKeybind
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [keybindToChange, setKeybindToChange] = useState<string>("");
  const [showKeybindPopup, setShowKeybindPopup] = useState<boolean>(false);

  const changeKeybind = (keybind: string) => {
    setKeybindToChange(keybind);
    setShowKeybindPopup(true);
    console.log(keybind);
  };

  return (
    <div
      className={
        "flex flex-col items-center bg-accent-70 fixed z-20 justify-center  top-0 left-0s h-screen w-screen"
      }
    >
      <div className="relative w-98 p-6 rounded-xl bg-primary">
        <button
          data-testid="close-keybinds-button"
          className="absolute top-2 right-2"
          onClick={() => closeKeybinds()}
        >
          <IconX />
        </button>
        <div className="*:w-full *:border-b-2 *:border-primary font-semibold">
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Page Left</p>
            <button
              onClick={() => changeKeybind("leftPageKeybind")}
              className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
            >
              {leftPageKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Page Right</p>
            <button
              onClick={() => changeKeybind("rightPageKeybind")}
              className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
            >
              {rightPageKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Chapter Left</p>
            <button
              onClick={() => changeKeybind("leftChapterKeybind")}
              className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
            >
              {leftChapterKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Chapter Right</p>
            <button
              onClick={() => changeKeybind("rightChapterKeybind")}
              className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
            >
              {rightChapterKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Open Reader Sidebar</p>
            <button
              onClick={() => changeKeybind("sidebarKeybind")}
              className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
            >
              {sidebarKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Go Back</p>
            <button
              onClick={() => changeKeybind("exitKeybind")}
              className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
            >
              {exitKeybind}
            </button>
          </div>
        </div>
      </div>
      {showKeybindPopup && keybindToChange && (
        <KeybindSelector
          onClose={() => {
            setKeybindToChange("");
            setShowKeybindPopup(false);
          }}
          keybindToChange={keybindToChange}
        />
      )}
    </div>
  );
};

export default KeybindPopup;
