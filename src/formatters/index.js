import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

const format = (diff, type) => {
  switch (type) {
    case 'json':
      return JSON.stringify(diff, null, 2);
    case 'plain':
      return plainFormatter(diff);
    default:
      return stylishFormatter(diff);
  }
};

export default format;
