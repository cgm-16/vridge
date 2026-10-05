/** @jest-environment node */
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const repository = process.cwd();
const temporaryDirectory = realpathSync(
  mkdtempSync(join(tmpdir(), 'vridge-tooling-'))
);
const checkout = join(temporaryDirectory, '.worktrees', 'current');

function writeFixture(relativePath: string, contents: string) {
  const path = join(checkout, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

beforeAll(() => {
  mkdirSync(checkout, { recursive: true });
  for (const file of ['eslint.config.mjs', 'jest.config.js', 'package.json']) {
    copyFileSync(join(repository, file), join(checkout, file));
  }
  symlinkSync(join(repository, 'node_modules'), join(checkout, 'node_modules'));
  writeFixture('app/current.test.js', "test('현재 체크아웃', () => {});\n");
  writeFixture(
    '.worktrees/sibling/app/sibling.test.js',
    "test('형제 체크아웃', () => {});\n"
  );
  writeFixture(
    '.worktrees/sibling/.next/generated.js',
    "require('node:fs');\n"
  );
  writeFixture('tools/migration/package.json', '{"name":"migration"}');
  writeFixture(
    '.worktrees/sibling/tools/migration/package.json',
    '{"name":"migration"}'
  );
});

afterAll(() => {
  rmSync(temporaryDirectory, { recursive: true, force: true });
});

it('ESLint는 현재 체크아웃만 검사하고 형제 워크트리의 생성물과 소스를 제외한다', () => {
  const result = spawnSync(
    process.execPath,
    [
      join(repository, 'node_modules/eslint/bin/eslint.js'),
      '.',
      '--format=json',
    ],
    { cwd: checkout, encoding: 'utf8' }
  );
  const paths = JSON.parse(result.stdout).map(
    (file: { filePath: string }) => file.filePath
  );

  expect(paths).toContain(join(checkout, 'app/current.test.js'));
  expect(
    paths.some((path: string) => path.startsWith(join(checkout, '.worktrees')))
  ).toBe(false);
  expect(result.stderr).toBe('');
  expect(result.status).toBe(0);
});

it('Jest는 현재 체크아웃 테스트를 찾고 형제 워크트리의 테스트와 중복 패키지를 제외한다', () => {
  const result = spawnSync(
    process.execPath,
    [
      join(repository, 'node_modules/jest/bin/jest.js'),
      '--listTests',
      '--runInBand',
      '--no-cache',
      '--json',
    ],
    { cwd: checkout, encoding: 'utf8' }
  );

  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toEqual([
    join(checkout, 'app/current.test.js'),
  ]);
});
