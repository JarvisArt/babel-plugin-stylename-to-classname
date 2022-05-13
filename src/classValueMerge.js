import * as types from '@babel/types';
import template from '@babel/template';

/**
 * 合并styleName与className的value
 */
const classValueMerge = function (styleNameValue, classNameValue) {
  let code = null;
  if (styleNameValue.length === 1) {
    code = "styles['" + styleNameValue[0] + "']" + (classNameValue ? ` + '${classNameValue}'` : '');
  } else {
    code =
      '`' +
      styleNameValue.map(value => "${styles['" + value + "']}").join(' ') +
      classNameValue +
      '`';
  }
  return types.JSXExpressionContainer(template.ast(code).expression);
};

export default classValueMerge;
