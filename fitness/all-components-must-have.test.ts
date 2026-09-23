import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const uiPath = 'packages/components/src';
const includedFolders = ['/Atoms', '/Layout'];

const excluded = ['Box'];
const requiredSuffixes = ['.style.ts', '.stories.tsx', '.test.tsx'];

describe('fitness: every component must have style, stories and test files', () => {
  it.each(includedFolders)(
    `has ${requiredSuffixes.join(', ')} for every component folder in %s except ${excluded.join(', ')}`,
    (folder) => {
      const folderPath = path.join(uiPath, folder);
      const componentDirs = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !excluded.includes(entry.name));

      const violations: string[] = [];

      for (const dir of componentDirs) {
        const componentPath = path.join(folderPath, dir.name);
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
    },
  );
});
