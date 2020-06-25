import fs from 'fs';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('Персеры', () => {
  let out;

  beforeAll(() => {
    out = readFile('simpleFileOut.txt');
  });

  test('json', () => {
    const result = genDiff(getFixturePath('simpleFile1.json'), getFixturePath('simpleFile2.json'));
    expect(result.trim()).toBe(out);
  });

  test('yml', () => {
    const result = genDiff(getFixturePath('simpleFile1.yml'), getFixturePath('simpleFile2.yml'));
    expect(result.trim()).toBe(out);
  });

  test('ini', () => {
    const result = genDiff(getFixturePath('simpleFile1.ini'), getFixturePath('simpleFile2.ini'));
    expect(result.trim()).toBe(out);
  });
});
