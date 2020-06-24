import path from 'path';
import fs from 'fs';
import lodash from 'lodash';

const { has, union } = lodash;

const NOT_MODIFIED = 'not modified';
const ADDED = 'added';
const DELETED = 'deleted';

const createMeta = (key, value, type) => ({
  value,
  key,
  type,
});

const getNotModifiedMeta = (key, value) => createMeta(key, value, NOT_MODIFIED);

const getAddedMeta = (key, value) => createMeta(key, value, ADDED);

const getDeletedMeta = (key, value) => createMeta(key, value, DELETED);

const comparer = (obj1, obj2) => {
  const result = [];

  const allKeys = union(Object.keys(obj1), Object.keys(obj2));

  for (let i = 0; i < allKeys.length; i += 1) {
    const key = allKeys[i];
    if (has(obj1, key) && has(obj2, key)) {
      if (obj1[key] === obj2[key]) {
        result.push(getNotModifiedMeta(key, obj1[key]));
      } else {
        result.push(
          getDeletedMeta(key, obj1[key]),
          getAddedMeta(key, obj2[key]),
        );
      }
    } else if (!has(obj1, key)) {
      result.push(getAddedMeta(key, obj2[key]));
    } else {
      result.push(getDeletedMeta(key, obj1[key]));
    }
  }

  return result;
};

const prettyFormatter = (meta) => {
  const lines = meta.map((node) => {
    switch (node.type) {
      case ADDED:
        return `\t+ ${node.key}: ${node.value}`;
      case DELETED:
        return `\t- ${node.key}: ${node.value}`;
      default:
        return `\t  ${node.key}: ${node.value}`;
    }
  });
  return `
  {
    ${lines.join('\n')}
  }
  `;
};

const gendiff = (pathToFile1, pathToFile2) => {
  const fileContent1 = JSON.parse(fs.readFileSync(path.resolve(pathToFile1)));
  const fileContent2 = JSON.parse(fs.readFileSync(path.resolve(pathToFile2)));

  return prettyFormatter(comparer(fileContent1, fileContent2));
};

export default gendiff;
