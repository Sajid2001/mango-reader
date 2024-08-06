import { useState } from "react";

const KeybindSelector = ({ onKeybindSelected: (keybind: string) => {}, setShowKeybindPopup: () => {} }) => {
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

    try {
      setKeybind(keys);
      //onKeybindSelected(keys);
    }
    catch (error) {
      console.error(error);
    }
    
  };

  const handleClose = () => {
    //setShowKeybindPopup(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-text bg-opacity-50 flex items-center justify-center`}
    >
      <div className="bg-white p-6 rounded-lg relative">
        <button
          className="absolute top-2 right-2 text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="p-10 cursor-pointer"
        >
          {keybind || "Press any key combination"}
        </div>
      </div>
    </div>
  );
};

export default KeybindSelector;
