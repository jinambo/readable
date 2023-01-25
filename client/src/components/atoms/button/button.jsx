import styledModule from './button.module.scss';
import { Link } from "react-router-dom";

const Button = ({children, link, onClickAction, type, styles, disabled}) => {
  if (link) return (
    <Link
      to={ link }
      className={` ${styledModule['button']} ${styledModule[type ? type : 'primary']} `}
      onClick={ onClickAction }
      style={ styles }
    >
      { children }
    </Link>
  );

  if (!link) return (
    <button
      className={` ${styledModule['button']} ${styledModule[type ? type : 'primary']} `}
      onClick={ onClickAction }
      style={ styles }
      disabled={ disabled }
    >
      { children }
    </button>
  )
}

export default Button;
