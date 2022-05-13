# babel-plugin-stylename-to-classname

styleName to className, Because babel-plugin-react-css-modules is not maintained, the css name after build does not match the css name of css-loader, so this plug-in is needed to fix this problem.

### Example transpilations

Input:

```js
import './bar.css';

<div className="a"></div>;
```

Output:

```js
import styles from './bar.css';

<div className={styles.a}></div>;
```
