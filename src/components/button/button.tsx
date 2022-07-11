import React from "react";
import "./button.scss";

type Props = {
  character: string;
  whiteBackGround?: Boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
function Button({ character, whiteBackGround = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`container ${whiteBackGround && "whiteBackGround"}`}
    >
      <span>{character}</span>
    </button>
  );
}

export default Button;
