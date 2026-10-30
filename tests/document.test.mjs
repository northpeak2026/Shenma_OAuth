import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadRequirements } from '../src/loadRequirements.js';

test('文档加载返回原文件全文，不截取章节或维护第二份内容', async () => {
  const source = await readFile(new URL('../docs/REQUIREMENTS.md', import.meta.url), 'utf8');
  const result = await loadRequirements(async () => ({ default: source }));
  assert.equal(result, source);
});

test('加载失败向上抛出，供界面展示错误及重试', async () => {
  await assert.rejects(loadRequirements(async () => { throw new Error('加载失败'); }), /加载失败/);
});

test('空白、缺失或无效文档不能显示为空白正文', async () => {
  for (const content of ['', ' \n', undefined, 42]) {
    await assert.rejects(loadRequirements(async () => ({ default: content })), /需求文档内容无效/);
  }
});

test('首次失败后允许重新加载', async () => {
  let attempts = 0;
  const importer = async () => { if (attempts++ === 0) throw new Error('临时失败'); return { default: '# 完整需求\n\n正文' }; };
  await assert.rejects(loadRequirements(importer));
  assert.equal(await loadRequirements(importer), '# 完整需求\n\n正文');
});
