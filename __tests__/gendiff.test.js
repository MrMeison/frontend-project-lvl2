import fs from 'fs';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('gendiff', () => {
  let filePath1;
  let filePath2;

  beforeAll(() => {
    filePath1 = getFixturePath('complexFile1.json');
    filePath2 = getFixturePath('complexFile2.json');
  });

  test('stylish', () => {
    const result = genDiff(filePath1, filePath2, 'stylish');
    const out = readFile('complexFileOutStylish.txt');
    expect(result.trim()).toBe(out);
  });

  test('plain', () => {
    const result = genDiff(filePath1, filePath2, 'plain');
    const out = readFile('complexFileOutPlain.txt');
    expect(result.trim()).toBe(out);
  });

  test('json', () => {
    const result = JSON.parse(genDiff(filePath1, filePath2, 'json'));
    const out = JSON.parse(readFile('complexFileOut.json'));
    expect(result).toEqual(out);
  });
});
