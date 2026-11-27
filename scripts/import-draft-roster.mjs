import {copyFile,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {categories} from '../../draft-20-usion/src/game.js';

const here=fileURLToPath(new URL('..',import.meta.url));
const draft=fileURLToPath(new URL('../../draft-20-usion/src/images/',import.meta.url));
const counts={naruto:20,dragonball:20,onepiece:20,jjk:20,demonslayer:20,aot:20,bleach:15,hxh:15,mha:15,chainsaw:15,deathnote:15,onepunch:15,haikyuu:10,bluelock:10};
const existing=new Set(['naruto','dragonball','onepiece','jjk','demonslayer','aot']);
const base={
 naruto:[85,85,88,82,85],dragonball:[96,95,92,79,96],onepiece:[84,84,84,80,86],
 jjk:[82,82,88,82,83],demonslayer:[73,80,77,77,76],aot:[65,69,66,79,68],
 bleach:[86,86,90,83,86],hxh:[79,82,85,84,80],mha:[77,80,84,78,79],
 chainsaw:[77,79,84,76,80],deathnote:[45,51,65,88,50],onepunch:[85,85,85,76,86],
 haikyuu:[55,70,60,77,60],bluelock:[57,74,62,80,62]
};
const overrides={
 'naruto-5':[78,85,98,97,76],'naruto-6':[88,100,94,94,85],'naruto-9':[99,99,76,72,98],
 'naruto-10':[86,91,97,98,87],'naruto-17':[66,71,84,99,67],
 'dragonball-5':[98,97,94,84,97],'dragonball-6':[97,95,96,90,96],'dragonball-7':[100,98,92,85,99],
 'dragonball-8':[100,100,100,85,100],'dragonball-9':[100,100,100,88,100],
 'onepiece-5':[92,88,88,76,92],'onepiece-10':[86,95,82,83,87],'onepiece-19':[49,67,76,93,57],
 'jjk-6':[93,93,84,79,89],'jjk-7':[95,96,69,82,91],'jjk-10':[76,82,92,89,82],
 'demonslayer-11':[96,94,99,89,99],'demonslayer-14':[98,82,91,85,97],
 'aot-5':[66,72,67,98,71],'aot-7':[89,73,85,72,94],
 'bleach-4':[95,96,99,99,96],'bleach-5':[99,88,88,73,98],
 'hxh-5':[98,98,97,95,97],'hxh-8':[91,90,91,98,87],
 'mha-4':[99,97,96,84,98],'mha-7':[95,92,98,88,96],
 'chainsaw-0':[88,86,99,97,95],'chainsaw-1':[91,89,94,75,99],
 'deathnote-0':[40,48,42,100,44],'deathnote-1':[43,50,91,99,46],
 'deathnote-2':[82,86,96,84,98],'deathnote-7':[79,83,95,79,96],
 'onepunch-0':[100,100,100,72,100],'onepunch-3':[96,98,95,91,97],
 'onepunch-8':[28,30,38,57,34],
 'haikyuu-0':[62,90,72,73,68],'haikyuu-1':[66,77,84,92,67],
 'bluelock-2':[62,79,76,98,67],'bluelock-4':[74,87,81,91,73]
};
const hash=(text)=>{let n=2166136261;for(const ch of text)n=Math.imul(n^ch.codePointAt(0),16777619);return n>>>0;};
const score=(id,index,name)=>overrides[`${id}-${index}`]||base[id].map((value,stat)=>{
 const rank=Math.max(-7,8-Math.floor(index/2));
 return Math.min(100,Math.max(25,value+rank+(hash(`${name}:${stat}`)%13)-6));
});

const rows=[];
for(const [id,count] of Object.entries(counts)){
 const category=categories.find(entry=>entry[0]===id);
 if(!category||category[3].length<count)throw Error(`Catalog incomplete: ${id}`);
 for(let index=existing.has(id)?5:0;index<count;index++){
  const name=category[3][index],file=`${id}-${index}.webp`;
  const bytes=await readFile(join(draft,file));
  if(bytes.length<5000)throw Error(`Image too small: ${file}`);
  await copyFile(join(draft,file),join(here,'images',file));
  rows.push([id,category[1],index,name,score(id,index,name)]);
 }
}
if(rows.length!==200)throw Error(`Expected 200 new characters, got ${rows.length}`);
const output=`// Curated from Draft 20's anime catalog. Scores are editorial game ratings.\nconst rows=${JSON.stringify(rows,null,1)};\nexport const EXTRA_CHARACTERS=rows.map(([seriesId,series,index,name,stats])=>({id:\`${'${seriesId}'}-${'${index}'}\`,seriesId,series,name,stats,image:\`/images/${'${seriesId}'}-${'${index}'}.webp\`}));\n`;
await writeFile(join(here,'src','extra-characters.js'),output);
console.log(`Imported ${rows.length} characters from ${Object.keys(counts).length} series.`);
