import lodash from 'lodash';
import types from '../types.js';

const { isObject } = lodash;

const TAB = '  ';
const CHANGE_SEPARATORS = {
  added: '+ ',
  deleted: '- ',
  notModified: '  ',
};

const formatLine = (key, value, separator, depth) => {
  if (!isObject(value)) {
    return `${TAB.repeat(depth)}${separator}${key}: ${value}`;
  }

  const keys = Object.keys(value);
  const lines = keys.map(
    (objKey) => formatLine(objKey, value[objKey], CHANGE_SEPARATORS.notModified, depth + 1),
  );

  return `${TAB.repeat(depth)}${separator}${key}: {\n${lines.join('\n')}\n${TAB.repeat(depth)}${CHANGE_SEPARATORS.notModified}}`;
};

const stylishFormatter = (meta, depth = 1) => {
  const lines = meta.flatMap((node) => {
    switch (node.type) {
      case types.added:
        return formatLine(node.key, node.value, CHANGE_SEPARATORS.added, depth);
      case types.deleted:
        return formatLine(node.key, node.value, CHANGE_SEPARATORS.deleted, depth);
      case types.changed:
        return [
          formatLine(node.key, node.value, CHANGE_SEPARATORS.deleted, depth),
          formatLine(node.key, node.newValue, CHANGE_SEPARATORS.added, depth),
        ];
      default:
        return node.children === undefined
          ? formatLine(node.key, node.value, CHANGE_SEPARATORS.notModified, depth)
          : `${TAB.repeat(depth)}${CHANGE_SEPARATORS.notModified}${node.key}: ${stylishFormatter(node.children, depth + 1)}`;
    }
  });

  return `{\n${lines.join('\n')}\n${TAB.repeat(depth - 1)}${TAB.repeat(depth - 1 ? 1 : 0)}}`;
};

export default stylishFormatter;
