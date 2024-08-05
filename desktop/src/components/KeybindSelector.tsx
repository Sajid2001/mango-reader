import { useState } from "react";

const KeybindSelector = (onKeybindSelected: (keybind: string) => void) => {
  const [keybind, setKeybind] = useState("");

  const handleKeyDown = (event: any) => {
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
    onKeybindSelected(keys);
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} className="p-10 cursor-pointer">
      {keybind || "Press any key combination"}
    </div>
  );
};

export default KeybindSelector;
