/**
 * ============================================================================
 * SISTEMAS OPERATIVOS - ULL ESIT (ull-esit-sistemas-operativos.github.io/ssoo-apuntes/)
 * Controlador Principal de la Aplicación (Vanilla JS)
 * ============================================================================
 */

const SSOO_APP = {
  currentLesson: 1,

  init() {
    this.bindEvents();
    
    // Comprobar si hay hash en la URL (ej. #lesson-10)
    const hash = window.location.hash;
    let initialLesson = 1;
    if (hash && hash.startsWith('#lesson-')) {
      const parsed = parseInt(hash.replace('#lesson-', ''), 10);
      if (parsed >= 1 && parsed <= 20) {
        initialLesson = parsed;
      }
    }

    this.selectLesson(initialLesson);
  },

  bindEvents() {
    // Buscador en tiempo real
    const searchInput = document.getElementById('lesson-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    // Soporte para teclas de navegación izquierda / derecha
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight') this.nextLesson();
      if (e.key === 'ArrowLeft') this.prevLesson();
    });
  },

  toggleModule(moduleNum) {
    const accordion = document.querySelector(`.module-accordion[data-module="${moduleNum}"]`);
    if (accordion) {
      accordion.classList.toggle('open');
    }
  },

  openModuleForLesson(lessonNum) {
    let modNum = 1;
    if (lessonNum >= 1 && lessonNum <= 3) modNum = 1;
    else if (lessonNum >= 4 && lessonNum <= 8) modNum = 2;
    else if (lessonNum >= 9 && lessonNum <= 14) modNum = 3;
    else if (lessonNum >= 15 && lessonNum <= 17) modNum = 4;
    else if (lessonNum >= 18 && lessonNum <= 20) modNum = 5;

    const accordion = document.querySelector(`.module-accordion[data-module="${modNum}"]`);
    if (accordion && !accordion.classList.contains('open')) {
      accordion.classList.add('open');
    }
  },

  selectLesson(lessonNum) {
    lessonNum = parseInt(lessonNum, 10);
    if (lessonNum < 1 || lessonNum > 20) return;

    this.currentLesson = lessonNum;
    window.location.hash = `#lesson-${lessonNum}`;

    // Actualizar estado en el sidebar
    document.querySelectorAll('.lesson-btn').forEach(btn => {
      btn.classList.remove('active');
      if (parseInt(btn.getAttribute('data-lesson'), 10) === lessonNum) {
        btn.classList.add('active');
      }
    });

    // Asegurar que el módulo esté abierto
    this.openModuleForLesson(lessonNum);

    // Obtener datos teóricos
    const theory = SSOO_THEORY_DATA[lessonNum];
    if (theory) {
      this.renderHeader(theory);
      this.renderTheory(theory);
    }

    // Montar el simulador correspondiente
    this.mountSimulator(lessonNum);

    // Scroll al principio del contenido
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  prevLesson() {
    if (this.currentLesson > 1) {
      this.selectLesson(this.currentLesson - 1);
    }
  },

  nextLesson() {
    if (this.currentLesson < 20) {
      this.selectLesson(this.currentLesson + 1);
    }
  },

  renderHeader(theory) {
    const badge = document.getElementById('header-module-badge');
    const title = document.getElementById('header-lesson-title');
    const subtitle = document.getElementById('header-lesson-subtitle');

    if (badge) badge.textContent = `Módulo ${theory.moduleNumber}`;
    if (title) title.textContent = `Lección ${theory.lessonNumber}: ${theory.title}`;
    if (subtitle) subtitle.textContent = theory.subtitle;
  },

  renderTheory(theory) {
    const container = document.getElementById('theory-container');
    if (!container) return;

    let sectionsHtml = '';
    if (theory.sections && theory.sections.length > 0) {
      sectionsHtml = theory.sections.map(sec => `
        <div class="theory-section">
          <h4>${sec.title}</h4>
          ${sec.content}
        </div>
      `).join('');
    }

    const html = `
      <div class="theory-header">
        <span class="section-tag">${theory.module} • Lección ${theory.lessonNumber}</span>
        <h3>${theory.lessonNumber}. ${theory.title}</h3>
        <p class="theory-summary">${theory.summary}</p>
      </div>

      <div class="theory-sections">
        ${sectionsHtml}
      </div>

      ${theory.codeSnippet ? `
        <div class="code-container">
          <div class="code-header">
            <span>💻 Fragmento Técnico en C / API de Bajo Nivel</span>
            <span>ULL ESIT SSOO</span>
          </div>
          <pre class="code-block"><code>${this.escapeHtml(theory.codeSnippet)}</code></pre>
        </div>
      ` : ''}

      ${theory.examNotes ? `
        <div class="callout callout-exam">
          <span class="callout-icon">🎓</span>
          <div>
            <strong>Punto Clave para Exámenes (ULL ESIT):</strong>
            <p style="margin-top:0.25rem;">${theory.examNotes}</p>
          </div>
        </div>
      ` : ''}
    `;

    container.innerHTML = html;
  },

  mountSimulator(lessonNum) {
    const mountPoint = document.getElementById('simulator-mount-point');
    const simHeading = document.getElementById('simulator-heading');
    const simDesc = document.getElementById('simulator-desc');

    if (!mountPoint) return;

    const titles = {
      1: { title: "⚙️ Asignador de Recursos y Programa de Control", desc: "Simula cómo el SO supervisa el acceso seguro a cores, RAM y periféricos, bloqueando abusos de hardware." },
      2: { title: "⏱️ Comparador de Tipos de Sistemas", desc: "Compara el aprovechamiento de la CPU en Sistemas por Lotes, Multiprogramados, Tiempo Compartido y Tiempo Real." },
      3: { title: "🏛️ Línea Temporal y Banco de Pruebas de Generaciones", desc: "Ejecuta un benchmark computacional a través de las 5 generaciones históricas desde 1945 hasta la nube actual." },
      4: { title: "🧩 Arquitectura Modular del Núcleo", desc: "Visualiza el intercambio ordenado de mensajes entre los componentes del SO al ejecutar órdenes o abrir ficheros." },
      5: { title: "📋 Auditor de Servicios del SO", desc: "Supervisa las peticiones de servicios de usuario frente a las rutinas de eficiencia y seguridad del kernel." },
      6: { title: "🛡️ Simulador de Syscall y Modo Dual de la CPU", desc: "Traza paso a paso la ejecución de una llamada al sistema en C, el paso de parámetros en registros y la conmutación Ring 3 ➔ Ring 0." },
      7: { title: "⚡ Secuencia de Arranque (Bootstrap) y Gestor de Interrupciones", desc: "Simula el arranque desde la BIOS hasta PID 1 systemd y atiende señales hardware IRQ con el vector IDT." },
      8: { title: "🏗️ Banco de Pruebas de Arquitecturas de Kernel", desc: "Inyecta fallos catastróficos en drivers de disco para evaluar la tolerancia a caídas en Monolítico vs Microkernel." },
      9: { title: "🔄 Gestor del Ciclo de Vida del Proceso y PCB Inspector", desc: "Manipula los 5 estados del proceso (Nuevo, Listo, Ejecución, Bloqueado, Terminado) e inspecciona su PCB en tiempo real." },
      10: { title: "📊 Planificador de CPU con Diagrama de Gantt", desc: "Suite completa de algoritmos: FCFS, SJF, SRTF, Round Robin (q) y Prioridades con cálculo analítico de TME y TMR." },
      11: { title: "📬 Simulador de Paso de Mensajes (IPC)", desc: "Comunica procesos mediante buzones con capacidad cero (Rendezvous), capacidad acotada y sincronización bloqueante." },
      12: { title: "⚡ Memoria Compartida vs Paso de Mensajes", desc: "Proyecta memoria compartida con POSIX mmap y demuestra la aparición de condiciones de carrera al desactivar el mutex." },
      13: { title: "🧵 Simulador Multihilo y Modelos de Correspondencia", desc: "Ejecuta hilos concurrentes en CPU multinúcleo y compara los modelos Muchos a Uno, Uno a Uno y Muchos a Muchos." },
      14: { title: "🔒 Laboratorio de Concurrencia y Sincronización", desc: "Resuelve el Productor-Consumidor con búfer acotado y semáforos, y analiza la Cena de los Filósofos contra deadlocks." },
      15: { title: "🧩 Asignación Contigua de Memoria y Fragmentación", desc: "Asigna particiones variables con Primer Ajuste, Mejor Ajuste y Peor Ajuste, y ejecuta compactación de huecos." },
      16: { title: "🗺️ Traductor de Direcciones MMU, Tabla de Páginas y TLB", desc: "Descompone direcciones lógicas en página y desplazamiento, calcula aciertos en TLB y computa el tiempo de acceso EAT." },
      17: { title: "🔄 Simulador de Reemplazo de Páginas y Memoria Virtual", desc: "Compara FIFO, LRU y Óptimo ante cadenas de referencias y reproduce la célebre Anomalía de Bélády." },
      18: { title: "💽 Planificador de Cabezal de Disco Magnético", desc: "Calcula y visualiza la trayectoria física del brazo mecánico en FCFS, SSTF, SCAN (ascensor), C-SCAN y LOOK." },
      19: { title: "📁 Métodos de Asignación de Archivos en Disco", desc: "Simula asignación contigua, enlazada, tabla FAT e indexada sobre una cuadrícula real de bloques de disco." },
      20: { title: "💾 Arquitectura del Inodo UNIX y Journaling", desc: "Modula dinámicamente el tamaño de un archivo para desplegar punteros directos e indirectos, y recupera consistencia tras cortes eléctricos con diario." }
    };

    if (titles[lessonNum]) {
      if (simHeading) simHeading.textContent = titles[lessonNum].title;
      if (simDesc) simDesc.textContent = titles[lessonNum].desc;
    }

    const sim = SSOO_SIMULATORS[lessonNum];
    if (sim && typeof sim.init === 'function') {
      sim.init(mountPoint);
    } else {
      mountPoint.innerHTML = `<div class="callout callout-important"><p>Simulador para la lección ${lessonNum} en preparación.</p></div>`;
    }
  },

  handleSearch(query) {
    query = query.trim().toLowerCase();
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    const accordions = document.querySelectorAll('.module-accordion');

    if (!query) {
      lessonButtons.forEach(btn => btn.parentElement.style.display = 'block');
      return;
    }

    accordions.forEach(acc => {
      let moduleHasMatch = false;
      const buttons = acc.querySelectorAll('.lesson-btn');

      buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        const lessonNum = btn.getAttribute('data-lesson');
        const theory = SSOO_THEORY_DATA[lessonNum];
        const matchTheory = theory && (theory.summary.toLowerCase().includes(query) || theory.title.toLowerCase().includes(query));

        if (text.includes(query) || matchTheory) {
          btn.parentElement.style.display = 'block';
          moduleHasMatch = true;
        } else {
          btn.parentElement.style.display = 'none';
        }
      });

      if (moduleHasMatch) {
        acc.classList.add('open');
      }
    });
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  SSOO_APP.init();
});
