import classValueMerge from './classValueMerge';

module.exports = function ({ types }) {
  let exists = false;

  return {
    visitor: {
      Program(path) {
        exists = false;

        path.traverse({
          JSXAttribute(attrPath) {
            if (exists) {
              return;
            }
            const attribute = attrPath.node;
            /**
             * 该文件是否存在styleName
             */
            if (typeof attribute.name !== 'undefined' && attribute.name.name === 'styleName') {
              exists = true;

              const styleModuleImportMap = path.node.body.filter(node => {
                return (
                  types.isImportDeclaration(node) && /\.(css|less|scss)$/.test(node.source.value)
                );
              });

              if (styleModuleImportMap.length === 0) {
                throw new Error(
                  "Cannot use styleName attribute for style name '" +
                    attribute.value.value +
                    "' without importing at least one stylesheet.",
                );
              }
              if (styleModuleImportMap.length > 1) {
                throw new Error(
                  "Cannot use anonymous style name '" +
                    attribute.value.value +
                    "' with more than one stylesheet import.",
                );
              }

              styleModuleImportMap.forEach(node => {
                if (node.specifiers.length) {
                  return;
                }
                node.specifiers.push(types.importDefaultSpecifier(types.identifier('styles')));
              });
            }
          },
        });
      },
      JSXElement(path) {
        /**
         * 当前文件没有出现styleName
         */
        if (!exists) {
          return;
        }

        /**
         * 获取element上的styleName和className属性
         */
        let styleNameAttribute = null;
        let classNameAttribute = null;
        path.node.openingElement.attributes.forEach(attribute => {
          if (typeof attribute.name === 'undefined' || !attribute.value || typeof attribute.value.value !== 'string') {
            return;
          }
          if (attribute.name.name === 'styleName') {
            styleNameAttribute = attribute;
          }
          if (attribute.name.name === 'className') {
            classNameAttribute = attribute;
          }
        });

        if (!styleNameAttribute) {
          return;
        }

        let classNameValue = '';
        if (classNameAttribute) {
          /**
           * 存在className,存储该值并将className属性删除
           */
          classNameValue = ' ' + classNameAttribute.value.value;
          path.node.openingElement.attributes = path.node.openingElement.attributes.filter(
            attribute => {
              return attribute.name.name !== 'className';
            },
          );
        }
        /**
         * 将styleName转为className
         */
        const styleNameValue = styleNameAttribute.value.value.split(' ');
        styleNameAttribute.name.name = 'className';
        styleNameAttribute.value = classValueMerge(styleNameValue, classNameValue);
      },
    },
  };
};
