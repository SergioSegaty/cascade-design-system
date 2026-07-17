import type { Writter } from '@types';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export class FileWritter implements Writter {
  async write(path: string, content: string) {
    const dirN = dirname(path);
    await mkdir(dirN, { recursive: true });
    await writeFile(path, content, 'utf-8');
  }
}
