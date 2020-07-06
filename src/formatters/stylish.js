import lodash from 'lodash';
import types from '../types.js';

const { isObject } = lodash;

const TAB = '  ';

const padding = (depth) => TAB.repeat(depth);

const formatValue = (value, depth) => {
  if (!isObject(value)) {
    return `${value}`;
  }

  const lines = Object.entries(value)
    .map(([key, innerValue]) => `${padding(depth + 2)}    ${key}: ${formatValue(innerValue, depth + 2)}`);

  return `{\n${lines.join('\n')}\n${padding(depth + 2)}}`;
};

const notModifiedMeta = (node, depth) => `${padding(depth)}    ${node.key}: ${formatValue(node.value, depth)}`;
const addedMeta = (node, depth) => `${padding(depth)}  + ${node.key}: ${formatValue(node.value, depth)}`;
const deletedMeta = (node, depth) => `${padding(depth)}  - ${node.key}: ${formatValue(node.value, depth)}`;
const changedMeta = (node, depth) => [
  `${padding(depth)}  - ${node.key}: ${formatValue(node.value, depth)}`,
  `${padding(depth)}  + ${node.key}: ${formatValue(node.newValue, depth)}`,
];

const formatStylish = (diff) => {
  const iter = (children, depth) => {
    const lines = children.flatMap((node) => {
      switch (node.type) {
        case types.added:
          return addedMeta(node, depth);
        case types.deleted:
          return deletedMeta(node, depth);
        case types.changed:
          return changedMeta(node, depth);
        default:
          return node.children === undefined
            ? notModifiedMeta(node, depth)
            : `${padding(depth)}    ${node.key}: ${iter(node.children, depth + 2)}`;
      }
    });

    return `{\n${lines.join('\n')}\n${padding(depth)}}`;
  };

  return iter(diff, 0);
};

export default formatStylish;
