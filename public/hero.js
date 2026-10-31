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
const t1=document.getElementById('t1'),t2=document.getElementById('t2');
const say=n=>{t1.classList.toggle('off',n!==1);t2.classList.toggle('off',n!==2)};
const reset=cs=>cs.forEach(c=>c.classList.remove('on'));
const popClosed=()=>new Promise(r=>{const t=setInterval(()=>{if(!(window.cdwWelcomeOpen&&window.cdwWelcomeOpen())){clearInterval(t);r()}},200)});
const open=()=>{if(window.cdwWelcomeAuto)window.cdwWelcomeAuto()};
(async()=>{if(reduce){document.querySelectorAll('.tw').forEach(e=>e.classList.remove('tw'));pic(1);say(1);await wait(3000);open();return}
const c1=prep(t1),c2=prep(t2);let first=true;
while(true){
  reset(c1);say(1);pic(1);sflt.classList.remove('shine');void sflt.offsetWidth;sflt.classList.add('shine');await wait(1500);
  await type(c1,85);await wait(1800);
  t1.classList.add('off');pic(2);await wait(500);
  reset(c2);t2.classList.remove('off');
  await type(c2,85);await wait(2200);
  if(first){first=false;open();await wait(300);await popClosed();await wait(800)}
  t2.classList.add('off');await wait(700);
}})();

})();
