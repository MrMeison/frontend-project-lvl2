import lodash from 'lodash';
import TYPES from '../types.js';

const { isObject } = lodash;

const formatValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  return String(value);
};

const getChangeMessage = (key, value, newValue, keyPrefix) => {
  return `Property '${keyPrefix}${key}' was changed from ${formatValue(value)} to ${formatValue(newValue)}`;
};

const getAddMessage = (key, value, keyPrefix) => {
  return `Property '${keyPrefix}${key}' was added with value: ${formatValue(value)}`;
};

const getDeleteMessage = (key, keyPrefix) => {
  return `Property '${keyPrefix}${key}' was deleted`;
};

const buildLines = (meta, keyPrefix = '') => {
  const lines = [];

  for (let i = 0; i < meta.length; i += 1) {
    const node = meta[i];

    switch (node.type) {
      case TYPES.ADDED:
        lines.push(getAddMessage(node.key, node.value, keyPrefix));
        break;
      case TYPES.DELETED:
        lines.push(getDeleteMessage(node.key, keyPrefix));
        break;
      case TYPES.CHANGED:
        lines.push(getChangeMessage(node.key, node.value, node.newValue, keyPrefix));
        break;
      default:
        if (node.children !== undefined) {
          lines.push(...buildLines(node.children, `${node.key}.`));
        }
    }
  }
  return lines;
};

const plainFormatter = (meta) => buildLines(meta).join('\n');

export default plainFormatter;
