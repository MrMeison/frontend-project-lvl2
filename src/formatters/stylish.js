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

const outputMapping = {
  [types.added]: (node, depth) => `${padding(depth)}  + ${node.key}: ${formatValue(node.value, depth)}`,
  [types.changed]: (node, depth) => [
    `${padding(depth)}  - ${node.key}: ${formatValue(node.value, depth)}`,
    `${padding(depth)}  + ${node.key}: ${formatValue(node.newValue, depth)}`,
  ],
  [types.deleted]: (node, depth) => `${padding(depth)}  - ${node.key}: ${formatValue(node.value, depth)}`,
  [types.nested]: (node, depth, iter) => `${padding(depth)}    ${node.key}: ${iter(node.children, depth + 2)}`,
  [types.notModified]: (node, depth) => `${padding(depth)}    ${node.key}: ${formatValue(node.value, depth)}`,
};

const formatStylish = (diff) => {
  const iter = (children, depth) => {
    const lines = children.flatMap((node) => outputMapping[node.type](node, depth, iter));
    return `{\n${lines.join('\n')}\n${padding(depth)}}`;
  };

  return iter(diff, 0);
};

export default formatStylish;
