#!/usr/bin/env node
import pkg from 'commander';
import genDiff from '../index.js';

const { Command } = pkg;

const program = new Command();
program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    console.log(genDiff(filepath1, filepath2, program.format));
  })
  .parse(process.argv);
