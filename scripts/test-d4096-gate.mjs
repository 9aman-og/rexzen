import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const path = new URL('../public-research/dense-4096/', import.meta.url);
const csv = await readFile(new URL('electrode-map.csv', path), 'utf8');
let gate;
try {
  gate = await import(new URL('d4096-gate.mjs', path));
} catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
}

test('all published addresses load, have distinct 3D coordinates and preserve tile membership', () => {
  assert.ok(gate, 'the pure coverage gate and map parser have not been implemented');
  const points = gate.parseMap(csv);
  assert.equal(points.length, 4096);
  assert.equal(new Set(points.map(p => `${p.x}:${p.y}:${p.z}`)).size, 4096);
  assert.equal(points.filter(p => p.tile === 21).length, 64);
  assert.throws(() => gate.parseMap(csv.replace(/(^|\n)50,/, '$151,')), /map|address/i);
  assert.throws(() => gate.parseMap(csv.replace(/(^|\n)1,0,0,0,1,/, '$11,1,0,0,1,')), /map|layout/i);
  const lines=csv.trimEnd().split(/\r?\n/);
  const first=lines[1].split(',');first[8]='1000';lines[1]=first.join(',');
  assert.throws(() => gate.parseMap(lines.join('\n')),/projection/i);
});

test('the simulated count gate distinguishes one and two tile outages', () => {
  assert.ok(gate, 'the pure coverage gate and map parser have not been implemented');
  const points=gate.parseMap(csv);
  assert.equal(gate.inject(points, 'clean').valid, 4096);
  let result=gate.inject(points,'one-tile');
  assert.equal(result.valid,4032);
  assert.equal(result.reason,'qualified');
  result=gate.inject(points,'two-tiles');
  assert.equal(result.valid,3968);
  assert.equal(result.reason,'global-count');
  assert.equal(result.mask.filter(Boolean).length,128);
});

test('equal loss counts need not mean equal usable coverage', () => {
  assert.ok(gate, 'the pure coverage gate and map parser have not been implemented');
  const points=gate.parseMap(csv);
  const scattered=gate.inject(points,'scattered');
  const clustered=gate.inject(points,'clustered');
  assert.deepEqual([scattered.valid,clustered.valid],[4000,4000]);
  assert.equal(scattered.reason,'qualified');
  assert.equal(clustered.reason,'regional-count');
  assert.equal(Math.min(...scattered.sectors),500);
  assert.equal(Math.min(...clustered.sectors),416);
});

test('reference or clock faults suppress the window even with every lane present', () => {
  assert.ok(gate, 'the pure coverage gate and map parser have not been implemented');
  const points=gate.parseMap(csv);
  for (const reason of ['reference','clock']) {
    const result=gate.inject(points,reason);
    assert.equal(result.present,4096);
    assert.equal(result.valid,0);
    assert.equal(result.reason,reason);
  }
  assert.throws(()=>gate.inject(points,'broken input'),/scenario/i);
});
