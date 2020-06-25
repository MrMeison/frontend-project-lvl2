import fs from 'fs';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('Форматирование вывода', () => {
  test('stylish', () => {
    const result = genDiff(getFixturePath('complexFile1.json'), getFixturePath('complexFile2.json'), 'stylish');
    const out = readFile('complexFileOutStylish.txt');
    expect(result.trim()).toBe(out);
  });

  test('plain', () => {
    const result = genDiff(getFixturePath('complexFile1.json'), getFixturePath('complexFile2.json'), 'plain');
    const out = readFile('complexFileOutPlain.txt');
    expect(result.trim()).toBe(out);
  });

  test('json', () => {
    const out = [
      {
        value: 'Petya',
        key: 'name',
        type: 'changed',
        newValue: 'Vasya',

      },
      {
        value: 'Petrov',
        key: 'surname',
        type: 'not modified',
      },
      {
        value: 16,
        key: 'age',
        type: 'changed',
        newValue: 26,
      },
      {
        value: 'male',
        key: 'sex',
        type: 'not modified',
      },
      {
        value: 'married',
        key: 'status',
        type: 'added',
      },
    ];

    const result = genDiff(getFixturePath('simpleFile1.json'), getFixturePath('simpleFile2.json'), 'json');
    expect(result).toEqual(out);
  });
});
