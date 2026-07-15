const indent = (level) => {
  return '  '.repeat(level);
};

export const keyNamer = (key) => {
  if (key.includes('-') || /^\d+[a-zA-Z]+$/.test(key)) {
    const words = key.split('-');
    return `${words[0]}${words[1].at(0).toUpperCase()}${words[1].substring(1)}`;
  } else if (!Number.isNaN(+key)) {
    return +key;
  }

  return key;
};

export const buildObjectByTokens = (allTokens) => {
  const root = {};

  allTokens.forEach((token) => {
    let current = root;
    let lastSegment = token.path.at(-1);
    for (let i = 0; i < token.path.length - 1; i++) {
      let segment = token.path[i];
      if (!Object.hasOwn(current, segment)) {
        current[segment] = {};
        current = current[segment];
      } else current = current[segment];
    }
    current[lastSegment] = token.value;
  });

  return root;
};

export const serializeObjectToText = (object, level = 1) => {
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
  let end = level === 1 ? '}' : '},';

  return result + end;
};
