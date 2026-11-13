/* CoachDW.com hero: fits the title and typed lines to the margins, shimmers
   STRENGTH FOR LIFE, types the two lines over the two photos and loops.
   After the first round it opens the welcome pop-up (first visit only). */
(function () {
const sflt=document.getElementById('sflt');
function fitSfl(){const box=sflt.parentElement,cs=getComputedStyle(box),w=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);sflt.style.fontSize='40px';sflt.style.fontSize=(40*w/sflt.getBoundingClientRect().width)+'px'}
function fitLines(){document.querySelectorAll('.line').forEach(el=>{const cs=getComputedStyle(el),w=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);el.style.fontSize='30px';const m=Math.max(...[...el.querySelectorAll('.ln')].map(l=>l.getBoundingClientRect().width));el.style.fontSize=(30*w/m)+'px'})}
const fitAll=()=>{fitSfl();fitLines()};
fitAll();addEventListener('resize',fitAll);document.fonts&&document.fonts.ready.then(fitAll);
function prep(el){const out=[];const walk=n=>{if(n.classList&&n.classList.contains('ln')){const before=out.length;walkKids(n);if(out.length>before)out[out.length-1].dataset.p=1;return}walkKids(n)};const walkKids=n=>{[...n.childNodes].forEach(k=>{if(k.nodeType===3){const f=document.createDocumentFragment();[...k.textContent].forEach(ch=>{const s=document.createElement('span');s.className='c';s.textContent=ch;s.setAttribute('aria-hidden','true');f.appendChild(s);out.push(s)});k.replaceWith(f)}else walk(k)})};walk(el);return out}
const caret=document.createElement('span');caret.className='caret';caret.setAttribute('aria-hidden','true');
document.querySelectorAll('.ln').forEach(l=>l.dataset.ln=1);
function type(cs,speed){return new Promise(res=>{let i=0;cs[0]&&cs[0].before(caret);const step=()=>{if(i>=cs.length){res();return}cs[i].classList.add('on');cs[i].after(caret);const ch=cs[i].textContent;i++;setTimeout(step,speed)};step()})}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const p1=document.getElementById('p1'),p2=document.getElementById('p2'),pb=document.getElementById('playbtn');
const pic=n=>{p1.classList.toggle('on',n===1);p2.classList.toggle('on',n===2);pb.classList.add('on')};
const T=[document.getElementById('t1'),document.getElementById('t3'),document.getElementById('t2')];
const P=[1,2,1];
const say=n=>T.forEach((t,i)=>t.classList.toggle('off',i!==n));
const reset=cs=>cs.forEach(c=>c.classList.remove('on'));
const popClosed=()=>new Promise(r=>{const t=setInterval(()=>{if(!(window.cdwWelcomeOpen&&window.cdwWelcomeOpen())){clearInterval(t);r()}},200)});
const open=()=>{if(window.cdwWelcomeAuto)window.cdwWelcomeAuto()};
(async()=>{if(reduce){document.querySelectorAll('.tw').forEach(e=>e.classList.remove('tw'));pic(1);say(0);await wait(3000);open();return}
const C=T.map(prep);let first=true;
while(true){
  for(let i=0;i<T.length;i++){
    reset(C[i]);say(i);pic(P[i]);
    sflt.classList.remove('shine');void sflt.offsetWidth;sflt.classList.add('shine');   // shimmer sweeps STRENGTH FOR LIFE just before each line types
    await wait(1450);
    await type(C[i],85);await wait(i===T.length-1?2200:1800);
    if(i===T.length-1&&first){first=false;open();await wait(300);await popClosed();await wait(800)}
    T[i].classList.add('off');await wait(i===T.length-1?700:200);
  }
}})();

})();

/* First screen: size the hero photo so the Join the Tribe button sits at the bottom of the screen on load */
(function () {
  var lastW = 0;
  function fitHero(force) {
    var img = document.getElementById('p1'), j = document.querySelector('.hero .jwrap');
    if (!img || !j) return;
    var w = window.innerWidth;
    if (!force && w === lastW) return; // ignore phone address-bar height changes
    lastW = w;
    var vh = window.innerHeight, root = document.documentElement;
    root.style.removeProperty('--phh');
    var cur = img.offsetHeight;
    var bottom = j.getBoundingClientRect().bottom + window.scrollY;
    var want = cur + (vh - 12 - bottom);
    want = Math.max(180, vh * 0.38, Math.min(want, w * 1.6));
    root.style.setProperty('--phh', Math.round(want) + 'px');
  }
  function all() { fitHero(true); }
  if (document.readyState === 'complete') all(); else window.addEventListener('load', all);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(all, 50); });
  window.addEventListener('resize', function () { fitHero(false); });
  window.addEventListener('orientationchange', function () { setTimeout(all, 300); });
})();
