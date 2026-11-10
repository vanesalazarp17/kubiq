const yearElement=document.getElementById('year');if(yearElement)yearElement.textContent=new Date().getFullYear();const institutionForm=document.getElementById('institutionForm');if(institutionForm)institutionForm.addEventListener('submit',function(e){e.preventDefault();if(!this.reportValidity())return;const form=new FormData(this);const labels={nombre:'Persona de contacto', 'correo institucional':'Correo institucional', teléfono:'WhatsApp de contacto', institución:'Institución', cargo:'Cargo', 'ciudad y país':'Ciudad y país', interés:'Interés institucional', 'niveles y edades':'Niveles o edades', participantes:'Número aproximado de participantes', periodo:'Periodo estimado', mensaje:'Mensaje'};const lines=['Solicitud de información institucional — KUBIQ ACADEMY','',...Array.from(form.entries()).filter(([k])=>k!=='consentimiento').map(([k,v])=>(labels[k]||k)+': '+v),'','Autorización para gestionar esta solicitud: Sí'];const message=lines.join('\n');window.open('https://wa.me/593984538209?text='+encodeURIComponent(message),'_blank','noopener');});


/* KUBIQ V59 — shared interactions for the schools page */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.createElement('div');
  progress.id = 'kubiq-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const bar = progress.firstElementChild;
  let busy = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    document.body.classList.toggle('kubiq-scrolled', window.scrollY > 18);
    busy = false;
  };
  const onScroll = () => { if (!busy) { requestAnimationFrame(update); busy = true; } };
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  update();
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('.reveal');
    if (items.length) {
      document.body.classList.add('motion-ready');
      const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      }), {rootMargin:'0px 0px -7% 0px', threshold:.08});
      items.forEach(item => observer.observe(item));
    }
  }
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.course-card,.trust-highlight,.pillar,.project-card,.school-skill,.faq-item').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect=card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${event.clientX-rect.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY-rect.top}px`);
      }, {passive:true});
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--spot-x','50%');card.style.setProperty('--spot-y','50%');
      }, {passive:true});
    });
  }
})();
