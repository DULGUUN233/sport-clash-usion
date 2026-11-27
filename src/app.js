import {BY_ID,CHARACTERS,STATS,SPORTS,sport as activeSport,setSport,fmt} from './characters.js';
import {waiting,deal,pick,results,botPick,reduce} from './engine.js';
const loadImage=(src,cors=false)=>new Promise(resolve=>{
 if(!src)return resolve(null);
 const image=new Image();if(cors)image.crossOrigin='anonymous';
 image.onload=()=>resolve(image);
 image.onerror=()=>resolve(null);
 image.src=src;
});

async function createResultCard(result,mine,playerName,opponentName,myAvatar='',opponentAvatar=''){
 const W=1080,H=1920,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
 const ctx=canvas.getContext('2d'),opponent=1-mine;
 const win=result.winner===mine,draw=result.winner===null;
 const C={ink:'#07070d',panel:'#12121d',panel2:'#1a1a29',p1:'#29e3ff',p2:'#ff2e63',hit:'#ffd60a',paper:'#f7f2e6',mute:'#8d8ca6',win:'#3ff08f'};
 const accent=draw?C.hit:win?C.win:C.p2;
 try{await Promise.all(['900 80px Unbounded','800 40px Unbounded'].map(f=>document.fonts.load(f)));}catch{}
 const F=(w,size)=>`${w} ${size}px Unbounded, system-ui, sans-serif`;
 const para=(x,y,w,h,k)=>{ctx.beginPath();ctx.moveTo(x+k,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w-k,y+h);ctx.lineTo(x,y+h);ctx.closePath();};
 const fit=(text,max)=>{while(ctx.measureText(text).width>max&&text.length>3)text=text.slice(0,-2)+'…';return text;};
 const outline=(text,x,y,fill,stroke=12)=>{ctx.lineJoin='round';ctx.lineWidth=stroke;ctx.strokeStyle=C.ink;ctx.strokeText(text,x,y);ctx.fillStyle=fill;ctx.fillText(text,x,y);};
 // background + tint + halftone
 ctx.fillStyle=C.ink;ctx.fillRect(0,0,W,H);
 const tint=ctx.createLinearGradient(0,0,W,H);tint.addColorStop(0,accent+'33');tint.addColorStop(.45,'#07070d00');tint.addColorStop(1,C.p2+'22');
 ctx.fillStyle=tint;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#ffffff10';for(let y=0;y<H;y+=16)for(let x=(y/16%2)*8;x<W;x+=16){ctx.beginPath();ctx.arc(x,y,1.8,0,7);ctx.fill();}
 // speed lines behind verdict
 ctx.save();ctx.translate(W/2,420);ctx.strokeStyle=accent+'26';ctx.lineWidth=6;
 for(let i=0;i<36;i++){const a=i/36*Math.PI*2;ctx.beginPath();ctx.moveTo(Math.cos(a)*260,Math.sin(a)*160);ctx.lineTo(Math.cos(a)*900,Math.sin(a)*700);ctx.stroke();}
 ctx.restore();
 // logo
 ctx.save();ctx.translate(70,120);ctx.rotate(-.07);
 ctx.font=F(800,38);const lw=ctx.measureText('SPORT').width+40;ctx.fillStyle=C.paper;para(0,-44,lw,58,12);ctx.fill();
 ctx.fillStyle=C.ink;ctx.textBaseline='alphabetic';ctx.fillText('SPORT',20,0);
 ctx.font=F(900,96);ctx.fillStyle=C.p2;ctx.fillText('CLASH',8,108);outline('CLASH',0,100,C.hit,10);
 ctx.restore();
 // verdict
 ctx.save();ctx.translate(W/2,470);ctx.transform(1,0,-.12,1,0,0);ctx.textAlign='center';
 ctx.font=F(900,170);const verdict=draw?'ТЭНЦЭЭ':win?'ЯЛАЛТ!':'ЯЛАГДАЛ';
 let size=170;while(ctx.measureText(verdict).width>W-120){size-=8;ctx.font=F(900,size);}
 ctx.fillStyle=C.ink;ctx.fillText(verdict,10,12);outline(verdict,0,0,accent,16);
 ctx.restore();
 // score band
 const by=560;ctx.fillStyle=C.panel2;para(60,by,960,220,30);ctx.fill();
 ctx.fillStyle=accent;para(60,by,960,10,4);ctx.fill();
 const tag=(text,x,y,bg,fg,align)=>{ctx.font=F(800,30);const t=fit(text.toUpperCase(),300),w=ctx.measureText(t).width+40;const tx=align==='left'?x:x-w;ctx.fillStyle=bg;para(tx,y,w,54,12);ctx.fill();ctx.fillStyle=fg;ctx.textAlign='left';ctx.fillText(t,tx+20,y+39);};
 tag(playerName,110,by+40,C.p1,C.ink,'left');tag(opponentName,970,by+40,C.p2,'#fff','right');
 const avatarImg=async src=>await loadImage(src,true)||(/^https:/.test(src)?await loadImage('/avatar?u='+encodeURIComponent(src)):null);
 const [myImg,opImg]=await Promise.all([avatarImg(myAvatar),avatarImg(opponentAvatar)]);
 const hex=(img,cx,cy,r,bg,fg,name)=>{ctx.save();ctx.beginPath();for(let k=0;k<6;k++){const a=Math.PI/3*k-Math.PI/2;ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}ctx.closePath();ctx.fillStyle=bg;ctx.fill();ctx.clip();
  if(img){const sc=Math.max(2*r/img.width,2*r/img.height);ctx.drawImage(img,cx-img.width*sc/2,cy-img.height*sc/2,img.width*sc,img.height*sc);}
  else{ctx.fillStyle=fg;ctx.textAlign='center';ctx.font=F(900,r*.8);ctx.fillText((name||'?').slice(0,1).toUpperCase(),cx,cy+r*.3);}
  ctx.restore();};
 hex(myImg,165,by+150,56,C.p1,C.ink,playerName);hex(opImg,915,by+150,56,C.p2,'#fff',opponentName);
 ctx.font=F(900,110);ctx.textAlign='center';
 outline(String(result.scores[mine]),300,by+190,result.scores[mine]>=result.scores[opponent]?C.paper:C.mute,10);
 outline(String(result.scores[opponent]),780,by+190,result.scores[opponent]>=result.scores[mine]?C.paper:C.mute,10);
 outline(':',540,by+180,C.hit,10);
 // rows
 const ordered=result.rows.map(row=>({row,left:mine===0?row.a:row.b,right:mine===0?row.b:row.a,a:mine===0?row.left:row.right,b:mine===0?row.right:row.left}));
 const images=await Promise.all(ordered.flatMap(({left,right})=>[loadImage(left.image),loadImage(right.image)]));
 const icons=await Promise.all(ordered.map(({row})=>loadImage(row.stat.img)));
 const portrait=(img,x,y,w,h,lost,edge)=>{ctx.save();para(x,y,w,h,14);ctx.clip();ctx.fillStyle=C.panel2;ctx.fillRect(x,y,w,h);
  if(img){const sc=Math.max(w/img.width,h/img.height),iw=img.width*sc,ih=img.height*sc;if(lost)ctx.filter='grayscale(1) brightness(.6)';ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);ctx.filter='none';}
  ctx.restore();ctx.save();para(x,y,w,h,14);ctx.lineWidth=5;ctx.strokeStyle=lost?C.mute:edge;ctx.stroke();ctx.restore();};
 for(let i=0;i<ordered.length;i++){
  const {row,left,right,a,b}=ordered[i],y=830+i*190;
  ctx.fillStyle=C.panel;para(60,y,960,170,20);ctx.fill();
  portrait(images[i*2],80,y+12,120,146,a<b,C.p1);portrait(images[i*2+1],880,y+12,120,146,b<a,C.p2);
  ctx.textAlign='left';ctx.font='800 30px system-ui, sans-serif';ctx.fillStyle=a<b?C.mute:C.paper;ctx.fillText(fit(left.name,250),222,y+70);
  ctx.textAlign='right';ctx.fillStyle=b<a?C.mute:C.paper;ctx.fillText(fit(right.name,250),858,y+70);
  ctx.textAlign='center';ctx.font=F(800,22);ctx.fillStyle=C.hit;const label=row.stat.mn.toUpperCase(),lw=ctx.measureText(label).width;ctx.fillText(label,557,y+42);if(icons[i])ctx.drawImage(icons[i],540-lw/2-23,y+16,34,34);
  ctx.font=F(900,56);
  ctx.fillStyle=a>b?C.win:a<b?C.p2:C.mute;ctx.fillText(fmt(a),440,y+138);
  ctx.fillStyle=b>a?C.win:b<a?C.p2:C.mute;ctx.fillText(fmt(b),640,y+138);
 }
 // footer
 ctx.fillStyle=C.hit;para(60,1810,960,14,6);ctx.fill();
 ctx.textAlign='center';ctx.font=F(800,28);ctx.fillStyle=C.mute;ctx.fillText(`${SPORTS[activeSport].name.toUpperCase()} · 5 РАУНД · 1 ЯЛАГЧ`,540,1880);
 return canvas.toDataURL('image/jpeg',.88);
}


const root=document.getElementById('app');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let game=waiting(),mode='bot',sdk=null,meId='',players=[],lastSequence=0,starting=false,sending=false,connection='connected',status='',reported=false,replaying=false,syncReady=false;
let inviting=false,present=new Set(),info={},myReady=false;
let botAdded=false,playerName='ЧИ',playerAvatar='';
let spinReady=true,rolling=false,spinCards=[[],[]],reveal=null,resultStep=null,motion=0,phaseTimer=null;
let shareBusy=false,feedPosted=false,submittedKey='';
let sport=(()=>{try{return localStorage.getItem('sport-clash-sport')==='fb'?'fb':'nba';}catch{return 'nba';}})();setSport(sport);
const makeDeal=()=>{setSport(sport);return deal(Math.random);};
const sportPick=(locked=false)=>`<div class="sport-pick" role="radiogroup">${Object.entries(SPORTS).map(([key,s])=>`<button role="radio" aria-checked="${key===sport}" class="${key===sport?'on':''}" data-sport="${key}" ${locked?'disabled':''}><i>${s.emoji}</i>${s.name}</button>`).join('')}</div>`;
const foeInfo=()=>mode==='bot'?{}:(info[players[1-Math.max(0,players.indexOf(meId))]]||{});
const otherName=()=>mode==='bot'?'БОТ':(foeInfo().name||'Өрсөлдөгч');
const otherAvatar=()=>mode==='bot'?'':(foeInfo().avatar||'');
const avatarHtml=(src,name)=>src?`<img src="${esc(src)}" alt="">`:`<span>${esc((name||'?').slice(0,1).toUpperCase())}</span>`;
const seat=()=>Math.max(0,players.indexOf(meId));
const self=()=>mode==='bot'?0:seat();
const foe=()=>1-self();
const card=(side)=>BY_ID.get(game.decks[side][game.round]);
const picture=(character,kind,label,reel,selection)=>`<div class="fighter ${kind}">${reel?`<div class="reel">${reel.map(item=>`<img src="${item.image}" alt="">`).join('')}</div>`:`<img src="${character.image}" alt="${esc(character.name)}">`}${kind==='mine'?`<span class="fighter-profile" aria-label="${esc(playerName)}">${playerAvatar?`<img src="${esc(playerAvatar)}" alt="">`:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7z"/></svg>'}</span>`:mode==='bot'?`<em>${esc(label)}</em>`:`<span class="fighter-profile rival-profile" aria-label="${esc(label)}">${avatarHtml(otherAvatar(),label)}</span>`}${selection?`<span class="fighter-pick" aria-label="${label} ${selection.mn} сонгосон"><img src="${selection.img}" alt="">${selection.mn}</span>`:''}<small>${reel?SPORTS[activeSport].name.toUpperCase():esc(character.series)}</small><strong>${reel?'Сонгож байна…':esc(character.name)}</strong></div>`;

function renderHome(){
 const avatar=playerAvatar?`<img src="${esc(playerAvatar)}" alt="">`:`<span>${esc(playerName.slice(0,2).toUpperCase())}</span>`;
 root.innerHTML=`<section class="home sport-${sport}"><div class="home-art" aria-hidden="true"></div><h1 class="logo"><span>SPORT</span><b>CLASH</b></h1><div class="home-vs"><div class="vs-side me"><div class="player-avatar">${avatar}</div><strong>${esc(playerName)}</strong></div><div class="vs-mark" aria-hidden="true">VS</div><div class="vs-side foe"><div class="player-avatar">?</div><strong>Өрсөлдөгч</strong></div></div>${sportPick()}<div class="home-actions"><button class="btn-primary" data-play>Тоглох</button><button class="btn-ghost" data-invite ${inviting?'disabled':''}>Найзаа урих</button></div>${status?`<p class="home-status" role="status">${esc(status)}</p>`:''}</section>`;
}

const isReady=id=>id===meId?myReady:!!info[id]?.ready;
function roster(){const ids=[...players.filter(id=>present.has(id)),...[...present].filter(id=>!players.includes(id))];return [...new Set(ids)];}
function hostId(){const ids=roster();return players.find(id=>present.has(id))||[...ids].sort()[0]||meId;}
function renderWait(){
 const ids=roster(),host=hostId(),isHost=meId===host,foeId=ids.find(id=>id!==meId);
 const canStart=ids.length>=2&&ids.filter(id=>id!==host).every(isReady);
 const meAv=playerAvatar?`<img src="${esc(playerAvatar)}" alt="">`:`<span>${esc(playerName.slice(0,2).toUpperCase())}</span>`;
 const badge=id=>id===host?'<em class="vs-badge host">ЭЗЭН</em>':isReady(id)?'<em class="vs-badge ready">БЭЛЭН</em>':'<em class="vs-badge">…</em>';
 const fi=foeId?(info[foeId]||{}):null;
 const foeSide=foeId?`<div class="player-avatar">${avatarHtml(fi.avatar,fi.name||'?')}</div><strong>${esc(fi.name||'Тоглогч')}</strong>${badge(foeId)}`:'<div class="player-avatar waiting-avatar">?</div><strong>Хүлээж байна</strong>';
 const primary=isHost?`<button class="btn-primary" data-hall-start ${canStart&&!starting?'':'disabled'}>Эхлүүлэх</button>`:`<button class="btn-primary ${myReady?'is-ready':''}" data-ready>${myReady?'Бэлэн ✓':'Бэлэн'}</button>`;
 root.innerHTML=`<section class="home lobby sport-${sport}"><div class="home-art" aria-hidden="true"></div><h1 class="logo"><span>SPORT</span><b>CLASH</b></h1><div class="home-vs"><div class="vs-side me"><div class="player-avatar">${meAv}</div><strong>${esc(playerName)}</strong>${badge(meId)}</div><div class="vs-mark" aria-hidden="true">VS</div><div class="vs-side foe">${foeSide}</div></div>${sportPick(!isHost)}<div class="home-actions">${primary}${foeId?'':`<div class="lobby-extra"><button class="btn-ghost" data-invite ${inviting?'disabled':''}>Урих</button><button class="btn-ghost" data-hall-bot>Боттой</button></div>`}</div>${status?`<p class="home-status" role="status">${esc(status)}</p>`:''}</section>`;
}

function renderBattle(){
 const mine=self(),theirs=foe(),me=reveal?BY_ID.get(reveal.decks[mine][reveal.round]):card(mine),opponent=reveal?BY_ID.get(reveal.decks[theirs][reveal.round]):card(theirs),chosen=game.picks[mine]!==null,opponentStat=reveal?reveal.picks[theirs]:game.picks[theirs];
 const canPlace=!rolling&&!reveal&&!chosen&&!sending&&connection==='connected';
 const rows=STATS.map((stat,i)=>{
  const placed=BY_ID.get(game.slots[mine][i]);
  const opponentPick=reveal?reveal.picks[theirs]===i:game.picks[theirs]===i;
  const ownPick=reveal?reveal.picks[mine]===i:game.picks[mine]===i;
  return `<button class="slot ${placed?'locked':ownPick?'pending':'open'} ${opponentPick?'opponent':''}" data-slot="${i}" ${placed||!canPlace?'disabled':''} aria-label="${stat.mn}: ${opponentPick?`${otherName()} сонгосон, `:''}${placed?`${placed.name} байрлуулсан`:'оноо нууц'}"><span class="slot-icon"><img src="${stat.img}" alt=""></span><strong>${stat.mn}</strong><span class="slot-value">${placed?`<img src="${placed.image}" alt="${esc(placed.name)}">`:ownPick?'✓':'+'}</span>${opponentPick?'<span class="opponent-flag">● '+otherName()+'</span>':''}</button>`;
 }).join('');
 const opponentRows=STATS.map((stat,i)=>{
  const placed=BY_ID.get(game.slots[theirs][i]),selected=opponentStat===i;
  return `<div class="slot enemy-slot ${placed?'locked':'open'} ${selected?'selected':''}" aria-label="${otherName()} ${stat.mn}: ${placed?`${placed.name} байрлуулсан`:selected?'сонгосон':'хүлээж байна'}"><span class="slot-icon"><img src="${stat.img}" alt=""></span><strong>${stat.mn}</strong><span class="slot-value">${placed?`<img src="${placed.image}" alt="${esc(placed.name)}">`:selected?'✓':'+'}</span></div>`;
 }).join('');
 const line=rolling?'ТАМИРЧИД ЭРГЭЖ БАЙНА…':reveal?`Чи ${STATS[reveal.picks[mine]].mn} · ${otherName()} ${STATS[reveal.picks[theirs]].mn} сонголоо`:chosen?'Нөгөө талын сонголтыг хүлээж байна…':opponentStat!==null?`${otherName()} ${STATS[opponentStat].mn} сонголоо. Чи сонго.`:`<strong>${esc(me.name)}</strong>-ийг аль үзүүлэлтэд оноох вэ?`;
 root.innerHTML=`<section class="stage"><div class="stage-head"><div><div class="eyebrow">${mode==='bot'?'БОТЫН ЭСРЭГ':'НАЙЗТАЙГАА'}</div><h1>Тамирчнаа байрлуул</h1></div><span class="round-pill" aria-label="Раунд ${(reveal?.round??game.round)+1} / 5"><b>${(reveal?.round??game.round)+1}</b>/5<i>${[0,1,2,3,4].map(i=>`<s class="${i<(reveal?.round??game.round)?'done':i===(reveal?.round??game.round)?'now':''}"></s>`).join('')}</i></span></div><div class="cards ${rolling?'rolling':''} ${rolling&&!spinReady?'preload':''}">${picture(me,'mine','ЧИ',rolling?spinCards[mine]:null)}<div class="versus">VS</div>${picture(opponent,'rival',otherName(),rolling?spinCards[theirs]:null,opponentStat!==null&&!rolling?STATS[opponentStat]:null)}</div><div class="instruction">${line}</div><div class="slots">${rows}</div><div class="opponent-slots" aria-label="${otherName()} сонголт">${opponentRows}</div></section>`;
}

function renderDone(){
 const mine=self(),theirs=foe(),result=results(game);
 const finished=resultStep===10;
 const rows=result.rows.map((r,index)=>{
  const a=mine===0?r.a:r.b,b=mine===0?r.b:r.a;
  const aScore=mine===0?r.left:r.right,bScore=mine===0?r.right:r.left;
  const active=resultStep>=0&&resultStep<10&&Math.floor(resultStep/2)===index&&resultStep%2===0;
  const settled=finished||resultStep>=0&&(index<Math.floor(resultStep/2)||index===Math.floor(resultStep/2)&&resultStep%2===1);
  const showScores=settled;
  const leftLoss=settled&&aScore<bScore?'loser':'';
  const rightLoss=settled&&bScore<aScore?'loser':'';
  const mark=aScore===bScore?'even':aScore>bScore?'victor':'defeat';
  const other=aScore===bScore?'even':aScore<bScore?'victor':'defeat';
  return `<div class="result-row ${active?'dueling':''} ${settled?'settled':''}"><img class="${leftLoss}" src="${a.image}" alt=""><span class="left ${leftLoss}"><b>${esc(a.name)}</b><small>${r.stat.mn}</small></span><strong class="${showScores?mark:''} ${leftLoss}">${showScores?fmt(aScore):'—'}</strong><strong class="${showScores?other:''} ${rightLoss}">${showScores?fmt(bScore):'—'}</strong><span class="right ${rightLoss}"><b>${esc(b.name)}</b><small>${r.stat.mn}</small></span><img class="${rightLoss}" src="${b.image}" alt=""></div>`;
 }).join('');
 const outcome=result.winner===null?'draw':result.winner===mine?'win':'lose';
 const profile=playerAvatar?`<img src="${esc(playerAvatar)}" alt="">`:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7z"/></svg>';
 const summary=finished?`<div class="result-summary ${outcome}"><div class="result-person ${outcome==='win'?'winner':''}"><span class="result-profile">${profile}</span><b>${esc(playerName)}</b></div><div class="result-verdict"><strong>${outcome==='win'?'ЯЛЛАА':outcome==='lose'?'ЯЛАГДЛАА':'ТЭНЦЛЭЭ'}</strong><span>${result.scores[mine]} : ${result.scores[theirs]}</span></div><div class="result-person ${outcome==='lose'?'winner':''}"><span class="result-profile rival">${mode==='bot'?'✦':avatarHtml(otherAvatar(),otherName())}</span><b>${otherName()}</b></div></div><div class="result-share"><button data-share="instagram" aria-label="Instagram-д хуваалцах" title="Instagram-д хуваалцах"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg><span>Story</span></button><button data-share="feed" aria-label="${feedPosted?'Нийтлэгдсэн':'Usion Feed-д нийтлэх'}" title="${feedPosted?'Нийтлэгдсэн':'Usion Feed-д нийтлэх'}" ${feedPosted?'disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><rect x="6.5" y="7" width="4" height="4" rx="1"/><path d="M13 8h4.5M13 11h4.5M6.5 15h11M6.5 18h8"/></svg><span>${feedPosted?'✓ Feed':'Feed'}</span></button></div><p class="share-status" role="status"></p><button class="result-replay" data-again>${mode==='bot'?'Дахин тоглох':'Дахин тоглох хүсэлт'}</button>`:'';
 let clash='';
 if(resultStep>=0&&resultStep<10){
  const idx=Math.floor(resultStep/2),hit=resultStep%2===1,r=result.rows[idx];
  const a=mine===0?r.a:r.b,b=mine===0?r.b:r.a,aS=mine===0?r.left:r.right,bS=mine===0?r.right:r.left;
  const st=(x,y)=>!hit?'':x>y?'win':x<y?'ko':'even';
  const side=(c,sc,cls)=>`<div class="clash-card ${cls}"><i><img src="${c.image}" alt=""></i><b>${esc(c.name)}</b><strong>${fmt(sc)}</strong></div>`;
  clash=`<div class="clash ${hit?'hit':'in'} ${resultStep===0?'first':''}" aria-hidden="true"><div class="clash-round">${idx+1} / 5</div><div class="clash-stat"><img src="${r.stat.img}" alt="">${esc(r.stat.mn)}</div><div class="clash-fighters">${side(a,aS,'me '+st(aS,bS))}<div class="clash-burst">VS</div>${side(b,bS,'foe '+st(bS,aS))}</div></div>`;
 }
 root.innerHTML=`${clash}<section class="results"><div class="results-head"><div class="eyebrow">5 ТУЛААНЫ ДҮН</div><h1>ТУЛААНЫ ДҮН</h1><p class="subtitle">${finished?'Ялагч тодорлоо':resultStep===-1?'Тамирчид бэлэн':'Оноо нээгдэж байна'}</p></div><div class="result-list">${rows}</div>${summary}</section>`;
 if(finished&&outcome==='win')submitWin(result);
}

async function submitWin(result){
 const lb=sdk?.leaderboard;if(!lb)return;
 const key=result.rows.map(r=>r.a.name+'|'+r.b.name).join(',');
 if(submittedKey===key)return;submittedKey=key;
 try{const me=await lb.me().catch(()=>null);await lb.submit((me?.score||0)+1);}catch{submittedKey='';}
}

function render(){if(reveal||game.phase==='playing')renderBattle();else if(game.phase==='done'){if(resultStep===null)startResults();else renderDone();}else if(mode==='friend')renderWait();else renderHome();}

function stopMotion(){motion++;clearTimeout(phaseTimer);rolling=false;reveal=null;resultStep=null;}
function startResults(){
 stopMotion();feedPosted=false;resultStep=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?10:-1;renderDone();
 if(resultStep===10)return;
 const token=motion;
 const advance=()=>{if(token!==motion)return;resultStep++;renderDone();if(resultStep<10)phaseTimer=setTimeout(advance,resultStep%2===0?1500:1100);};
 phaseTimer=setTimeout(advance,850);
}
function spin(){
 stopMotion();if(game.phase!=='playing')return;
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
  if(mode==='bot'&&game.picks[1]===null)game=pick(game,1,botPick(game));
  render();return;
 }
 const token=motion;
 spinCards=[0,1].map(side=>{
  const selected=card(side),previous=game.round>0?BY_ID.get(game.decks[side][game.round-1]):null;
  const series=new Set(game.decks.flat().map(id=>BY_ID.get(id).seriesId)),pool=CHARACTERS.filter(character=>character.id!==selected.id&&character.id!==previous?.id&&(series.size>1||series.has(character.seriesId)));
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return previous?[previous,...pool.slice(0,9),selected]:[...pool.slice(0,10),selected];
 });
 rolling=true;spinReady=false;render();
 const urls=[...new Set(spinCards.flat().map(c=>c.image))];
 Promise.race([Promise.all(urls.map(src=>loadImage(src))),new Promise(r=>setTimeout(r,2500))]).then(()=>{
  if(token!==motion)return;spinReady=true;render();
  phaseTimer=setTimeout(()=>{if(token!==motion)return;rolling=false;
   if(mode==='bot'&&game.picks[1]===null)game=pick(game,1,botPick(game));
   render();
  },2200);
 });
}
function showReveal(before){
 stopMotion();const token=motion;
 reveal={decks:before.decks,round:before.round,picks:[...before.picks]};render();
 phaseTimer=setTimeout(()=>{if(token!==motion)return;reveal=null;if(game.phase==='playing')spin();else render();},1150);
}

function beginBot(){if(!botAdded)return;stopMotion();mode='bot';game=reduce(waiting(),{type:'start',data:{decks:makeDeal()}});status='';spin();}

async function inviteFriend(){
 if(inviting)return;
 if(!sdk?.game.invite){status='Найзаа Usion дотор урина.';render();return;}
 inviting=true;status='';render();
 try{
  const sent=await sdk.game.invite({maxPlayers:2});
  if(sent?.success&&mode!=='friend'){stopMotion();mode='friend';game=waiting();lastSequence=0;reported=false;syncReady=true;if(!players.length)players=[meId];present.add(meId);myReady=false;sendInfo();}
 }
 catch{status='Урилга нээгдсэнгүй. Дахин оролдоорой.';}
 finally{inviting=false;render();}
}

async function choose(stat){
 if(game.phase!=='playing'||rolling||reveal||game.picks[self()]!==null||game.slots[self()][stat]!==null||sending)return;
 if(mode==='bot'){
  const before=game;game=pick(game,0,stat);
  if(game.round>before.round)showReveal({...before,picks:[stat,before.picks[1]]});else render();
  return;
 }
 if(connection!=='connected')return;
 sending=true;render();
 try{await sdk.game.action('pick',{stat});}
 catch{status='Сонголт илгээгдсэнгүй. Дахин оролдоорой.';}
 finally{sending=false;render();}
}

async function startHall(){
 const ids=roster(),host=hostId();
 if(mode!=='friend'||meId!==host||ids.length<2||!ids.filter(id=>id!==host).every(isReady)||game.phase!=='waiting'||starting)return;
 starting=true;render();
 try{await sdk.game.action('start',{decks:makeDeal(),seats:[host,ids.find(id=>id!==host)]});}
 catch{status='Тоглоом эхэлсэнгүй. Холболтоо шалгаарай.';}
 finally{starting=false;render();}
}
function sendInfo(){try{sdk?.game.realtime?.('player_info',{name:playerName,avatar:playerAvatar,ready:myReady,sport});}catch{}}
function onRealtime(m){
 const type=m.action_type||m.type,data=m.action_data||m.data||{},actor=String(m.player_id||m.playerId||'');
 if(type!=='player_info'||!actor||actor===meId)return;
 const known=present.has(actor);present.add(actor);
 info[actor]={name:String(data.name||'').slice(0,40),avatar:/^https?:\/\//.test(data.avatar||'')?data.avatar:'',ready:!!data.ready};
 if(SPORTS[data.sport]&&actor===hostId()&&meId!==actor&&game.phase==='waiting'){sport=data.sport;setSport(sport);}
 if(!known)sendInfo();
 if(mode==='friend'&&game.phase==='waiting')render();
}

function applyMessage(m){
 const sequence=Number(m.sequence||0);if(sequence&&sequence<=lastSequence)return;
 const type=m.action_type||m.type,data=m.action_data||m.data||{},actor=m.player_id||m.playerId;
 if(type==='start'){const seats=Array.isArray(data.seats)&&data.seats.length===2?data.seats.map(String):null;if(seats){if(String(actor)!==seats[0]||game.phase!=='waiting')return;players=seats;}else if(actor!==players[0])return;}
 if(type==='pick'&&!players.includes(actor))return;
 const next=reduce(game,{type,data,seat:players.indexOf(actor)});
 if(next===game)return;
 const before=game;game=next;if(sequence)lastSequence=sequence;
 if(game.phase==='done'&&!replaying)report();
 if(!replaying){if(type==='start')spin();else if(game.round>before.round)showReveal({...before,picks:before.picks.map((p,i)=>i===players.indexOf(actor)?data.stat:p)});else render();}
}

function report(){
 if(reported||mode!=='friend'||players[0]!==meId||game.phase!=='done'||!sdk.game.reportResult)return;
 reported=true;const r=results(game),scores={[players[0]]:r.scores[0],[players[1]]:r.scores[1]};
 sdk.game.reportResult(r.winner===null?{draw:true,scores,displayScore:r.scores.join(' - ')}:{winnerId:players[r.winner],scores,displayScore:r.scores.join(' - ')}).catch(()=>{});
}

function sync(d){
 stopMotion();game=waiting();lastSequence=0;replaying=true;
 for(const m of [...(d.actions||[])].sort((a,b)=>(a.sequence||0)-(b.sequence||0)))applyMessage(m);
 replaying=false;syncReady=true;
 if(game.phase==='done')report();
 if(game.phase==='playing')spin();else render();
}

function connectUsion(U,config){
 sdk=U;const myIds=[config.userId,U.user.getId?.()].filter(Boolean).map(String),roomIds=(config.playerIds||[]).map(String);meId=myIds.find(id=>roomIds.includes(id))||myIds[0]||'';
 playerName=U.user.getName?.()||'ЧИ';playerAvatar=U.user.getAvatar?.()||'';
 const enter=async(roomId)=>{
  stopMotion();mode='friend';game=waiting();reported=false;syncReady=false;players=[...(U.getLaunchParams()?.playerIds||config.playerIds||[])].map(String);present=new Set([meId]);info={};myReady=false;render();
  try{await U.game.connect();await U.game.join(roomId);}catch{status='Өрөөнд холбогдсонгүй.';render();}
 };
 U.game.onAction(applyMessage);
 U.game.onRealtime?.(onRealtime);
 U.game.onSync(sync);
 U.game.onJoined(d=>{if(game.phase==='waiting'&&d.player_ids?.length)players=d.player_ids.map(String);present.add(meId);syncReady=true;sendInfo();render();});
 U.game.onPlayerJoined(d=>{if(game.phase==='waiting'&&d.player_ids?.length)players=d.player_ids.map(String);const id=String(d.player_id||d.playerId||'');if(id)present.add(id);syncReady=true;sendInfo();render();});
 U.game.onPlayerLeft(d=>{const id=String(d?.player_id||d?.playerId||'');if(id){present.delete(id);delete info[id];}if(game.phase!=='waiting')status='Өрсөлдөгч тоглолтоос гарлаа.';render();});
 U.game.onRoomAssigned(()=>{stopMotion();mode='friend';game=waiting();lastSequence=0;syncReady=false;reported=false;players=[...(U.getLaunchParams()?.playerIds||[])].map(String);present=new Set([meId]);info={};myReady=false;render();});
 U.game.onGameRestarted(()=>{stopMotion();game=waiting();lastSequence=0;reported=false;syncReady=true;myReady=false;for(const k in info)info[k].ready=false;status='';sendInfo();render();});
 U.game.onConnectionState?.(state=>{connection=state==='connected'||state==='reconnected'?'connected':state;render();});
 U.game.onError?.(error=>{status=error.message||'Холболтын алдаа';render();});
 const launch=U.getLaunchParams?.()||{};
 if(launch.mode==='multiplayer'&&config.roomId)enter(config.roomId);else render();
}

async function shareResult(destination){
 if(game.phase!=='done'||resultStep!==10||shareBusy||destination==='feed'&&feedPosted)return;
 const notice=root.querySelector('.share-status');
 const say=message=>{if(notice)notice.textContent=message;};
 if(destination==='feed'&&(!sdk?.shareToFeed||sdk.canShareToFeed&&!sdk.canShareToFeed('image'))){say('Usion дотор нээгээд Feed-д нийтлээрэй.');return;}
 shareBusy=true;root.querySelectorAll('[data-share]').forEach(button=>button.disabled=true);
 say('Зураг бэлдэж байна…');
 try{
  const r=results(game),image=await createResultCard(r,self(),playerName,otherName(),playerAvatar,otherAvatar());
  if(destination==='feed'){
   const response=await sdk.shareToFeed('image',{image,text:`Sport Clash · ${playerName} ${r.scores[self()]} : ${r.scores[foe()]} ${otherName()}`});
   if(response?.success){feedPosted=true;say('Usion Feed-д нийтлэгдлээ.');}
   else say(response?.cancelled?'':'Нийтлэх боломжгүй байна. Дахин оролдоорой.');
  }else{
   const filename='sport-clash-result.jpg';
   if(sdk?.shareToStory){
    let response,story=true;
    try{response=await sdk.shareToStory(image,{mimeType:'image/jpeg',filename,backgroundTopColor:'#192b50',backgroundBottomColor:'#090f20'});}
    catch(error){if(error?.code==='CANCELLED'||!sdk.shareFile)throw error;story=false;response=await sdk.shareFile(image,{filename,mimeType:'image/jpeg',title:'Sport Clash'});}
    say(response?.cancelled?'':story?'Instagram Story-д хуваалцах цонх нээгдлээ.':'Instagram руу share цонхноос сонгоорой.');
   }else if(sdk?.shareFile){
    const response=await sdk.shareFile(image,{filename,mimeType:'image/jpeg',title:'Sport Clash'});
    say(response?.cancelled?'':'Instagram руу share цонхноос сонгоорой.');
   }else{
    const blob=await(await fetch(image)).blob(),file=new File([blob],filename,{type:'image/jpeg'});
    if(navigator.canShare?.({files:[file]})){
     await navigator.share({files:[file],title:'Sport Clash'});
     say('Instagram руу share цонхноос сонгоорой.');
    }else{
     const link=document.createElement('a');link.href=image;link.download=filename;link.click();
     say('Зураг татагдлаа. Instagram Story-д оруулаарай.');
    }
   }
  }
 }catch(error){say(error?.name==='AbortError'?'':'Хуваалцах боломжгүй байна. Дахин оролдоорой.');}
 finally{shareBusy=false;root.querySelectorAll('[data-share]').forEach(button=>{button.disabled=button.dataset.share==='feed'&&feedPosted;});if(feedPosted){const button=root.querySelector('[data-share="feed"]');if(button){button.setAttribute('aria-label','Нийтлэгдсэн');button.title='Нийтлэгдсэн';}}}
}

root.addEventListener('click',event=>{
 const sp=event.target.closest('[data-sport]');if(sp){sport=sp.dataset.sport;setSport(sport);try{localStorage.setItem('sport-clash-sport',sport);}catch{}sendInfo();render();return;}
 if(event.target.closest('[data-play]')){botAdded=true;status='';beginBot();return;}
 if(event.target.closest('[data-bot]')){botAdded=true;status='';render();return;}
 if(event.target.closest('[data-invite]')){inviteFriend();return;}
 if(event.target.closest('[data-ready]')){myReady=!myReady;sendInfo();render();return;}
 if(event.target.closest('[data-hall-start]')){startHall();return;}
 if(event.target.closest('[data-hall-bot]')){try{sdk?.game.leave?.();}catch{}botAdded=true;beginBot();return;}
 const start=event.target.closest('[data-start]');if(start){beginBot();return;}
 const slot=event.target.closest('[data-slot]');if(slot){choose(Number(slot.dataset.slot));return;}
 const share=event.target.closest('[data-share]');if(share){shareResult(share.dataset.share);return;}
 if(event.target.closest('[data-again]')){if(mode==='bot')beginBot();else sdk?.game.requestRematch?.();}
});

render();
if(window.Usion)window.Usion.init(config=>connectUsion(window.Usion,config));
else if(!['localhost','127.0.0.1'].includes(location.hostname)){
 const script=document.createElement('script');script.src='https://usions.com/usion-sdk.js';
 script.onload=()=>window.Usion?.init(config=>connectUsion(window.Usion,config));
 document.head.append(script);
}
