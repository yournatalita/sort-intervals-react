import React from 'react';
import classNames from 'classnames';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <div className={styles.root}>
      <div className={classNames(styles.container, 'container')}>
        <h1>Merge and Sort Intervals</h1>
        <p className={styles.pre}>Merge overlapping intervals and sort them.</p>
      </div>
    </div>
  );
};

export default Header;
