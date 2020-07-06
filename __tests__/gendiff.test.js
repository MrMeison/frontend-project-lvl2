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
    const result = genDiff(getFixturePath('complexFile1.json'), getFixturePath('complexFile2.yml'), 'plain');
    const out = readFile('complexFileOutPlain.txt');
    expect(result.trim()).toBe(out);
  });

  test('json', () => {
    const result = JSON.parse(genDiff(getFixturePath('complexFile1.json'), getFixturePath('complexFile2.ini'), 'json'));
    const out = JSON.parse(readFile('complexFileOut.json'));
    expect(result).toEqual(out);
  });
});
