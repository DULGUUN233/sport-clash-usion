import test from 'node:test';
import assert from 'node:assert/strict';
import {deal,start,pick,results,botPick} from '../src/engine.js';
import {BY_ID} from '../src/characters.js';

test('a deal gives both sides five unique players from the same five positions',()=>{
 const decks=deal(()=>.37);
 assert.equal(new Set(decks.flat()).size,10);
 assert.deepEqual(new Set(decks[0].map(id=>BY_ID.get(id).seriesId)),new Set(decks[1].map(id=>BY_ID.get(id).seriesId)));
 assert.equal(start(decks).phase,'playing');
});

test('a football deal stays football and switches the stat set',async()=>{
 const {setSport,STATS}=await import('../src/characters.js');
 setSport('fb');
 const decks=deal(()=>.37);
 assert.ok(decks.flat().every(id=>BY_ID.get(id).sport==='fb'));
 assert.equal(start(decks).phase,'playing');
 const mod=await import('../src/characters.js');
 assert.equal(mod.STATS[0].key,'goals');
 setSport('nba');
});

test('each card locks into one empty stat and waits for both players',()=>{
 let game=start(deal(()=>.37));
 game=pick(game,0,2);
 assert.equal(game.round,0);
 assert.strictEqual(pick(game,0,1),game);
 game=pick(game,1,2);
 assert.equal(game.round,1);
 assert.equal(game.slots[0][2],game.decks[0][0]);
 assert.strictEqual(pick(game,0,2),game);
 for(const slot of [0,1,3,4]){game=pick(game,0,slot);game=pick(game,1,slot);}
 assert.equal(game.phase,'done');
 assert.equal(game.round,5);
 assert.equal(results(game).rows.length,5);
 assert.strictEqual(pick(game,0,4),game);
});

test('scores compare only matching stats; bot uses a vacant stat',()=>{
 let game=start(deal(()=>.37));
 for(let i=0;i<5;i++){game=pick(game,0,i);game=pick(game,1,botPick(game,()=>.2));}
 const result=results(game);
 assert.equal(result.scores[0]+result.scores[1],result.rows.filter(r=>r.left!==r.right).length);
 assert.equal(result.winner,result.scores[0]===result.scores[1]?null:result.scores[0]>result.scores[1]?0:1);
});
