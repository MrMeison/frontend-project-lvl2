import path from 'path';
import fs from 'fs';
import lodash from 'lodash';
import types from './src/types.js';
import parse from './src/parsers/index.js';
import format from './src/formatters/index.js';

const { has, union, isObject } = lodash;

const createMeta = (key, value, type) => ({
  value,
  key,
  type,
});

const getNotModifiedMeta = (key, value) => createMeta(key, value, types.notModified);

const getAddedMeta = (key, value) => createMeta(key, value, types.added);

const getDeletedMeta = (key, value) => createMeta(key, value, types.deleted);

const getChangedMeta = (key, value, newValue) => ({
  ...createMeta(key, value, types.changed),
  newValue,
});

const compare = (obj1, obj2) => {
  const allKeys = union(Object.keys(obj1), Object.keys(obj2));

  const result = allKeys.map((key) => {
    if (!has(obj1, key)) {
      return getAddedMeta(key, obj2[key]);
    }

    if (!has(obj2, key)) {
      return getDeletedMeta(key, obj1[key]);
    }

    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return {
        ...getNotModifiedMeta(key),
        children: compare(obj1[key], obj2[key]),
      };
    }

    if (obj1[key] !== obj2[key]) {
      return getChangedMeta(key, obj1[key], obj2[key]);
    }

    return getNotModifiedMeta(key, obj1[key]);
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
