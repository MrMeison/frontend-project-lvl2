// @ts-check
import pkg from 'commander';
import genDiff from './src/gendiff.js';

const { Command } = pkg;

const program = new Command();
program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.');
program
  .option('-f, --format [type]', 'output format');

program
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    console.log(genDiff(filepath1, filepath2));
  });

export const cli = program;

export default genDiff;
