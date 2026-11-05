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
"scratch-inicial":{title:"Scratch inicial",level:"Nivel inicial",age:"8–12 años",image:"imagenes/course-scratch-inicial.png",description:"Una primera experiencia con la programación visual por bloques. El estudiante aprende a dar instrucciones paso a paso y convierte sus ideas en historias, animaciones y juegos sencillos. Explora cómo una secuencia de instrucciones puede dar vida a personajes y situaciones.",topics:["Interfaz de Scratch: escenario, objetos, disfraces y bloques","Secuencias, eventos, movimiento, sonidos y apariencia","Animaciones, diálogos e historias interactivas","Reglas sencillas, pruebas y mejoras de un proyecto"],skills:["Pensamiento lógico y secuencial","Creatividad para diseñar personajes e historias","Descomposición de retos en pasos pequeños","Autonomía para probar, detectar y corregir errores"],project:"Al finalizar, podrá crear una historia animada o un videojuego sencillo con personajes, escenarios, sonidos e interacciones.",prerequisites:"No requiere experiencia previa. Recomendado para quienes comienzan a explorar la programación."},
"scratch-avanzado":{title:"Scratch avanzado",level:"Nivel avanzado",age:"8–12 años",image:"imagenes/course-scratch-avanzado.png",description:"Para estudiantes que ya conocen los fundamentos de Scratch y quieren crear proyectos con más interacciones, reglas y desafíos. Se profundiza en la lógica que organiza los juegos y en cómo hacer que los elementos respondan a distintas situaciones.",topics:["Condiciones, ciclos, variables y operadores","Mensajes entre objetos y sincronización de acciones","Diseño de niveles, puntajes, vidas y reglas de juego","Depuración, pruebas y mejora de proyectos interactivos"],skills:["Razonamiento lógico y pensamiento algorítmico","Diseño de soluciones con varias condiciones","Planificación y organización de proyectos","Persistencia y análisis al corregir errores"],project:"Podrá desarrollar un videojuego de varios niveles con puntajes, reglas, personajes interactivos y condiciones de victoria o desafío.",prerequisites:"Conviene conocer los bloques básicos de Scratch o realizar una orientación previa para confirmar el nivel."},
"roblox-inicial":{title:"Roblox Studio inicial",level:"Nivel inicial",age:"10–14 años",image:"imagenes/course-roblox-inicial.png",description:"Una introducción al entorno de Roblox Studio para aprender cómo se construyen mundos digitales. El estudiante explora herramientas de construcción, organiza objetos y comprende los elementos que forman una experiencia interactiva.",topics:["Interfaz, paneles y herramientas principales de Roblox Studio","Construcción de escenarios, terrenos y espacios tridimensionales","Objetos, propiedades, materiales e iluminación básica","Introducción a las interacciones y pruebas dentro del entorno"],skills:["Pensamiento espacial y diseño 3D","Creatividad para construir mundos y escenarios","Atención al detalle y organización de elementos","Resolución de problemas mediante pruebas"],project:"Podrá construir un escenario o pequeño recorrido interactivo en Roblox Studio y presentarlo como una experiencia propia.",prerequisites:"No es indispensable haber creado juegos antes; interés por el diseño y la creación digital es suficiente."},
"roblox-avanzado":{title:"Roblox Studio avanzado",level:"Nivel avanzado",age:"Desde los 13 años",image:"imagenes/course-roblox-avanzado.png",description:"Una ruta para desarrollar experiencias más completas en Roblox Studio, combinando construcción, lógica de juego y scripts en Lua. El estudiante aprende a programar comportamientos y a conectar las acciones del jugador con los elementos del mundo.",topics:["Fundamentos de scripting con Lua: variables, funciones y eventos","Scripts para controlar objetos, acciones y comportamientos","Mecánicas de juego, interacción y lógica de experiencia","Pruebas, depuración y optimización de una experiencia"],skills:["Pensamiento computacional y programación textual","Comprensión de eventos y relaciones causa-efecto","Diseño de mecánicas y experiencias de usuario","Depuración y trabajo iterativo"],project:"Podrá crear una experiencia jugable con mecánicas programadas, interacciones y comportamientos personalizados mediante scripts.",prerequisites:"Recomendado para quienes ya manejan las herramientas básicas de Roblox Studio; el nivel se confirma antes de la inscripción."},
"python-inicial":{title:"Python inicial",level:"Nivel inicial",age:"Desde los 13 años",image:"imagenes/course-python-inicial.png",description:"Una introducción a la programación textual con Python. El estudiante aprende a escribir instrucciones, interpretar resultados y resolver problemas pequeños usando un lenguaje utilizado en múltiples áreas tecnológicas.",topics:["Sintaxis, variables, tipos de datos y entrada/salida","Operadores y expresiones para procesar información","Condicionales y ciclos para controlar el flujo del programa","Funciones básicas y ejercicios prácticos"],skills:["Pensamiento lógico y estructuración de instrucciones","Lectura y escritura de código","Resolución paso a paso de problemas","Análisis de resultados y corrección de errores"],project:"Podrá desarrollar programas sencillos como cuestionarios, calculadoras, juegos de preguntas o herramientas que procesen datos básicos.",prerequisites:"No exige experiencia previa en Python. Se recomienda comodidad básica usando una computadora y seguir instrucciones escritas."},
"python-avanzado":{title:"Python avanzado",level:"Nivel avanzado",age:"Desde los 13 años",image:"imagenes/course-python-avanzado.png",description:"Para estudiantes que ya conocen las bases de Python y quieren escribir programas mejor organizados y resolver retos de mayor complejidad. La práctica se centra en estructurar soluciones, reutilizar código y construir proyectos con varias partes.",topics:["Funciones, parámetros, retorno y módulos","Listas, diccionarios y otras estructuras de datos","Manejo de errores, depuración y lectura de mensajes","Organización del código y desarrollo de proyectos integradores"],skills:["Abstracción y pensamiento algorítmico","Diseño de programas modulares y reutilizables","Análisis y depuración sistemática","Planificación de proyectos de mayor complejidad"],project:"Podrá desarrollar un programa estructurado que combine funciones y estructuras de datos para resolver una necesidad concreta, documentando y probando su funcionamiento.",prerequisites:"Requiere bases de Python: variables, condicionales, ciclos y funciones. Si hay dudas, KUBIQ orientará sobre el nivel adecuado."}};
const backdrop=document.getElementById('courseModalBackdrop'), closeBtn=backdrop.querySelector('.course-modal-close');let lastTrigger=null;
function openCourse(card){const c=courseDetails[card.dataset.course];if(!c)return;lastTrigger=card;document.getElementById('courseModalImage').src=c.image;document.getElementById('courseModalImage').alt='Ilustración de '+c.title;document.getElementById('courseModalTitle').textContent=c.title;document.getElementById('courseModalLevel').textContent=c.level;document.getElementById('courseModalAge').textContent='Edad recomendada: '+c.age;document.getElementById('courseModalDescription').textContent=c.description;let pre=document.getElementById('courseModalPrereq');if(!pre){pre=document.createElement('p');pre.id='courseModalPrereq';pre.className='course-modal-footnote';document.getElementById('courseModalTopics').parentElement.insertBefore(pre,document.querySelector('.course-modal-actions'));}pre.textContent='Preparación previa: '+c.prerequisites;const list=document.getElementById('courseModalTopics');list.replaceChildren(...c.topics.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));const skills=document.getElementById('courseModalSkills');skills.replaceChildren(...c.skills.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));document.getElementById('courseModalProject').innerHTML='<strong>¿Qué podrá crear?</strong><p></p>';document.querySelector('#courseModalProject p').textContent=c.project;const msg='Hola KUBIQ ACADEMY, quiero información para inscribir a mi hijo/a en '+c.title+' ('+c.age+'). ¿Me pueden orientar sobre el proceso, horarios y costos?';document.getElementById('courseEnrollBtn').onclick=()=>openEnrollment(c.title);document.getElementById('courseTrialBtn').setAttribute('data-cal-link','kubiqacademy/30min');backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeBtn.focus()}
function closeCourse(){backdrop.classList.remove('open');backdrop.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastTrigger)lastTrigger.focus()}
document.querySelectorAll('.course-open').forEach(card=>{card.addEventListener('click',()=>openCourse(card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCourse(card)}})});closeBtn.addEventListener('click',closeCourse);backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeCourse()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&backdrop.classList.contains('open'))closeCourse()});

const enrollBackdrop=document.getElementById('enrollBackdrop'), enrollClose=enrollBackdrop.querySelector('.enroll-close'), enrollForm=document.getElementById('enrollForm');
function openEnrollment(courseName=''){document.getElementById('enrollCourse').value=courseName;document.getElementById('enrollStatus').textContent='';enrollBackdrop.classList.add('open');enrollBackdrop.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';enrollClose.focus()}
function closeEnrollment(){enrollBackdrop.classList.remove('open');enrollBackdrop.setAttribute('aria-hidden','true');document.body.style.overflow='';document.getElementById('courseEnrollBtn')?.focus()}
enrollClose.addEventListener('click',closeEnrollment);enrollBackdrop.addEventListener('click',e=>{if(e.target===enrollBackdrop)closeEnrollment()});
const countrySelect=document.getElementById('enrollCountry'), transferOption=document.getElementById('transferOption'), transferRadio=transferOption.querySelector('input'), paymentCountryNote=document.getElementById('paymentCountryNote');
function updatePaymentOptions(){const inEcuador=countrySelect.value==='Ecuador';transferOption.hidden=!inEcuador;if(!inEcuador&&transferRadio.checked){transferRadio.checked=false}paymentCountryNote.textContent=inEcuador?'Puedes elegir transferencia bancaria, además de tarjeta o PayPal.':'La transferencia bancaria está disponible únicamente para clientes en Ecuador. Puedes elegir tarjeta o PayPal.';}
countrySelect.addEventListener('change',updatePaymentOptions);
enrollForm.addEventListener('submit',event=>{event.preventDefault();if(!enrollForm.reportValidity())return;const data=new FormData(enrollForm);const payment=data.get('metodoPago');if(payment==='Transferencia bancaria en Ecuador'&&data.get('pais')!=='Ecuador'){paymentCountryNote.textContent='La transferencia bancaria solo está disponible si resides en Ecuador.';return;}const details=[
'Solicitud de inscripción — KUBIQ ACADEMY','',
'Representante: '+data.get('representante'),'Correo: '+data.get('email'),'WhatsApp: '+data.get('whatsapp'),'Estudiante: '+data.get('estudiante'),'Edad: '+data.get('edad'),'Curso: '+data.get('curso'),'Frecuencia: '+data.get('frecuencia'),'País: '+data.get('pais'),'Horario preferido: '+(data.get('horario')||'Sin preferencia indicada'),'Método de pago preferido: '+payment,'',
'Por favor, confirmar disponibilidad y enviar por correo los detalles e instrucciones de pago. Esta solicitud no confirma matrícula ni pago.'
].join('\n');document.getElementById('enrollStatus').textContent='Preparando tu solicitud… Se abrirá WhatsApp para enviarla al equipo de KUBIQ. Después podremos responder al correo que indicaste.';window.open('https://wa.me/593964210182?text='+encodeURIComponent(details),'_blank','noopener');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&enrollBackdrop.classList.contains('open'))closeEnrollment()});





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
      window.open('https://wa.me/593964210182?text=' + encodeURIComponent(message), '_blank', 'noopener');
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
