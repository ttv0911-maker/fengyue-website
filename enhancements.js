// Scroll count-up preserves the original text and its accessible final value.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const counters=[...document.querySelectorAll('.counter')];
const numberFormat=new Intl.NumberFormat('en-US');
const counterData=counters.map(el=>({el,final:el.textContent,values:[...el.textContent.matchAll(/[\d,]+/g)].map(m=>Number(m[0].replaceAll(',','')))}));
function renderCounter(item,progress){let i=0;item.el.textContent=item.final.replace(/[\d,]+/g,()=>numberFormat.format(Math.round(item.values[i++]*progress)))}
function counterDuration(item){const largest=Math.max(...item.values);return largest>=10000?650:largest>=100?950:1800}
if(!reducedMotion.matches&&'IntersectionObserver' in window){
 counterData.forEach(item=>renderCounter(item,0));
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const item=counterData.find(x=>x.el===entry.target);observer.unobserve(item.el);const duration=counterDuration(item);let start;function frame(now){start??=now;const t=Math.min(1,(now-start)/duration);renderCounter(item,1-Math.pow(1-t,3));if(t<1)requestAnimationFrame(frame);else item.el.textContent=item.final}requestAnimationFrame(frame)}),{threshold:.6});
 counterData.forEach(item=>observer.observe(item.el));
}
document.querySelectorAll('[data-social]').forEach(button=>button.onclick=()=>{if(button.dataset.social==='chat')location.href='mailto:sale@fengyuestone.com';else show(button.getAttribute('aria-label'),'The official channel link will be added before launch.')});
// Catalogue filtering: selected status buttons are ORed, then combined with colour and search.
const catalog=document.querySelector('.catalog');
if(catalog){
 const stones=[...catalog.querySelectorAll('.stone')],input=catalog.querySelector('.catalog-search input'),trigger=catalog.querySelector('.color-trigger'),options=catalog.querySelector('.color-options'),reset=catalog.querySelector('.reset-filters'),count=catalog.querySelector('.result-count'),pagination=catalog.querySelector('.pagination');
 function filter(){const colour=catalog.querySelector('[name=colour]:checked').value,statuses=[...catalog.querySelectorAll('[data-status-filter][aria-pressed=true]')].map(x=>x.dataset.statusFilter),term=input.value.trim().toLowerCase();let n=0;stones.forEach(stone=>{stone.hidden=!((colour==='all'||stone.dataset.color===colour)&&(!statuses.length||statuses.includes(stone.dataset.status))&&(!term||stone.textContent.toLowerCase().includes(term)));if(!stone.hidden)n++});const active=colour!=='all'||statuses.length>0||!!term;count.textContent=`${n} ${n===1?'stone':'stones'}`;reset.hidden=!active;catalog.querySelector('.catalog-empty').hidden=n!==0;pagination.hidden=active||n===0;trigger.querySelector('.selected-colour').textContent=colour==='all'?'All colours':colour[0].toUpperCase()+colour.slice(1);}
 trigger.onclick=()=>{const open=trigger.getAttribute('aria-expanded')!=='true';trigger.setAttribute('aria-expanded',open);options.hidden=!open};
 catalog.querySelectorAll('[name=colour]').forEach(radio=>radio.onchange=()=>{filter();options.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.focus()});
 catalog.querySelectorAll('[data-status-filter]').forEach(button=>button.onclick=()=>{button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')!=='true');filter()});input.oninput=filter;
 reset.onclick=()=>{catalog.querySelector('[name=colour][value=all]').checked=true;catalog.querySelectorAll('[data-status-filter]').forEach(b=>b.setAttribute('aria-pressed','false'));input.value='';filter()};
 document.addEventListener('click',e=>{if(!e.target.closest('.color-filter')){options.hidden=true;trigger.setAttribute('aria-expanded','false')}});catalog.addEventListener('keydown',e=>{if(e.key==='Escape'){options.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.focus()}});filter();
}
