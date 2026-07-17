import type { ClassifiedTokens, Token, TreeNode } from '@types';
import { isValueAlias } from './typeguards.js';
import { parseAlias } from './parser.js';

const indent = (level: number) => {
  return '  '.repeat(level);
};

function writeGeneratedWarning() {
  return '/** \n * Do not edit directly, this file was auto-generated. \n */ \n\n';
}

function getCssName(tokenId: string) {
  return `--${tokenId.replaceAll('.', '-')}`;
}

export const keyNamer = (key: string) => {
  if (key.includes('-') || /^\d+[a-zA-Z]+$/.test(key)) {
    const words = key.split('-');
    return `${words[0]}${words[1]!.at(0)!.toUpperCase()}${words[1]!.substring(1)}`;
  } else if (!Number.isNaN(+key)) {
    return +key;
  }

  return key;
};

function serializeCssToken(token: Token, theme?: string) {
  if (theme) token.id = token.id.replace(`${theme}.`, '');
  if (isValueAlias(token.value)) {
    return `${getCssName(token.id)}: var(${getCssName(parseAlias(token.value))});\n`;
  }

  return `${getCssName(token.id)}: ${token.value}; \n`;
}

export function serializeCssFromClassified(classifiedTokens: ClassifiedTokens) {
  let result = writeGeneratedWarning() + ':root { \n';

  classifiedTokens.primitives.forEach((prim) => {
    result += `\n /* == Primitives: ${prim.name} == **/\n\n`;
    prim.tokens?.forEach((token) => {
      result += '\t ' + serializeCssToken(token);
    });
  });

  classifiedTokens.semanticBase.forEach((sem) => {
    result += `\n /* == Semantic: ${sem.name} == **/\n\n`;
    sem.tokens?.forEach((token) => {
      result += '\t' + serializeCssToken(token);
    });
  });

  result += '}';

  const themes = Object.entries(classifiedTokens.themes).sort((a, _b) => {
    if (a[0] === 'light') return -1;
    return 1;
  });

  if (themes.length > 0) {
    result += '\n root, \n';
    themes.forEach(([key, files]) => {
      result += ` [data-theme="${key}"] {\n`;
      files.forEach((file) => {
        file.tokens?.forEach((token) => {
          result += '\t' + serializeCssToken(token, key);
        });
      });
      result += '} \n\n';
    });
  }

  return result;
}

function serializeObjectToText(object: TreeNode, level = 1) {
  let result = '{\n';

  for (const key in object) {
    const value = object[key];
    result += `${indent(level)}${keyNamer(key)}: `;
    if (typeof value !== 'object') {
      result += `"${value}",`;
    } else {
      result += serializeObjectToText(value, level + 1);
    }

    result += '\n';
  }

  result += `${indent(level)}`;
  const end = level === 1 ? '}' : '},';

  return result + end;
}

export function serializeTypescript(object: TreeNode) {
  return serializeJavascript(object) + ' as const;';
}

export function serializeJavascript(object: TreeNode) {
  return `${writeGeneratedWarning()} export const Theme = ${serializeObjectToText(object)}`;
}
