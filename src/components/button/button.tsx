import React from 'react';
import './button.scss';

type Props = {
  character: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
function Button({ character, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`container ${character == '=' && 'whiteBackGround'}`}
    >
      <span>{character}</span>
    </button>
  );
}

export default Button;
