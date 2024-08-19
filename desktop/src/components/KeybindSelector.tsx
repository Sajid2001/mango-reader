import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeKeybind } from "../reduxStorage/settingsSlice";

interface KeybindSelectorProps {
  keybindToChange: string;
  onClose: () => void;
}

const KeybindSelector = ({
  keybindToChange,
  onClose,
}: KeybindSelectorProps) => {
  const [keybind, setKeybind] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = (event: any) => {
    console.log("event");
    event.preventDefault();
    const { key, ctrlKey, shiftKey, altKey, metaKey } = event;
    const keys = [
      ctrlKey && "Ctrl",
      shiftKey && "Shift",
      altKey && "Alt",
      metaKey && "Meta",
      key !== "Control" &&
        key !== "Shift" &&
        key !== "Alt" &&
        key !== "Meta" &&
        key,
    ]
      .filter(Boolean)
      .join("+");

    setKeybind(keys);
  };

  const approveKeybind = () => {
    dispatch(changeKeybind({ key: keybind, map: keybindToChange }));
    onClose();
  };

  return (
    <div className="absolute h-screen w-screen bg-accent-30 top-0 left-0 ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary pt-4 px-4 pb-2 rounded-lg min-w-44">
        <div className="p-4 bg-primary font-bold rounded-xl text-center">
          {keybind || "Press any key"}
        </div>

        <div className="flex justify-around mt-2">
          <button
            onClick={() => onClose()}
            className="text-2xl bg-primary rounded-3xl p-1"
            data-testid="close-button"
          >
            <IconX size={18} />
          </button>

          <button
            onClick={() => approveKeybind()}
            className="text-2xl bg-primary rounded-3xl p-1 disabled:opacity-30"
            disabled={!keybind}
            data-testid="approve-button"
          >
            <IconCheck size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeybindSelector;
