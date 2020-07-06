import ini from 'ini';
import lodash from 'lodash';
import yaml from 'js-yaml';

const { mapValues, isObject } = lodash;

const isNumeric = (value) => typeof value === 'string' && !Number.isNaN(Number(value));

const convertValues = (obj) => mapValues(obj, (value) => {
  if (isObject(value)) {
    return convertValues(value);
  }

  if (isNumeric(value)) {
    return Number(value);
  }

  return value;
});

const parseIni = (content) => convertValues(ini.parse(content));

const mapParsers = {
  ini: parseIni,
  yml: yaml.safeLoad,
  json: JSON.parse,
};

const parse = (content, type) => mapParsers[type](content);

export default parse;
