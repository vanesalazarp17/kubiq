document.getElementById('year').textContent=new Date().getFullYear();document.getElementById('institutionForm').addEventListener('submit',function(e){e.preventDefault();if(!this.reportValidity())return;const form=new FormData(this);const recipient='vane32311@gmail.com';const lines=['Solicitud de información institucional — KUBIQ ACADEMY','',...Array.from(form.entries()).map(([k,v])=>k+': '+v),'','Autorización de contacto: Sí'];const subject='Solicitud institucional — '+(form.get('institución')||'KUBIQ ACADEMY');const mailto='mailto:'+recipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));document.getElementById('formHint').textContent='Se abrirá tu aplicación de correo con los datos de la solicitud. Revisa el destinatario y el contenido y pulsa Enviar.';window.location.href=mailto;});


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
