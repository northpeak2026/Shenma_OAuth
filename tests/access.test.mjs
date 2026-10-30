import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beijingDatePassword, verifyAccessPassword } from '../src/access.js';

test('北京时间零点自动切换日期，每次提交重新计算', () => {
  const before = new Date('2026-10-30T15:59:59.999Z');
  const after = new Date('2026-10-30T16:00:00.000Z');
  assert.equal(beijingDatePassword(before), '20261030');
  assert.equal(beijingDatePassword(after), '20261031');
  assert.equal(verifyAccessPassword('20261030', before), true);
  assert.equal(verifyAccessPassword('20261030', after), false);
  assert.equal(verifyAccessPassword('20261031', after), true);
});

test('日期以北京时间为准，不受输入时间的偏移量影响', () => {
  for (const instant of ['2026-10-31T00:30:00+08:00', '2026-10-30T09:30:00-07:00', '2026-10-30T16:30:00Z']) {
    assert.equal(beijingDatePassword(new Date(instant)), '20261031');
  }
});

test('跨年和闰年日期格式正确', () => {
  assert.equal(beijingDatePassword(new Date('2026-12-31T16:00:00Z')), '20270101');
  assert.equal(beijingDatePassword(new Date('2028-02-28T16:00:00Z')), '20280229');
  assert.equal(beijingDatePassword(new Date('2028-02-29T16:00:00Z')), '20280301');
});

test('空密码、错误密码及不规范格式均不能通过', () => {
  const now = new Date('2026-10-30T06:00:00Z');
  for (const password of ['', '123456', '2026-10-30', '2026103', ' 20261030', '20261030 ']) {
    assert.equal(verifyAccessPassword(password, now), false);
  }
});
