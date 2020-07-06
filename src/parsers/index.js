import ini from 'ini';
import yaml from 'js-yaml';

const mapParsers = {
  ini: ini.parse,
  yml: yaml.safeLoad,
  json: JSON.parse,
};

const parse = (content, type) => mapParsers[type](content);

export default parse;
