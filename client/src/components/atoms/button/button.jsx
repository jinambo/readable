import styledModule from './button.module.scss';

const Button = ({children, link, onClickAction, type, styles}) => {
  return (
    <a
      href={ link ? link : '#' }
      className={` ${styledModule['button']} ${styledModule[type ? type : 'primary']} `}
      onClick={ onClickAction }
      style={ styles }
    >
      { children }
    </a>
  );
}

export default Button;
