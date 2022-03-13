import React from 'react';
import styles from './loader.module.scss';

export function Loader() {
  return (
    <div className={styles.loader}>
      <div className={styles.ldsRipple} />
    </div>
  );
}
