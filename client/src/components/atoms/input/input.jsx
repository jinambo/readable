import styleModule from './input.module.scss';

const Input = ({ styles, placeholder, type, accept, name, defaultValue, onChangeAction }) => {
  if (type !== 'textarea') return (
    <input
      name={ name }
      type={ type }
      accept={ accept }
      placeholder={ placeholder }
      className={ styleModule['input'] }
      style={styles}
      defaultValue={ defaultValue }
      onChange={ onChangeAction }
    />
  );

  if (type === 'textarea') return (
    <textarea 
      name={ name }
      placeholder={ placeholder }
      className={ styleModule['input'] }
      style={styles}
      defaultValue={ defaultValue }
      onChange={ onChangeAction }
      cols="10" rows="10"
    ></textarea>
  );
}

export default Input;
