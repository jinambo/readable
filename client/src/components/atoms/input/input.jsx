import styleModule from './input.module.scss';

const Input = ({ styles, placeholder, type, onChangeAction }) => {
  return (
    <input
      type={ type }
      placeholder={ placeholder }
      className={ styleModule['input'] }
      style={styles}
      onChange={ onChangeAction }
    />
  );
}

export default Input;
