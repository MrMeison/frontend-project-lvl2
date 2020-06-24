import path from 'path';
import fs from 'fs';
import lodash from 'lodash';
import TYPES from './types.js';
import parsers from './parsers/index.js';

import formatters from './formatters/index.js';

const { has, union, isObject } = lodash;

const createMeta = (key, value, type) => ({
  value,
  key,
  type,
});

const getNotModifiedMeta = (key, value) => createMeta(key, value, TYPES.NOT_MODIFIED);

const getAddedMeta = (key, value) => createMeta(key, value, TYPES.ADDED);

const getDeletedMeta = (key, value) => createMeta(key, value, TYPES.DELETED);

const getChangedMeta = (key, value, newValue) => ({
  ...createMeta(key, value, TYPES.CHANGED),
  newValue,
});

const comparer = (obj1, obj2) => {
  const result = [];

  const allKeys = union(Object.keys(obj1), Object.keys(obj2));

  for (let i = 0; i < allKeys.length; i += 1) {
    const key = allKeys[i];
    if (has(obj1, key) && has(obj2, key)) {
      if (obj1[key] === obj2[key]) {
        result.push(getNotModifiedMeta(key, obj1[key]));
        // если значения это объекты, то рекурсивно проходим вложенные объекты
      } else if (isObject(obj1[key]) && isObject(obj2[key])) {
        result.push({
          ...getNotModifiedMeta(key),
          children: comparer(obj1[key], obj2[key]),
        });
      } else {
        result.push(getChangedMeta(key, obj1[key], obj2[key]));
      }
    } else if (!has(obj1, key)) {
      result.push(getAddedMeta(key, obj2[key]));
    } else {
      result.push(getDeletedMeta(key, obj1[key]));
    }
  }

  return result;
};

const readFile = (pathToFile) => fs.readFileSync(path.resolve(pathToFile), 'utf-8');

const gendiff = (pathToFile1, pathToFile2, format = 'stylish') => {
  const extension = path.extname(pathToFile1);
  const fileContent1 = readFile(pathToFile1);
  const fileContent2 = readFile(pathToFile2);

  let parsedContent1;
  let parsedContent2;

  switch (extension) {
    case '.yml':
      parsedContent1 = parsers.yml(fileContent1);
      parsedContent2 = parsers.yml(fileContent2);
      break;
    case '.ini':
      parsedContent1 = parsers.ini(fileContent1);
      parsedContent2 = parsers.ini(fileContent2);
      break;
    default:
      parsedContent1 = parsers.json(fileContent1);
      parsedContent2 = parsers.json(fileContent2);
  }

  const diffMeta = comparer(parsedContent1, parsedContent2);

  switch (format) {
    case 'json':
      return diffMeta;
    case 'plain':
      return formatters.plain(diffMeta);
    default:
      return formatters.stylish(diffMeta);
  }
};

export default gendiff;
