import styleModule from './input.module.scss';

const Input = ({ styles, placeholder, type, name, onChangeAction }) => {
  return (
    <input
      name={ name }
      type={ type }
      placeholder={ placeholder }
      className={ styleModule['input'] }
      style={styles}
      onChange={ onChangeAction }
    />
  );
}

export default Input;
