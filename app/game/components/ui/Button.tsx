"use client";

import { memo } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = ({
  label,
  onClick,
  disabled = false,
  style = "primary",
  size = "md",
}: ButtonProps) => {
  return (
    <button
      className="plinkoButton"
      data-size={size}
      data-style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default memo(Button);

