import fs from 'fs';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('gendiff', () => {
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
    const out = readFile('simpleFileOut.json');

    const result = genDiff(getFixturePath('simpleFile1.json'), getFixturePath('simpleFile2.json'), 'json');
    expect(result).toBe(out);
  });
});
