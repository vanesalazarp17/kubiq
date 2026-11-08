(()=>{'use strict';
const quiz=document.querySelector('#kubiq-creator-quiz');
if(quiz){
 const steps=[
  {q:'¿Qué te gustaría crear?',opts:[['Un videojuego con personajes e historias','scratch'],['Un mundo 3D que otros puedan explorar','roblox'],['Un programa que resuelva un reto','python']]},
  {q:'¿Qué actividad te entusiasma más?',opts:[['Diseñar personajes, animaciones y reglas','scratch'],['Construir escenarios y experiencias 3D','roblox'],['Descubrir cómo funciona el código','python']]},
  {q:'¿Qué reto elegirías?',opts:[['Crear un juego con niveles y desafíos','scratch'],['Diseñar un mundo interactivo','roblox'],['Programar una herramienta o solución','python']]}
 ];
 const data={scratch:{name:'Scratch',copy:'Una ruta visual para crear historias, animaciones y videojuegos. Puedes comenzar con Scratch Inicial o avanzar a Scratch Avanzado.',img:'imagenes/course-scratch-inicial.gif',href:'programas/scratch/index.html'},roblox:{name:'Roblox Studio',copy:'Una ruta para construir escenarios, mundos 3D y experiencias interactivas con Roblox Studio.',img:'imagenes/course-roblox-inicial.gif',href:'programas/roblox/index.html'},python:{name:'Python',copy:'Una ruta para aprender programación textual, resolver retos y desarrollar proyectos con código.',img:'imagenes/course-python-inicial.gif',href:'programas/python/index.html'}};
 let step=0,score={scratch:0,roblox:0,python:0};
 const q=quiz.querySelector('[data-quiz-question]'),opts=quiz.querySelector('[data-quiz-options]'),label=quiz.querySelector('[data-quiz-step-label]'),bar=quiz.querySelector('[data-quiz-progress]'),result=quiz.querySelector('[data-quiz-result]'),reset=quiz.querySelector('[data-quiz-reset]');
 function render(){const s=steps[step];q.textContent=s.q;label.textContent=`Pregunta ${step+1} de ${steps.length}`;bar.style.width=`${((step+1)/steps.length)*100}%`;opts.hidden=false;result.hidden=true;reset.hidden=true;opts.replaceChildren();s.opts.forEach(([txt,route])=>{const b=document.createElement('button');b.type='button';b.className='creator-quiz-option';b.textContent=txt;b.addEventListener('click',()=>{score[route]++;if(step<steps.length-1){step++;render()}else showResult()});opts.append(b)})}
 function showResult(){opts.hidden=true;label.textContent='Tu recomendación está lista';bar.style.width='100%';const winner=Object.keys(score).sort((a,b)=>score[b]-score[a])[0],d=data[winner];quiz.querySelector('[data-quiz-result-title]').textContent=d.name;quiz.querySelector('[data-quiz-result-copy]').textContent=d.copy;const img=quiz.querySelector('[data-quiz-logo]');img.src=d.img;img.alt=`Logo de ${d.name} de KUBIQ Academy`;quiz.querySelector('[data-quiz-result-link]').href=d.href;result.hidden=false;reset.hidden=false}
 reset.addEventListener('click',()=>{step=0;score={scratch:0,roblox:0,python:0};render()});render();
}

const reviewTrack=document.querySelector('.v91-review-track');
if(reviewTrack){
 const cards=[...reviewTrack.querySelectorAll('.v91-review-card')];
 const dots=[...document.querySelectorAll('[data-review-dot]')];
 const prev=document.querySelector('[data-review-prev]');
 const next=document.querySelector('[data-review-next]');
 let active=0;
 const go=(index)=>{active=(index+cards.length)%cards.length;cards[active].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'start'});dots.forEach((d,i)=>{d.classList.toggle('is-active',i===active);d.setAttribute('aria-current',i===active?'true':'false')})};
 prev?.addEventListener('click',()=>go(active-1));next?.addEventListener('click',()=>go(active+1));
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>go(i)));
 let scrollTimer;reviewTrack.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const left=reviewTrack.getBoundingClientRect().left;let best=0,dist=Infinity;cards.forEach((card,i)=>{const d=Math.abs(card.getBoundingClientRect().left-left);if(d<dist){dist=d;best=i}});active=best;dots.forEach((d,i)=>{d.classList.toggle('is-active',i===active);d.setAttribute('aria-current',i===active?'true':'false')})},80)},{passive:true});
}

const track=document.querySelector('#misiones .mission-track');
if(track){const cards=[...track.querySelectorAll('.v71-mission-card')];const prev=document.querySelector('[data-mission-prev]'),next=document.querySelector('[data-mission-next]');const move=dir=>{const card=cards[0];const gap=parseFloat(getComputedStyle(track).gap)||16;track.scrollBy({left:dir*(card.getBoundingClientRect().width+gap),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};prev?.addEventListener('click',()=>move(-1));next?.addEventListener('click',()=>move(1));const update=()=>{if(!prev||!next)return;const max=track.scrollWidth-track.clientWidth;prev.disabled=track.scrollLeft<4;next.disabled=track.scrollLeft>=max-4;prev.style.opacity=prev.disabled?'.45':'1';next.style.opacity=next.disabled?'.45':'1'};track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update()}
})();
