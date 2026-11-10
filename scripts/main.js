const menuButton = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    menuButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? '×' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }));
    document.getElementById('year').textContent = new Date().getFullYear();

    // Launch banner: open the existing enrollment form and allow dismissal.
    (() => {
      const banner = document.getElementById('launchBanner');
      if (!banner) return;
      const dismiss = () => banner.classList.add('is-hidden');
      const shell = document.getElementById('siteStickyShell');
      const updateStickyOffset = () => document.documentElement.style.setProperty('--sticky-stack-height', `${shell ? shell.getBoundingClientRect().height : 90}px`);
      banner.querySelectorAll('.launch-banner-close').forEach(button => button.addEventListener('click', () => { dismiss(); requestAnimationFrame(updateStickyOffset); }));
      banner.querySelectorAll('.launch-banner-action,.launch-mobile-cta').forEach(button => button.addEventListener('click', () => openEnrollment('')));
      updateStickyOffset();
      window.addEventListener('resize', updateStickyOffset, {passive:true});
      if (window.ResizeObserver && shell) new ResizeObserver(updateStickyOffset).observe(shell);
    })();

    // Restrained KUBIQ highlights: only descriptive paragraphs and key section titles.
    (() => {
      const terms = ['aprendizaje online','programación','tecnología','robótica'];
      const pattern = new RegExp('(' + terms.sort((a,b)=>b.length-a.length).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|') + ')','gi');
      const allowed = 'p, h1, h2';
      const excluded = 'footer,.course-card,.course-modal,.project-card,.projects-section,.reviews-section,.review-card,.faq-section,.faq-item,.launch-banner,.social-links,.brand-highlight,button,a,script,style';
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || !parent.closest(allowed) || parent.closest(excluded)) return NodeFilter.FILTER_REJECT;
          pattern.lastIndex=0;
          return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        pattern.lastIndex=0;
        const value=node.nodeValue, fragment=document.createDocumentFragment(); let last=0, match;
        while((match=pattern.exec(value))){
          fragment.append(document.createTextNode(value.slice(last,match.index)));
          const span=document.createElement('span'); span.className='brand-highlight'; span.textContent=match[0]; fragment.append(span); last=match.index+match[0].length;
        }
        fragment.append(document.createTextNode(value.slice(last))); node.parentNode.replaceChild(fragment,node);
      });
    })();

const courseDetails={
"scratch-inicial":{title:"Scratch Inicial",level:"Nivel inicial",age:"8 a 11 años",sessions:24,duration:60,image:"imagenes/course-scratch-inicial.gif",description:"Una primera experiencia con la programación visual por bloques. El estudiante aprende a dar instrucciones paso a paso y convierte sus ideas en historias, animaciones y juegos sencillos. Explora cómo una secuencia de instrucciones puede dar vida a personajes y situaciones.",topics:["Interfaz de Scratch: escenario, objetos, disfraces y bloques","Secuencias, eventos, movimiento, sonidos y apariencia","Animaciones, diálogos e historias interactivas","Reglas, pruebas y depuración de programas","Aplicaciones de la lógica secuencial en retos matemáticos"],skills:["Pensamiento lógico y secuencial","Creatividad para diseñar personajes e historias","Descomposición de retos en pasos pequeños","Autonomía para probar, detectar y corregir errores"],project:"Al finalizar, podrá crear una historia animada o un videojuego sencillo con personajes, escenarios, sonidos e interacciones.",prerequisites:"No requiere experiencia previa. Recomendado para quienes comienzan a explorar la programación."},
"scratch-avanzado":{title:"Scratch Avanzado",level:"Nivel avanzado",age:"9 a 12 años",sessions:28,duration:60,image:"imagenes/course-scratch-avanzado.gif",description:"Para estudiantes que ya conocen los fundamentos de Scratch y quieren crear proyectos con más interacciones, reglas y desafíos. Se profundiza en la lógica que organiza los juegos y en cómo hacer que los elementos respondan a distintas situaciones.",topics:["Condiciones, ciclos, variables y operadores","Mensajes entre objetos y sincronización de acciones","Diseño de niveles, puntajes, vidas y reglas de juego","Depuración, pruebas y mejora de proyectos interactivos","Descomposición de problemas y razonamiento lógico-matemático"],skills:["Razonamiento lógico y pensamiento algorítmico","Diseño de soluciones con varias condiciones","Planificación y organización de proyectos","Persistencia y análisis al corregir errores"],project:"Podrá desarrollar un videojuego de varios niveles con puntajes, reglas, personajes interactivos y condiciones de victoria o desafío.",prerequisites:"Conviene conocer los bloques básicos de Scratch o realizar una orientación previa para confirmar el nivel."},
"roblox-inicial":{title:"Roblox Studio Inicial",level:"Nivel inicial",age:"10 a 13 años",sessions:28,duration:60,image:"imagenes/course-roblox-inicial.gif",description:"Una introducción al entorno de Roblox Studio para aprender cómo se construyen mundos digitales. El estudiante explora herramientas de construcción, organiza objetos y comprende los elementos que forman una experiencia interactiva.",topics:["Interfaz, paneles y herramientas principales de Roblox Studio","Construcción de escenarios, terrenos y espacios tridimensionales","Objetos, propiedades, materiales e iluminación básica","Coordenadas, escalas y organización espacial","Principios de geometría aplicados al diseño 3D"],skills:["Pensamiento espacial y diseño 3D","Creatividad para construir mundos y escenarios","Atención al detalle y organización de elementos","Resolución de problemas mediante pruebas"],project:"Podrá construir un escenario o pequeño recorrido interactivo en Roblox Studio y presentarlo como una experiencia propia.",prerequisites:"No es indispensable haber creado juegos antes; interés por el diseño y la creación digital es suficiente."},
"roblox-avanzado":{title:"Roblox Studio Avanzado",level:"Nivel avanzado",age:"12 a 16 años",sessions:32,duration:70,image:"imagenes/course-roblox-avanzado.gif",description:"Una ruta para desarrollar experiencias más completas en Roblox Studio, combinando construcción, lógica de juego y scripts en Lua. El estudiante aprende a programar comportamientos y a conectar las acciones del jugador con los elementos del mundo.",topics:["Fundamentos de scripting con Lua: variables, funciones y eventos","Scripts para controlar objetos, acciones y comportamientos","Mecánicas de juego, interacción y lógica de experiencia","Pruebas, depuración y optimización de una experiencia","Pensamiento algorítmico y resolución estructurada de problemas"],skills:["Pensamiento computacional y programación textual","Comprensión de eventos y relaciones causa-efecto","Diseño de mecánicas y experiencias de usuario","Depuración y trabajo iterativo"],project:"Podrá crear una experiencia jugable con mecánicas programadas, interacciones y comportamientos personalizados mediante scripts.",prerequisites:"Recomendado para quienes ya manejan las herramientas básicas de Roblox Studio; el nivel se confirma antes de la inscripción."},
"python-inicial":{title:"Python Inicial",level:"Nivel inicial",age:"13 a 17 años",sessions:40,duration:70,image:"imagenes/course-python-inicial.gif",description:"Una introducción a la programación textual con Python. El estudiante aprende a escribir instrucciones, interpretar resultados y resolver problemas pequeños usando un lenguaje utilizado en múltiples áreas tecnológicas.",topics:["Sintaxis, variables, tipos de datos y entrada/salida","Operadores y expresiones para procesar información","Condicionales y ciclos para controlar el flujo del programa","Funciones básicas y ejercicios prácticos","Resolución de problemas y aplicación de operaciones matemáticas con código"],skills:["Pensamiento lógico y estructuración de instrucciones","Lectura y escritura de código","Resolución paso a paso de problemas","Análisis de resultados y corrección de errores"],project:"Podrá desarrollar programas sencillos como cuestionarios, calculadoras, juegos de preguntas o herramientas que procesen datos básicos.",prerequisites:"No exige experiencia previa en Python. Se recomienda comodidad básica usando una computadora y seguir instrucciones escritas."},
"python-avanzado":{title:"Python Avanzado",level:"Nivel avanzado",age:"14 a 17 años",sessions:40,duration:70,image:"imagenes/course-python-avanzado.gif",description:"Para estudiantes que ya conocen las bases de Python y quieren escribir programas mejor organizados y resolver retos de mayor complejidad. La práctica se centra en estructurar soluciones, reutilizar código y construir proyectos con varias partes.",topics:["Funciones, parámetros, retorno y módulos","Listas, diccionarios y otras estructuras de datos","Manejo de errores, depuración y lectura de mensajes","Organización del código y desarrollo de proyectos integradores","Lectura, organización y análisis básico de datos"],skills:["Abstracción y pensamiento algorítmico","Diseño de programas modulares y reutilizables","Análisis y depuración sistemática","Planificación de proyectos de mayor complejidad"],project:"Podrá desarrollar un programa estructurado que combine funciones y estructuras de datos para resolver una necesidad concreta, documentando y probando su funcionamiento.",prerequisites:"Requiere bases de Python: variables, condicionales, ciclos y funciones. Si hay dudas, KUBIQ orientará sobre el nivel adecuado."}};
document.querySelectorAll('.course-card[data-course]').forEach(card=>{
  const course=courseDetails[card.dataset.course];
  const age=card.querySelector('.course-age');
  if(course&&age){
    const textNode=[...age.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
    if(textNode) textNode.nodeValue=course.age;
    else age.append(document.createTextNode(course.age));
    let duration=card.querySelector('.course-duration');if(!duration){duration=document.createElement('span');duration.className='course-duration';age.parentElement.appendChild(duration);}duration.textContent=(course.sessions||32)+' clases · '+course.duration+' min/clase';
  }
});
const backdrop=document.getElementById('courseModalBackdrop'), closeBtn=backdrop.querySelector('.course-modal-close');const courseProgramLink=document.getElementById('courseProgramLink');if(courseProgramLink){courseProgramLink.addEventListener('click',event=>{event.preventDefault();const destination=courseProgramLink.href;if(destination&&destination!=='about:blank')window.location.assign(destination);});}let lastTrigger=null;let enrollmentReturnFocus=null;const syncModalScroll=()=>{document.body.style.overflow=(backdrop.classList.contains('open')||enrollBackdrop?.classList.contains('open'))?'hidden':''};
function openCourse(card){const c=courseDetails[card.dataset.course];if(!c)return;lastTrigger=card;document.getElementById('courseModalImage').src=c.image;document.getElementById('courseModalImage').alt='Ilustración de '+c.title;document.getElementById('courseModalTitle').textContent=c.title;document.getElementById('courseModalLevel').textContent=c.level;document.getElementById('courseModalAge').textContent='Edad recomendada: '+c.age+' · '+c.duration+' min por sesión · 1 vez por semana';document.getElementById('courseProgramLink').href=new URL('./programas/'+(card.dataset.course.startsWith('scratch')?'scratch':card.dataset.course.startsWith('roblox')?'roblox':'python')+'/index.html',document.baseURI).href;document.getElementById('courseModalDescription').textContent=c.description;let pre=document.getElementById('courseModalPrereq');if(!pre){pre=document.createElement('p');pre.id='courseModalPrereq';pre.className='course-modal-footnote';document.getElementById('courseModalTopics').parentElement.insertBefore(pre,document.querySelector('.course-modal-actions'));}pre.textContent='Preparación previa: '+c.prerequisites;const list=document.getElementById('courseModalTopics');list.replaceChildren(...c.topics.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));const skills=document.getElementById('courseModalSkills');skills.replaceChildren(...c.skills.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));const msg='Hola KUBIQ ACADEMY, quiero información para inscribir a mi hijo/a en '+c.title+' ('+c.age+'). ¿Me pueden orientar sobre el proceso, horarios y costos?';document.getElementById('courseEnrollBtn').onclick=()=>openEnrollment(c.title);/* La reserva de la clase de prueba se gestiona desde la página de experiencia; este modal no incluye ese botón. */backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');syncModalScroll();closeBtn.focus()}
function closeCourse(){backdrop.classList.remove('open');backdrop.setAttribute('aria-hidden','true');syncModalScroll();if(!enrollBackdrop.classList.contains('open')&&lastTrigger)lastTrigger.focus()}
document.querySelectorAll('.course-open').forEach(card=>{
  card.addEventListener('click',event=>{if(event.target.closest('a,button'))return;openCourse(card)});
  card.addEventListener('keydown',event=>{if(event.target===card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openCourse(card)}});
});closeBtn.addEventListener('click',closeCourse);backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeCourse()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&backdrop.classList.contains('open')&&!enrollBackdrop?.classList.contains('open'))closeCourse()});

const enrollBackdrop=document.getElementById('enrollBackdrop'), enrollClose=enrollBackdrop.querySelector('.enroll-close'), enrollForm=document.getElementById('enrollForm');
function openEnrollment(courseName=''){enrollmentReturnFocus=document.activeElement;document.getElementById('enrollCourse').value=courseName;document.getElementById('enrollStatus').textContent='';enrollBackdrop.classList.add('open');enrollBackdrop.setAttribute('aria-hidden','false');syncModalScroll();enrollClose.focus()}
function closeEnrollment(){enrollBackdrop.classList.remove('open');enrollBackdrop.setAttribute('aria-hidden','true');syncModalScroll();if(backdrop.classList.contains('open'))document.getElementById('courseEnrollBtn')?.focus();else if(enrollmentReturnFocus?.isConnected)enrollmentReturnFocus.focus()}
enrollClose.addEventListener('click',closeEnrollment);enrollBackdrop.addEventListener('click',e=>{if(e.target===enrollBackdrop)closeEnrollment()});

enrollForm.addEventListener('submit',event=>{event.preventDefault();if(!enrollForm.reportValidity())return;const consent=document.getElementById('enrollConsent');if(!consent?.checked){consent?.focus();return;}const data=new FormData(enrollForm);const details=[
'Solicitud de inscripción — KUBIQ ACADEMY','',
'Representante: '+data.get('representante'),'Correo: '+data.get('email'),'WhatsApp: '+data.get('whatsapp'),'Estudiante: '+data.get('estudiante'),'Edad: '+data.get('edad'),'Curso: '+data.get('curso'),'Frecuencia: '+data.get('frecuencia'),'País: '+data.get('pais'),'Días preferidos: '+(data.getAll('dias').join(', ')||'Sin preferencia indicada'),'Franjas horarias: '+(data.getAll('franja').join(', ')||'Sin preferencia indicada'),'Detalle de disponibilidad: '+(data.get('horario')||'Sin detalle adicional'),
'Por favor, compartir el precio total del programa, disponibilidad, condiciones y opciones de pago por escrito. Esta solicitud no confirma matrícula ni pago.'
].join('\n');document.getElementById('enrollStatus').textContent='Se abrirá WhatsApp con tu solicitud. Envíala para recibir orientación y el detalle de precios y condiciones. No se realiza ningún cobro en este paso.';window.open('https://wa.me/593984538209?text='+encodeURIComponent(details),'_blank','noopener');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&enrollBackdrop.classList.contains('open'))closeEnrollment()});
// Keep keyboard focus inside the topmost dialog while it is open.
document.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const activeDialog=enrollBackdrop.classList.contains('open')?enrollBackdrop.querySelector('[role=dialog]'):(backdrop.classList.contains('open')?backdrop.querySelector('[role=dialog]'):null);if(!activeDialog)return;const items=[...activeDialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});





// Trial bookings are handled by the Cal.com embed below.

    // Accessible review carousel: arrow controls, scroll counter, touch/trackpad support.
    (() => {
      const rail = document.getElementById('reviewsCarousel');
      if (!rail) return;
      const cards = [...rail.querySelectorAll('.review-card')];
      const prev = document.querySelector('.review-prev');
      const next = document.querySelector('.review-next');
      const counter = document.querySelector('.reviews-counter');
      const step = () => {
        const card = cards[0];
        return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap || 16) : rail.clientWidth;
      };
      const update = () => {
        const index = Math.min(cards.length, Math.max(1, Math.round(rail.scrollLeft / step()) + 1));
        if (counter) counter.textContent = `${index} / ${cards.length}`;
        if (prev) prev.disabled = rail.scrollLeft <= 2;
        if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
      };
      prev?.addEventListener('click', () => rail.scrollBy({left: -step(), behavior: 'smooth'}));
      next?.addEventListener('click', () => rail.scrollBy({left: step(), behavior: 'smooth'}));
      rail.addEventListener('scroll', () => window.requestAnimationFrame(update), {passive:true});
      window.addEventListener('resize', update);
      update();
    })();

    // Project carousel: looping arrows, pagination, autoplay, touch and keyboard support.
    (() => {
      const rail = document.getElementById('projectsCarousel');
      if (!rail) return;
      const cards = [...rail.querySelectorAll('.project-card')];
      const prev = document.querySelector('.projects-prev');
      const next = document.querySelector('.projects-next');
      const dots = [...document.querySelectorAll('.projects-pagination button')];
      if (!cards.length) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap || 16);
      const activeIndex = () => {
        const left = rail.scrollLeft;
        let nearest = 0, distance = Infinity;
        cards.forEach((card, i) => {
          const d = Math.abs(card.offsetLeft - left);
          if (d < distance) { distance = d; nearest = i; }
        });
        return nearest;
      };
      const update = () => {
        const index = activeIndex();
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === index);
          dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
        if (prev) prev.disabled = false;
        if (next) next.disabled = false;
      };
      const goTo = index => {
        const target = (index + cards.length) % cards.length;
        rail.scrollTo({left: cards[target].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth'});
      };
      const move = direction => goTo(activeIndex() + direction);
      prev?.addEventListener('click', () => move(-1));
      next?.addEventListener('click', () => move(1));
      dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
      rail.addEventListener('scroll', () => window.requestAnimationFrame(update), {passive:true});
      rail.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      });
      window.addEventListener('resize', update);
      let timer = null;
      const stop = () => { if (timer) { window.clearInterval(timer); timer = null; } };
      const play = () => {
        if (reduceMotion || timer) return;
        timer = window.setInterval(() => move(1), 4800);
      };
      rail.addEventListener('mouseenter', stop);
      rail.addEventListener('mouseleave', play);
      rail.addEventListener('focusin', stop);
      rail.addEventListener('focusout', play);
      rail.addEventListener('touchstart', stop, {passive:true});
      rail.addEventListener('touchend', play, {passive:true});
      update();
      play();
    })();

    // Subtle cursor spotlight + gentle 3D tilt for mouse users only.
    (() => {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!finePointer || reduceMotion) return;
      document.querySelectorAll('.course-card, .pillar, .review-card').forEach(card => {
        card.addEventListener('pointermove', event => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          card.style.setProperty('--spot-x', `${x}px`);
          card.style.setProperty('--spot-y', `${y}px`);
          if (card.classList.contains('course-card') || card.classList.contains('pillar') || card.classList.contains('review-card')) {
            const rx = ((y / rect.height) - .5) * -2.2;
            const ry = ((x / rect.width) - .5) * 2.2;
            if (event.pointerType === 'mouse') card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
          }
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
      });
    })();


    // Newsletter request: opens WhatsApp so the team can confirm and add the contact manually.
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm?.addEventListener('submit', event => {
      event.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      if (!email || !document.getElementById('newsletterConsent').checked) return;
      const message = `Hola KUBIQ ACADEMY. Quiero solicitar mi suscripción a novedades y promociones. Mi correo es: ${email}. Acepto recibir comunicaciones y puedo solicitar la baja cuando quiera.`;
      window.open('https://wa.me/593984538209?text=' + encodeURIComponent(message), '_blank', 'noopener');
      document.getElementById('newsletterStatus').textContent = 'Se abrió WhatsApp para confirmar tu solicitud. La suscripción se completará cuando el equipo registre tu correo.';
    });

    const observer = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 }) : null;
    document.querySelectorAll('.reveal').forEach(el => { if (observer) observer.observe(el); else el.classList.add('visible'); });


/* KUBIQ V59 — progressive motion and pointer interactions */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress and compact sticky header state.
  const progress = document.createElement('div');
  progress.id = 'kubiq-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const progressBar = progress.firstElementChild;
  let ticking = false;
  const updateScrollEffects = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
    document.body.classList.toggle('kubiq-scrolled', window.scrollY > 18);
    ticking = false;
  };
  const requestScrollUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  };
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  updateScrollEffects();

  // Reveal content as it enters the viewport; content remains visible if unsupported.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length) {
      document.body.classList.add('motion-ready');
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
      revealItems.forEach(item => observer.observe(item));
    }
  }

  // Subtle cursor-following light on cards, only for mouse/trackpad devices.
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const interactiveCards = document.querySelectorAll(
      '.course-card,.trust-highlight,.pillar,.project-card,.school-skill,.faq-item'
    );
    interactiveCards.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--spot-x', '50%');
        card.style.setProperty('--spot-y', '50%');
      }, { passive: true });
    });
  }
})();


// KUBIQ V79 — deep links from individual program pages to the enrollment form.
(() => {
  const params = new URLSearchParams(window.location.search);
  const requestedCourse = params.get('matricula');
  if (!requestedCourse) return;
  if (typeof openEnrollment === 'function') {
    openEnrollment(requestedCourse);
    window.history.replaceState(null, '', window.location.pathname + '#inscripcion');
  }
})();
