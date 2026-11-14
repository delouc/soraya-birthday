
const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Flower curtain plays first; the birthday greeting types only after it clears.
const text='Happy Birthday, Soraya! ♡';
const title=$('#typed-title');
const curtain=$('#flower-curtain');
const blooms=$('#flower-curtain-blooms');
let introFinished=false;
let introTimers=[];
function later(fn,ms){const id=setTimeout(fn,ms);introTimers.push(id)}
function typeGreeting(){
  if(reduced){title.textContent=text;return}
  let index=0;
  const tick=()=>{
    if(index<text.length){title.textContent+=text[index++];later(tick,105)}
  };
  tick();
}
function finishIntro(){
  if(introFinished)return;
  introFinished=true;
  introTimers.forEach(clearTimeout);
  curtain.classList.add('depart');
  later(()=>{curtain.remove();document.body.classList.remove('intro-locked');typeGreeting()},reduced?0:1250);
}
if(reduced){finishIntro()}else{
  document.body.classList.add('intro-locked');
  const colors=['rose','lilac','cream','mauve'];
  // Dense, overlapping petals form a floral screen on both desktop and mobile.
  for(let i=0;i<100;i++){
    const bloom=document.createElement('span');
    bloom.className='curtain-bloom '+colors[i%colors.length];
    const col=i%10,row=Math.floor(i/10);
    const jitterX=Math.sin(i*13.17)*5;
    const jitterY=Math.cos(i*8.71)*6;
    bloom.style.setProperty('--x',(col*11-3+jitterX)+'%');
    bloom.style.setProperty('--y',(row*12-5+jitterY)+'%');
    bloom.style.setProperty('--rotation',((i*71)%360)+'deg');
    bloom.style.setProperty('--size',(105+(i*37)%110)+'px');
    bloom.style.setProperty('--delay',((i%13)*38)+'ms');
    blooms.append(bloom);
  }
  later(()=>curtain.classList.add('opening'),2050);
  later(finishIntro,3750);
}
$('#skip-intro').addEventListener('click',finishIntro);

const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>obs.observe(el));function progress(){const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?scrollY/max*100:0)+'%'}addEventListener('scroll',progress,{passive:true});progress();
const env=$('#envelope'),letter=$('#letter');let letterTimer;env.addEventListener('click',()=>{clearTimeout(letterTimer);const open=env.classList.toggle('open');env.setAttribute('aria-expanded',String(open));$('#envelope-hint').textContent=open?'tap again to close the letter':'tap to break the seal';if(open)letterTimer=setTimeout(()=>letter.classList.add('visible'),550);else letter.classList.remove('visible')});
const defaults=['Loves reading','A little competitive','Has a beautiful laugh','Loves netball','Has a big heart','Loves surprises','Dreams big','A comfort-food expert','Makes people smile'];let bingo;try{bingo=JSON.parse(localStorage.getItem('birthdayBingoV1'))||defaults.map(text=>({text,marked:false}))}catch{bingo=defaults.map(text=>({text,marked:false}))}if(!Array.isArray(bingo)||bingo.length!==9)bingo=defaults.map(text=>({text,marked:false}));const grid=$('#bingo-grid');function saveBingo(){try{localStorage.setItem('birthdayBingoV1',JSON.stringify(bingo))}catch{}}function renderBingo(){grid.innerHTML='';bingo.forEach((item,i)=>{const cell=document.createElement('div');cell.className='bingo-cell'+(item.marked?' marked':'');cell.dataset.index=i;const input=document.createElement('input');input.value=item.text;input.maxLength=50;input.setAttribute('aria-label','Bingo square '+(i+1));input.addEventListener('input',()=>{bingo[i].text=input.value;saveBingo()});const btn=document.createElement('button');btn.className='mark-btn';btn.textContent=item.marked?'Unmark':'Mark ♡';btn.setAttribute('aria-pressed',String(item.marked));btn.addEventListener('click',()=>mark(i));cell.addEventListener('dragover',e=>e.preventDefault());cell.addEventListener('drop',e=>{e.preventDefault();mark(i,true)});cell.append(input,btn);grid.append(cell)});const count=bingo.filter(x=>x.marked).length;$('#bingo-result').textContent=count===9?'BINGO! Every little part of you is worth celebrating ♡':count>=5?'look at all the lovely things that make you, you ♡':'you make ordinary things extraordinary ♡'}function mark(i,val){bingo[i].marked=val===undefined?!bingo[i].marked:val;saveBingo();renderBingo()}renderBingo();$('#drag-marker').addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain','circle'));let dragging=false;const marker=$('#drag-marker');marker.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;dragging=true;marker.setPointerCapture(e.pointerId)});marker.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const cell=document.elementFromPoint(e.clientX,e.clientY)?.closest('.bingo-cell');if(cell)mark(Number(cell.dataset.index),true)});
function placeholder(label,w=700,h=700){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#6e5b79"/><stop offset="1" stop-color="#302439"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="${w/2}" cy="${h/2-70}" r="${Math.min(w,h)/8}" fill="#c5a7c5" opacity=".28"/><path d="M0 ${h*.83} Q ${w*.45} ${h*.4} ${w} ${h*.83} V${h} H0" fill="#c5a7c5" opacity=".2"/><text x="50%" y="78%" font-size="${Math.min(w,h)/21}" text-anchor="middle" fill="#f2dfed" font-family="Georgia">${label}</text><text x="50%" y="88%" font-size="${Math.min(w,h)/15}" text-anchor="middle" fill="#e2c5e1">♡</text></svg>`;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
$('#portrait-photo').src='images/her.jpeg';
$('#memory-1').src = 'images/memory1.jpeg';
$('#memory-2').src = 'images/memory2-new.jpeg';
$('#memory-3').src = 'images/memory3.jpeg';
let puzzleImage='images/puzzle.jpeg';let tiles=[...Array(9).keys()],selected=null;const puzzleGrid=$('#puzzle-grid');function shuffle(){tiles=[...Array(9).keys()];for(let i=tiles.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]]}if(tiles.every((v,i)=>v===i))[tiles[0],tiles[1]]=[tiles[1],tiles[0]];selected=null;renderPuzzle()}function renderPuzzle(){puzzleGrid.innerHTML='';tiles.forEach((piece,i)=>{const btn=document.createElement('button');btn.className='puzzle-tile'+(selected===i?' selected':'');btn.style.backgroundImage=`url("${puzzleImage}")`;btn.style.backgroundPosition=`${piece%3*50}% ${Math.floor(piece/3)*50}%`;btn.setAttribute('aria-label','Puzzle tile '+(i+1));btn.setAttribute('aria-pressed',String(selected===i));btn.addEventListener('click',()=>{if(selected===null){selected=i;renderPuzzle();return}if(selected!==i)[tiles[selected],tiles[i]]=[tiles[i],tiles[selected]];selected=null;renderPuzzle();if(tiles.every((v,j)=>v===j))$('#puzzle-status').textContent='You put every piece back together! I love making memories with you ♡'});puzzleGrid.append(btn)})}$('#shuffle-puzzle').addEventListener('click',()=>{$('#puzzle-status').textContent='Choose two pieces to swap them ♡';shuffle()});shuffle();

