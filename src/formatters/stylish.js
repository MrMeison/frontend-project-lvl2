import lodash from 'lodash';
import types from '../types.js';

const { isObject } = lodash;

const TAB = '\t';
const CHANGE_SEPARATORS = {
  added: ' + ',
  deleted: ' - ',
  notModified: '   ',
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
  const lines = [];

  for (let i = 0; i < meta.length; i += 1) {
    const node = meta[i];

    switch (node.type) {
      case types.added:
        lines.push(formatLine(node.key, node.value, CHANGE_SEPARATORS.added, depth));
        break;
      case types.deleted:
        lines.push(formatLine(node.key, node.value, CHANGE_SEPARATORS.deleted, depth));
        break;
      case types.changed:
        lines.push(formatLine(node.key, node.value, CHANGE_SEPARATORS.deleted, depth));
        lines.push(formatLine(node.key, node.newValue, CHANGE_SEPARATORS.added, depth));
        break;
      default:
        lines.push(
          node.children === undefined
            ? formatLine(node.key, node.value, CHANGE_SEPARATORS.notModified, depth)
            : `${TAB.repeat(depth)}${CHANGE_SEPARATORS.notModified}${node.key}: ${stylishFormatter(node.children, depth + 1)}`,
        );
    }
  }
  return `{\n${lines.join('\n')}\n${TAB.repeat(depth - 1)}${CHANGE_SEPARATORS.notModified.repeat(depth - 1 ? 1 : 0)}}`;
};

export default stylishFormatter;
