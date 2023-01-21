import styledModule from './button.module.scss';
import { Link } from "react-router-dom";

const Button = ({children, link, onClickAction, type, styles}) => {
  return (
    <Link
      to={ link ? link : '#' }
      className={` ${styledModule['button']} ${styledModule[type ? type : 'primary']} `}
      onClick={ onClickAction }
      style={ styles }
    >
      { children }
    </Link>
  );
}

export default Button;
