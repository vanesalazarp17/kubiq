import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = new URL('./', import.meta.url);
const read = path => readFileSync(new URL(path, source), 'utf8');
const programs = JSON.parse(read('cursos.json'));
const site = 'https://vanesalazarp17.github.io/kubiq/';
const check = process.argv.includes('--verificar');

function fill(template, values) {
  return template.replace(/{{([a-zA-Z]+)}}/g, (_, name) => {
    if (!Object.hasOwn(values, name) || values[name] == null) {
      throw new Error(`Falta el valor ${name} en una plantilla`);
    }
    return String(values[name]);
  });
}

function render(name, values) {
  return fill(read(`plantillas/${name}`), values);
}

function fragment(program, name) {
  return read(`programas/${program.id}/${name}.html`).replace(
    /{{incluir:([a-z0-9-]+)}}/g,
    (_, component) => read(`componentes/${component}.html`),
  );
}

function html(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

const escapeFields = fields => Object.fromEntries(
  Object.entries(fields).map(([key, value]) => [key, html(value)]),
);

function list(items, extraClass = '') {
  return items.map((text, index) =>
    `<li${index >= 2 ? extraClass : ''}>${html(text)}</li>`,
  ).join('');
}

function validate() {
  const ids = new Set();
  function register(id) {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) {
      throw new Error(`Identificador inválido o repetido: ${id}`);
    }
    ids.add(id);
  }
  if (!Array.isArray(programs) || !programs.length) throw new Error('El catálogo está vacío');
  for (const program of programs) {
    register(program.id);
    if (!program.portada.imagen?.startsWith('../../imagenes/') ||
        !existsSync(root + program.portada.imagen.slice('../../'.length))) {
      throw new Error(`Falta la imagen de portada de ${program.id}`);
    }
    if (!Array.isArray(program.niveles) || !program.niveles.length) {
      throw new Error(`El programa ${program.id} necesita al menos un nivel`);
    }
    for (const course of program.niveles) {
      register(course.id);
      if (!course.imagen?.startsWith('imagenes/') || !existsSync(root + course.imagen)) {
        throw new Error(`Falta la imagen de ${course.id}: ${course.imagen}`);
      }
      if (![course.sesiones, course.minutos].every(value => Number.isInteger(value) && value > 0)) {
        throw new Error(`Revisa la cantidad de sesiones y minutos de ${course.id}`);
      }
    }
  }
}

validate();
const catalog = [];
const ageGuide = [];
const enrollment = [];
const modal = {};
const outputs = new Map();
const sitemap = [];
let levelCount = 0;
for (const program of programs) {
  const route = `programas/${program.id}/`;
  const href = route + 'index.html';
  const levelCards = [];
  const ageCards = [];
  const options = [];
  let group = `<div class="course-area-heading"><h3>${html(program.encabezado)}</h3></div>`;
  for (const course of program.niveles) {
    levelCount++;
    const values = escapeFields({
      id: course.id, nombre: course.nombre, titulo: course.titulo, nivel: course.nivel,
      edad: course.edad, edadCorta: course.edad.replace(' a ', '–'),
      imagen: course.imagen, ruta: href, sesiones: course.sesiones, minutos: course.minutos,
      rotulo: `${program.nombre.toUpperCase()} · ${course.nivel.replace(/^Nivel /, '').toUpperCase()}`,
    });
    group += render('tarjeta.html', {
      ...values,
      resumen: html(course.tarjeta.resumen),
      etiquetaEnlace: html(course.tarjeta.etiquetaEnlace),
      temas: list(course.tarjeta.temas, ' class="v156-extra-learning"'),
    }) + '\n';
    ageCards.push(render('tarjeta-edad.html', values));
    levelCards.push(render('nivel.html', {
      ...values,
      requisitos: html(course.ficha.requisitos),
      aprendizaje: html(course.ficha.aprendizaje),
      temas: list(course.ficha.temas),
    }));
    options.push(`<option value="${values.nombre}">${values.titulo}</option>`);
    enrollment.push(`<option>${values.nombre}</option>`);
    modal[course.id] = {
      title: course.titulo, level: course.nivel, age: course.edad, sessions: course.sesiones,
      duration: course.minutos, image: course.imagen, ...course.modal, href, enrollmentValue: course.nombre,
    };
  }
  catalog.push(group.trimEnd());
  ageGuide.push(render('grupo-edad.html', {...escapeFields(program.guiaEdad), tarjetas: ageCards.join('')}));
  const facts = program.datosRapidos.map(({valor, dato, sufijo, etiqueta}) => {
    const text = dato ? [...new Set(program.niveles.map(course => course[dato]))].join(' / ') + sufijo : valor;
    return `<div><strong>${html(text)}</strong><span>${html(etiqueta)}</span></div>`;
  });
  const seo = render('seo.json', Object.fromEntries(
    Object.entries({...program.seo, url: site + route}).map(([key, value]) =>
      [key, JSON.stringify(value).slice(1, -1).replaceAll('<', '\\u003c')],
    ),
  ));
  outputs.set(href, render('programa.html', {
    titulo: html(program.tituloPagina),
    seo,
    estilosCabecera: fill(fragment(program, 'cabecera'), escapeFields({
      tituloSocial: program.seo.tituloSocial, descripcionSocial: program.seo.descripcionSocial, url: site + route,
    })),
    hero: render('portada.html', escapeFields({...program.portada, id: program.id})),
    habilidades: fragment(program, 'habilidades'),
    proyectos: fragment(program, 'proyectos'),
    rotuloNiveles: levelCards.length === 2 ? 'DOS NIVELES · UNA RUTA' :
      levelCards.length === 1 ? 'UN NIVEL · UNA RUTA' : `${levelCards.length} NIVELES · UNA RUTA`,
    niveles: levelCards.join(''),
    datosRapidos: `<div class="facts">${facts.join('')}</div>`,
    matricula: render('matricula.html', {opciones: options.join('')}),
    preguntas: fragment(program, 'preguntas'),
    llamadaAccion: render('llamada-accion.html', {titulo: html(program.llamadaAccion)}),
    cierre: fragment(program, 'cierre'),
  }));
  sitemap.push(`  <url><loc>${site + route}</loc><priority>${html(program.sitemapPrioridad)}</priority></url>`);
}
outputs.set('index.html', render('inicio.html', {
  introduccionCatalogo: programs.length === 3 && levelCount === 6 ?
    'Tres rutas creativas. Seis niveles para empezar y avanzar.' :
    `${programs.length} rutas creativas · ${levelCount} niveles para empezar y avanzar.`,
  catalogo: catalog.join('\n'),
  guiaEdad: ageGuide.join('\n'),
  opcionesCursos: enrollment.join(''),
}));
outputs.set('scripts/main.js', render('main.js', {datosModal: JSON.stringify(modal, null, 2)}));
outputs.set('sitemap.xml', render('sitemap.xml', {programas: sitemap.join('\n')}));

for (const [path, content] of outputs) {
  const target = root + path;
  if (check) {
    if (!existsSync(target) || readFileSync(target, 'utf8') !== content) {
      console.error(`El archivo necesita regenerarse: ${path}`);
      process.exitCode = 1;
    }
  } else {
    mkdirSync(dirname(target), {recursive: true});
    writeFileSync(target, content);
  }
}
if (!process.exitCode) console.log(`${outputs.size} archivos ${check ? 'verificados' : 'generados'} · ${levelCount} niveles`);
