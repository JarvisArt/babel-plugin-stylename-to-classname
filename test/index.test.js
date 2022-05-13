import { join } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { transformFileSync } from '@babel/core';
import plugin from '../src/index';

/**
 * Differences in line breaks:
 * 1.windows - \r\n
 * 2.linux(generate) - \n
 */
const codeFormatting = (code) => {
  return code.trim().replace(/\r\n/g,"\n");
};

describe('index', () => {
  const fixturesDir = join(__dirname, 'fixtures');
  const fixtures = readdirSync(fixturesDir);

  fixtures.map(caseName => {

    const fixtureDir = join(fixturesDir, caseName);
    const inputFile = join(fixtureDir, 'input.js');
    const outputFile = join(fixtureDir, 'output.js');
    const optionsFile = join(fixtureDir, 'options.json');
    
    it(`should work with ${caseName.split('-').join(' ')}`, () => {

      let options = {};

      const transformOptions = {
        babelrc: false,
        plugins: [plugin],
        parserOpts: {
          plugins: ['jsx']
        }
      }
      
      if (existsSync(optionsFile)) {
        options = JSON.parse(readFileSync(optionsFile, 'utf-8'));
      }

      if (options.type === 'throw') {
        expect(() => transformFileSync(inputFile, transformOptions)).toThrow(options.throws);
      } else {
        const input = transformFileSync(inputFile, transformOptions).code;
        const output = readFileSync(outputFile, 'utf-8');
        expect(codeFormatting(input)).toEqual(codeFormatting(output));
      }

    });
  });
});
