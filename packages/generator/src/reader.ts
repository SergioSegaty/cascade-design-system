import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { TokenSourceFile, TreeNode } from './types.js';
import { classifyTokens } from './classifier.js';
import { parseTokens } from './parser.js';
import { capitalizeWord } from '../utils.js';

export async function getFiles(directory: string, extension = '.json'): Promise<string[]> {
  const directories = await readdir(directory, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const dir of directories) {
    const fullPath = path.join(directory, dir.name);

    if (dir.isDirectory()) {
      files.push(...(await getFiles(fullPath, extension)));
    } else if (dir.name.endsWith(extension)) {
      files.push(fullPath.replaceAll(path.sep, '/'));
    }
  }

  return files;
}

async function readJson<T = unknown>(path: string): Promise<T> {
  let content;
  try {
    content = await readFile(path, 'utf-8');
  } catch (e) {
    throw new Error(`It was not possible to read the file in ${path}.`, { cause: e });
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error(`It was not possible to parse the file in ${path}.`, { cause: e });
  }

  return parsed as T;
}

async function readTokenFile(
  currentPath: string,
  extension = '.json',
): Promise<[string, TreeNode]> {
  const parsedObject = await readJson<TreeNode>(currentPath);
  const paths = currentPath.replace(extension, '');

  return [paths, parsedObject];
}

async function getTokenFiles(filesDir: string[]) {
  const result: TokenSourceFile[] = [];

  for (const fileDir of filesDir) {
    const [tokenPath, tokenFile] = await readTokenFile(fileDir);
    const paths = tokenPath.split('/');

    const tokenSource: TokenSourceFile = {
      name: capitalizeWord(paths.at(-1)),
      path: tokenPath,
      segments: paths,
      tokens: parseTokens(tokenFile, tokenPath),
    };

    result.push(tokenSource);
  }

  return result;
}

export async function getClassifiedTokenFiles(filesDir: string[]) {
  const files = await getTokenFiles(filesDir);

  const classifiedResults = classifyTokens(files);

  return classifiedResults;
}
