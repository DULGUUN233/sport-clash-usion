import {BY_ID,CHARACTERS,STATS,MAX,setSport} from './characters.js';

export const waiting=()=>({phase:'waiting',decks:[[],[]],round:0,picks:[null,null],slots:[Array(5).fill(null),Array(5).fill(null)]});
const shuffled=(list,rng)=>{const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};

export function deal(rng=Math.random,seriesId=null){
 if(seriesId){
  const pool=CHARACTERS.filter(c=>c.seriesId===seriesId);
  if(pool.length<10)throw Error('Not enough characters');
  const cards=shuffled(pool,rng).slice(0,10);
  return [cards.slice(0,5).map(c=>c.id),cards.slice(5).map(c=>c.id)];
 }
 const series=shuffled([...new Set(CHARACTERS.map(c=>c.seriesId))],rng).slice(0,5);
 const decks=[[],[]];
 for(const id of series){const pair=shuffled(CHARACTERS.filter(c=>c.seriesId===id),rng).slice(0,2);decks[0].push(pair[0].id);decks[1].push(pair[1].id);}
 return decks.map(cards=>shuffled(cards,rng));
}

export function start(decks){
 if(!Array.isArray(decks)||decks.length!==2||decks.some(d=>!Array.isArray(d)||d.length!==5))throw Error('Invalid deck');
 const all=decks.flat();
 if(new Set(all).size!==10||all.some(id=>!BY_ID.has(id)))throw Error('Invalid characters');
 const kind=BY_ID.get(all[0]).sport;
 if(all.some(id=>BY_ID.get(id).sport!==kind))throw Error('Mixed sports');
 setSport(kind);
 const series=decks.map(deck=>deck.map(id=>BY_ID.get(id).seriesId));
 for(const group of series){const unique=new Set(group);if(unique.size!==1&&unique.size!==5)throw Error('Invalid series');}
 if([...new Set(series[0])].sort().join('|')!==[...new Set(series[1])].sort().join('|'))throw Error('Mismatched series');
 return {...waiting(),phase:'playing',decks:decks.map(d=>[...d])};
}

export function pick(state,seat,stat){
 if(state.phase!=='playing'||![0,1].includes(seat)||!Number.isInteger(stat)||stat<0||stat>=5||state.picks[seat]!==null||state.slots[seat][stat]!==null)return state;
 const picks=[...state.picks];picks[seat]=stat;
 if(picks.some(x=>x===null))return {...state,picks};
 const slots=state.slots.map(d=>[...d]);
 for(let side=0;side<2;side++)slots[side][picks[side]]=state.decks[side][state.round];
 const round=state.round+1;
 return {...state,slots,round,picks:[null,null],phase:round===5?'done':'playing'};
}

export function results(state){
 const rows=STATS.map((stat,index)=>{
  const a=BY_ID.get(state.slots[0][index]),b=BY_ID.get(state.slots[1][index]);
  const left=a?.stats[index]??null,right=b?.stats[index]??null;
  return {stat,index,a,b,left,right,winner:left===null||right===null||left===right?null:left>right?0:1};
 });
 const scores=[rows.filter(r=>r.winner===0).length,rows.filter(r=>r.winner===1).length];
 return {rows,scores,winner:state.phase==='done'?(scores[0]===scores[1]?null:scores[0]>scores[1]?0:1):null};
}

export function botPick(state,rng=Math.random){
 const card=BY_ID.get(state.decks[1][state.round]);
 const available=STATS.map((_,i)=>i).filter(i=>state.slots[1][i]===null);
 return available.map(i=>({i,score:card.stats[i]/MAX[card.sport][i]+rng()*.15})).sort((a,b)=>b.score-a.score)[0].i;
}

export function reduce(state,action){
 if(action.type==='start'&&state.phase==='waiting')return start(action.data.decks);
 if(action.type==='pick')return pick(state,action.seat,action.data.stat);
 return state;
}
