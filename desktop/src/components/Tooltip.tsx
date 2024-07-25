import React, { useState, ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute text-center z-30 top-1/2 left-0 transform -translate-y-1/2 font-bold translate-x-full mr-1 px-2 py-1 bg-background border-2 border-primary text-text text-md rounded-md shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
