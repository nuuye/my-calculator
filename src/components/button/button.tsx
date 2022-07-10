import React from "react";
import "./button.scss";

type Props = {
  character: string;
  whiteBackGround?: Boolean;
};
function Button({ character, whiteBackGround = false }: Props) {
  return (
    <div className={`container ${whiteBackGround && "whiteBackGround"}`}>
      <span>{character}</span>
    </div>
  );
}

export default Button;
