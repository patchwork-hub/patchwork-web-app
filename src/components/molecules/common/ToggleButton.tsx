import React, { useState } from "react";

type ToggleProps = {
  initialState?: boolean;
  state?: boolean;
  onToggle?: (state: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  initialState = false,
  state,
  onToggle,
}) => {
  const [isActive, setIsActive] = useState(initialState);
  const isControlled = state !== undefined;
  const currentState = isControlled ? state : isActive;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !currentState;
    if (!isControlled) {
      setIsActive(newState);
    }
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-full max-w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
        currentState ? "bg-orange-500" : "bg-gray-300"
      }`}
      aria-pressed={currentState}
      type="button"
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-[#fff] rounded-full transition-transform duration-300 ease-in-out ${
          currentState ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default Toggle;
