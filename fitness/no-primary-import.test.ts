import { Project, SyntaxKind } from 'ts-morph';
import { describe, it, expect } from 'vitest';
import path from 'node:path';

const styleFilesPaths = ['packages/components/src/Atoms/**/*.style.ts'];
const stylePackage = '@cascade-ds/styles';
const forbiddenImport = 'primitive';

describe('fitness: component styles must not import `primary` from packages/styles', () => {
  it('has no *.style.ts file importing `primary` from packages/styles', () => {
    const project = new Project();
    const sourceFiles = project.addSourceFilesAtPaths(styleFilesPaths);

    const violations: string[] = [];

    for (const file of sourceFiles) {
      const importDeclarations = file.getImportDeclarations();

      for (const importDecl of importDeclarations) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();

        const resolvesToPackageStyles =
          moduleSpecifier.includes(stylePackage) ||
          isRelativeImportIntoPackageStyles(file.getFilePath(), moduleSpecifier);

        if (!resolvesToPackageStyles) continue;

        const namedImports = importDecl.getNamedImports();
        const importsPrimitive = namedImports.some(
          (named) => named.getName() === forbiddenImport,
        );

        const namespaceImport = importDecl.getNamespaceImport();
        let importsPrimaryViaNamespace = false;

        if (namespaceImport) {
          const alias = namespaceImport.getText();
          const usages = file
            .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
            .filter(
              (node) =>
                node.getExpression().getText() === alias && node.getName() === forbiddenImport,
            );
          importsPrimaryViaNamespace = usages.length > 0;
        }

        if (importsPrimitive || importsPrimaryViaNamespace) {
          violations.push(
            `${path.relative(process.cwd(), file.getFilePath())} imports ${forbiddenImport} from "${moduleSpecifier}"`,
          );
        }
      }
    }

    expect(
      violations,
      `Found ${violations.length} violation(s):\n${violations.join('\n')}`,
    ).toHaveLength(0);
  });
});

function isRelativeImportIntoPackageStyles(
  currentFilePath: string,
  moduleSpecifier: string,
): boolean {
  if (!moduleSpecifier.startsWith('.')) return false;
  const resolved = path.normalize(path.join(path.dirname(currentFilePath), moduleSpecifier));
  return resolved.includes(`${path.sep}package${path.sep}styles`);
}
