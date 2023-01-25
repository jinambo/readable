import React from 'react';
import styles from './toggle.module.scss';

const Toggle = ({ name, defaultChecked, onChangeAction }) => {
  return (
    <div className={`${ styles.button } ${ styles.r }`}>
      <input
        name={ name }
        type="checkbox"
        className={ styles.checkbox }
        defaultChecked={ !defaultChecked }
        onChange={ onChangeAction }
      />
      <div className={ styles.knobs }></div>
      <div className={ styles.layer }></div>
    </div>
  );
}

export default Toggle;
