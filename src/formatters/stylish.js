import lodash from 'lodash';
import TYPES from '../types.js';

const { isObject } = lodash;

const TAB = '\t';
const CHANGE_SEPARATORS = {
  ADDED: ' + ',
  DELETED: ' - ',
  NOT_MODIFIED: '   ',
};

const formatLine = (key, value, separator, depth) => {
  if (!isObject(value)) {
    return `${TAB.repeat(depth)}${separator}${key}: ${value}`;
  }

  const keys = Object.keys(value);
  const lines = keys.map(
    (objKey) => formatLine(objKey, value[objKey], CHANGE_SEPARATORS.NOT_MODIFIED, depth + 1),
  );

  return `${TAB.repeat(depth)}${separator}${key}: {\n${lines.join('\n')}\n${TAB.repeat(depth)}${CHANGE_SEPARATORS.NOT_MODIFIED}}`;
};

const stylishFormatter = (meta, depth = 1) => {
  const lines = [];

  for (let i = 0; i < meta.length; i += 1) {
    const node = meta[i];

    switch (node.type) {
      case TYPES.ADDED:
        lines.push(formatLine(node.key, node.value, CHANGE_SEPARATORS.ADDED, depth));
        break;
      case TYPES.DELETED:
        lines.push(formatLine(node.key, node.value, CHANGE_SEPARATORS.DELETED, depth));
        break;
      case TYPES.CHANGED:
        lines.push(formatLine(node.key, node.value, CHANGE_SEPARATORS.DELETED, depth));
        lines.push(formatLine(node.key, node.newValue, CHANGE_SEPARATORS.ADDED, depth));
        break;
      default:
        lines.push(
          node.children === undefined
            ? formatLine(node.key, node.value, CHANGE_SEPARATORS.NOT_MODIFIED, depth)
            : `${TAB.repeat(depth)}${CHANGE_SEPARATORS.NOT_MODIFIED}${node.key}: ${stylishFormatter(node.children, depth + 1)}`,
        );
    }
  }
  return `{\n${lines.join('\n')}\n${TAB.repeat(depth - 1)}${CHANGE_SEPARATORS.NOT_MODIFIED.repeat(depth - 1 ? 1 : 0)}}`;
};

export default stylishFormatter;
