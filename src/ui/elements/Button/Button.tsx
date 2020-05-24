import * as React from 'react';
import { ButtonProps } from './Button.d';

import classNames from 'classnames';
import styles from './Button.module.scss';

const Button = ({
  text,
  type = 'button',
  themes = ['blue'],
  ariaLabel,
  mix,
  children,
  externalStyles,
  ...rest
}: ButtonProps): JSX.Element => {
  return (
    <button
      type={type}
      className={classNames(
        styles.root,
        themes.reduce(
          (classes: string, theme: string) => (classes += `${styles[`theme-${theme}`]} `),
          ' '
        ),
        externalStyles && externalStyles.root,
        'js-focus-visible',
        mix
      )}
      aria-label={ariaLabel}
      {...rest}
    >
      {text || children}
    </button>
  );
};

export default Button;
