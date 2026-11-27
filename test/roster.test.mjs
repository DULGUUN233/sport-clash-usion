import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ALL,SPORTS} from '../src/characters.js';

test('expanded rosters have unique cards and five career stat fields',()=>{
 assert.equal(new Set(ALL.map(p=>p.id)).size,ALL.length);
 for(const [key,s] of Object.entries(SPORTS)){
  const players=ALL.filter(p=>p.sport===key);
  assert.equal(players.length,key==='nba'?173:166,key);
  assert.equal(new Set(players.map(p=>p.name)).size,players.length,key);
  for(const pos of s.positions)assert.ok(players.filter(p=>p.seriesId===`${key}-${pos}`).length>24,`${key} ${pos}`);
  for(const p of players){assert.equal(p.stats.length,5);assert.ok(p.stats.some(Number.isInteger),p.name);assert.ok(p.stats.every(v=>v===null||(Number.isInteger(v)&&v>=0)),p.name);}
 }
});

test('every athlete has a distinct WebP portrait in the game bundle',()=>{
 assert.equal(new Set(ALL.map(p=>p.image)).size,ALL.length);
 for(const p of ALL){
  assert.match(p.image,/^\/images\/[a-z0-9-]+\.webp$/,p.name);
  const bytes=readFileSync(new URL(`..${p.image}`,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'RIFF',p.name);
  assert.equal(bytes.toString('ascii',8,12),'WEBP',p.name);
 }
});
