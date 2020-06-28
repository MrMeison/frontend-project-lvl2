import lodash from 'lodash';
import types from '../types.js';

const { isObject } = lodash;

const formatValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  return String(value);
};

const getChangeMessage = (key, value, newValue, keyPrefix) => `Property '${keyPrefix}${key}' was changed from ${formatValue(value)} to ${formatValue(newValue)}`;


const getAddMessage = (key, value, keyPrefix) => `Property '${keyPrefix}${key}' was added with value: ${formatValue(value)}`;

const getDeleteMessage = (key, keyPrefix) => `Property '${keyPrefix}${key}' was deleted`;

const buildLines = (meta, keyPrefix = '') => {
  const lines = meta.flatMap((node) => {
    switch (node.type) {
      case types.added:
        return getAddMessage(node.key, node.value, keyPrefix);
      case types.deleted:
        return getDeleteMessage(node.key, keyPrefix);
      case types.changed:
        return getChangeMessage(node.key, node.value, node.newValue, keyPrefix);
      default:
        if (node.children !== undefined) {
          return buildLines(node.children, `${node.key}.`);
        }
        return [];
    }
  });
  return lines;
};

const plainFormatter = (meta) => buildLines(meta).join('\n');

export default plainFormatter;
