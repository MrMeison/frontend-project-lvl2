import lodash from 'lodash';
import types from '../types.js';

const { isObject } = lodash;

const formatValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  return String(value);
};

const outputMapping = {
  [types.added]: (node, pathParts) => `Property '${pathParts.join('.')}' was added with value: ${formatValue(node.value)}`,
  [types.changed]: (node, pathParts) => `Property '${pathParts.join('.')}' was changed from ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`,
  [types.deleted]: (node, pathParts) => `Property '${pathParts.join('.')}' was deleted`,
  [types.nested]: (node, pathParts, iter) => iter(node.children, pathParts),
  [types.notModified]: () => [],
};

const buildLines = (meta, pathParts = []) => meta.flatMap(
  (node) => outputMapping[node.type](node, [...pathParts, node.key], buildLines),
);

const formatPlain = (diff) => buildLines(diff).join('\n');

export default formatPlain;
