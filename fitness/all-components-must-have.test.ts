import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const atomsPath = 'packages/components/src/Atoms';
const excluded = ['Box'];
const requiredSuffixes = ['.style.ts', '.stories.tsx', '.test.tsx'];

describe('fitness: every Atoms component must have style, stories and test files', () => {
  it(`has ${requiredSuffixes.join(', ')} for every component folder except ${excluded.join(', ')}`, () => {
    const componentDirs = fs
      .readdirSync(atomsPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !excluded.includes(entry.name));

    const violations: string[] = [];

    for (const dir of componentDirs) {
      const componentPath = path.join(atomsPath, dir.name);
      const files = fs.readdirSync(componentPath);

      for (const suffix of requiredSuffixes) {
        const expectedFile = `${dir.name}${suffix}`;

        if (!files.includes(expectedFile)) {
          violations.push(`${componentPath} is missing ${expectedFile}`);
        }
      }
    }

    expect(
      violations,
      `Found ${violations.length} violation(s):\n${violations.join('\n')}`,
    ).toHaveLength(0);
  });
});
