export async function loadRequirements(importDocument = () => import('../docs/REQUIREMENTS.md?raw')) {
  const module = await importDocument();
  if (typeof module.default !== 'string' || !module.default.trim()) {
    throw new Error('需求文档内容无效');
  }
  return module.default;
}
