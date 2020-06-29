import lodash from 'lodash';
import types from '../types.js';

const { isObject } = lodash;

const formatValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  return String(value);
};

const getChangeMessage = (value, newValue, pathParts) => `Property '${pathParts.join('.')}' was changed from ${formatValue(value)} to ${formatValue(newValue)}`;

const getAddMessage = (value, pathParts) => `Property '${pathParts.join('.')}' was added with value: ${formatValue(value)}`;

const getDeleteMessage = (pathParts) => `Property '${pathParts.join('.')}' was deleted`;

const buildLines = (meta, pathParts = []) => {
  const lines = meta.flatMap((node) => {
    switch (node.type) {
      case types.added:
        return getAddMessage(node.value, [...pathParts, node.key]);
      case types.deleted:
        return getDeleteMessage([...pathParts, node.key]);
      case types.changed:
        return getChangeMessage(node.value, node.newValue, [...pathParts, node.key]);
      default:
        if (node.children !== undefined) {
          return buildLines(node.children, [...pathParts, node.key]);
        }
        return [];
    }
  });
  return lines;
};

const plainFormatter = (diff) => buildLines(diff).join('\n');

export default plainFormatter;
