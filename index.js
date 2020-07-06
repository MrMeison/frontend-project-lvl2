import path from 'path';
import fs from 'fs';
import lodash from 'lodash';
import types from './src/types.js';
import parse from './src/parsers/index.js';
import format from './src/formatters/index.js';

const { has, union, isObject } = lodash;

const compare = (obj1, obj2) => {
  const allKeys = union(Object.keys(obj1), Object.keys(obj2));

  const result = allKeys.map((key) => {
    if (!has(obj1, key)) {
      return {
        type: types.added,
        key,
        value: obj2[key],
      };
    }

    if (!has(obj2, key)) {
      return {
        type: types.deleted,
        key,
        value: obj1[key],
      };
    }

    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return {
        type: types.nested,
        key,
        children: compare(obj1[key], obj2[key]),
      };
    }

    if (obj1[key] !== obj2[key]) {
      return {
        type: types.changed,
        key,
        value: obj1[key],
        newValue: obj2[key],
      };
    }

    return {
      type: types.notModified,
      key,
      value: obj1[key],
    };
  });

  return result;
};

const readFile = (pathToFile) => fs.readFileSync(path.resolve(pathToFile), 'utf-8');

const getFileType = (pathToFile) => path.extname(pathToFile).slice(1);

const getParsedData = (pathToFile) => parse(readFile(pathToFile), getFileType(pathToFile));

const gendiff = (pathToFile1, pathToFile2, formatName = 'stylish') => {
  const diff = compare(getParsedData(pathToFile1), getParsedData(pathToFile2));

  return format(diff, formatName);
};

export default gendiff;
