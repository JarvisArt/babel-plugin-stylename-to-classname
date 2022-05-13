import styles from './index.css';
<div className={styles['a'] + ' c'}></div>;
<div className={`${styles['a']} ${styles['b']} c d`}></div>;