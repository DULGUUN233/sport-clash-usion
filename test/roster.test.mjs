import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL,SPORTS} from '../src/characters.js';

test('each sport has 120 players, 24 per position, five real stats',()=>{
 assert.equal(new Set(ALL.map(p=>p.id)).size,ALL.length);
 for(const [key,s] of Object.entries(SPORTS)){
  const players=ALL.filter(p=>p.sport===key);
  assert.equal(players.length,120,key);
  assert.equal(new Set(players.map(p=>p.name)).size,120,key);
  for(const pos of s.positions)assert.equal(players.filter(p=>p.seriesId===`${key}-${pos}`).length,24,`${key} ${pos}`);
  for(const p of players){assert.equal(p.stats.length,5);assert.ok(p.stats.every(v=>typeof v==='number'&&v>=0),p.name);assert.match(p.image,/^data:image\/svg\+xml,/);}
 }
});
