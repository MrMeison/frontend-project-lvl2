import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const format = (diff, type) => {
  switch (type) {
    case 'json':
      return JSON.stringify(diff, null, 2);
    case 'plain':
      return formatPlain(diff);
    default:
      return formatStylish(diff);
  }
};

export default format;
