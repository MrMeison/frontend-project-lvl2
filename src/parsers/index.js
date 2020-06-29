import json from './json.js';
import ini from './ini.js';
import yml from './yml.js';

const parse = (content, type) => {
  switch (type) {
    case 'ini':
      return ini(content);
    case 'yml':
      return yml(content);
    default:
      return json(content);
  }
};

export default parse;
