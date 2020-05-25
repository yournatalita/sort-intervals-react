import React from 'react';
import classNames from 'classnames';

import { InputProps } from './Input.d';

import styles from './Input.module.scss';

const Input = ({ label, value, onChange, errorText, ...rest }: InputProps): JSX.Element => {
  return (
    <label className={classNames(styles.root)}>
      <div className={classNames(styles.inputWrapper)}>
        <span className={styles.label}>{label}</span>
        <input className={styles.input} value={value} onChange={onChange} {...rest} />
      </div>
      {errorText && <span className={classNames(styles.error, 't-error')}>{errorText}</span>}
    </label>
  );
};

export default Input;
