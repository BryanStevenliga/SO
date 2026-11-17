/**
 * ============================================================================
 * SISTEMAS OPERATIVOS - ULL ESIT (ull-esit-sistemas-operativos.github.io/ssoo-apuntes/)
 * Motores de Simulación Interactiva para las 20 Lecciones
 * ============================================================================
 */

const SSOO_SIMULATORS = {
  // Helper común para crear elementos y KPIs
  utils: {
    createControlBar(html) {
      return `<div class="sim-controls-bar">${html}</div>`;
    },
    createKPICards(kpis) {
      return `
        <div class="kpi-grid">
          ${kpis.map(k => `
            <div class="kpi-card ${k.variant || ''}">
              <div class="kpi-label">${k.label}</div>
              <div class="kpi-value">${k.value}</div>
              <div class="kpi-subtext">${k.subtext || ''}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 1: DEFINICIONES - ASIGNADOR DE RECURSOS Y PROGRAMA DE CONTROL
  // --------------------------------------------------------------------------
  1: {
    state: {
      policy: 'fair', // 'fair' o 'priority'
      totalCores: 4,
      totalRam: 4096, // MB
      totalIO: 4,     // Disp E/S
      allocatedCores: 0,
      allocatedRam: 0,
      allocatedIO: 0,
      requestsGranted: 0,
      requestsBlocked: 0,
      processes: []
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.policy = 'fair';
      this.state.processes = [
        { pid: 1, name: "Web Server", cores: 2, ram: 1536, io: 1, status: "pending", priority: 1 },
        { pid: 2, name: "Database", cores: 1, ram: 2048, io: 2, status: "pending", priority: 2 },
        { pid: 3, name: "Compilador gcc", cores: 2, ram: 1024, io: 0, status: "pending", priority: 3 },
        { pid: 4, name: "Malware / Desbordamiento", cores: 4, ram: 4096, io: 3, status: "pending", priority: 4 }
      ];
      this.recalculate();
      this.render();
    },
    setPolicy(policy) {
      this.state.policy = policy;
      this.recalculate();
      this.render();
    },
    addProcess() {
      const pid = this.state.processes.length + 1;
      const cores = Math.floor(Math.random() * 2) + 1;
      const ram = (Math.floor(Math.random() * 3) + 1) * 512;
      const io = Math.floor(Math.random() * 2);
      this.state.processes.push({
        pid,
        name: `Proceso_${pid}`,
        cores,
        ram,
        io,
        status: "pending",
        priority: pid
      });
      this.recalculate();
      this.render();
    },
    recalculate() {
      let cores = 0;
      let ram = 0;
      let io = 0;
      let granted = 0;
      let blocked = 0;

      // Ordenar según política
      const procs = [...this.state.processes];
      if (this.state.policy === 'priority') {
        procs.sort((a, b) => a.priority - b.priority);
      }

      procs.forEach(p => {
        // El Programa de Control verifica si hay desbordamiento o petición abusiva
        if (p.ram > 3000 || p.cores > 3) {
          p.status = "bloqueado_seguridad";
          p.reason = "Acceso bloqueado: Petición monopoliza el hardware (Programa de Control)";
          blocked++;
          return;
        }

        // El Asignador de Recursos comprueba disponibilidad
        if (cores + p.cores <= this.state.totalCores && ram + p.ram <= this.state.totalRam && io + p.io <= this.state.totalIO) {
          cores += p.cores;
          ram += p.ram;
          io += p.io;
          p.status = "asignado";
          p.reason = "Recursos concedidos con éxito";
          granted++;
        } else {
          p.status = "espera";
          p.reason = "En cola: Recursos insuficientes actualmente";
        }
      });

      this.state.allocatedCores = cores;
      this.state.allocatedRam = ram;
      this.state.allocatedIO = io;
      this.state.requestsGranted = granted;
      this.state.requestsBlocked = blocked;
    },
    render() {
      const s = this.state;
      const corePct = Math.round((s.allocatedCores / s.totalCores) * 100);
      const ramPct = Math.round((s.allocatedRam / s.totalRam) * 100);
      const ioPct = Math.round((s.allocatedIO / s.totalIO) * 100);

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Política del Asignador:</label>
              <select onchange="SSOO_SIMULATORS[1].setPolicy(this.value)">
                <option value="fair" ${s.policy === 'fair' ? 'selected' : ''}>Equitativa (Fair-Share)</option>
                <option value="priority" ${s.policy === 'priority' ? 'selected' : ''}>Prioridad Estricta (ULL)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[1].addProcess()">+ Solicitar Recursos</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[1].loadExample()">Cargar Ejercicio de Ejemplo</button>
              <button class="btn btn-outline" onclick="SSOO_SIMULATORS[1].reset()">Reiniciar</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Matriz de Recursos Hardware del Sistema</h4>
            <div class="resource-meters">
              <div class="meter-item">
                <div class="meter-header">
                  <span>Núcleos de CPU (Asignador de Recursos)</span>
                  <span>${s.allocatedCores} / ${s.totalCores} Cores (${corePct}%)</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${corePct}%; background-color: var(--accent-blue);"></div>
                </div>
              </div>

              <div class="meter-item">
                <div class="meter-header">
                  <span>Memoria RAM Principal</span>
                  <span>${s.allocatedRam} / ${s.totalRam} MB (${ramPct}%)</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${ramPct}%; background-color: var(--color-success);"></div>
                </div>
              </div>

              <div class="meter-item">
                <div class="meter-header">
                  <span>Canales de Entrada/Salida (E/S)</span>
                  <span>${s.allocatedIO} / ${s.totalIO} Disp (${ioPct}%)</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${ioPct}%; background-color: var(--color-warning);"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla de Procesos Solicitantes y Decisiones del Kernel</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>PID</th>
                    <th>Nombre de Proceso</th>
                    <th>Cores Pedidos</th>
                    <th>RAM Pedida</th>
                    <th>E/S</th>
                    <th>Estado de Decisión</th>
                    <th>Diagnóstico del Kernel</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.processes.map(p => `
                    <tr>
                      <td><code>PID_${p.pid}</code></td>
                      <td><strong>${p.name}</strong></td>
                      <td>${p.cores} Cores</td>
                      <td>${p.ram} MB</td>
                      <td>${p.io} Disp</td>
                      <td>
                        <span class="badge ${p.status === 'asignado' ? 'badge-success' : p.status === 'espera' ? 'badge-warning' : 'badge-danger'}">
                          ${p.status === 'asignado' ? '✓ Asignado' : p.status === 'espera' ? '⏳ Espera' : '🛑 Bloqueado (Control)'}
                        </span>
                      </td>
                      <td class="text-muted"><small>${p.reason || ''}</small></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Utilización Global CPU", value: `${corePct}%`, subtext: `${s.allocatedCores} de ${s.totalCores} Cores activos` },
            { label: "Memoria RAM Libre", value: `${s.totalRam - s.allocatedRam} MB`, subtext: `${ramPct}% asignado a tareas` },
            { label: "Solicitudes Aprobadas", value: `${s.requestsGranted}`, subtext: "Asignación libre de conflicto" },
            { label: "Accesos Bloqueados (Control)", value: `${s.requestsBlocked}`, subtext: "Violaciones o abusos prevenidos" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    },
    reset() {
      this.state.processes = [];
      this.recalculate();
      this.render();
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 2: TIPOS DE SISTEMAS - COMPARADOR OPERATIVO
  // --------------------------------------------------------------------------
  2: {
    state: {
      systemType: 'multiprogrammed', // 'batch', 'multiprogrammed', 'timesharing', 'realtime'
      quantum: 2,
      jobs: []
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.systemType = 'multiprogrammed';
      this.state.quantum = 2;
      this.state.jobs = [
        { id: "J1", type: "CPU-Intensivo", cpu: 4, io: 0, deadline: 8, arrival: 0 },
        { id: "J2", type: "E/S-Intensivo", cpu: 2, io: 4, deadline: 10, arrival: 1 },
        { id: "J3", type: "Interactivo", cpu: 3, io: 2, deadline: 7, arrival: 2 },
        { id: "J4", type: "Tiempo Real", cpu: 2, io: 1, deadline: 5, arrival: 0 }
      ];
      this.render();
    },
    setType(type) {
      this.state.systemType = type;
      this.render();
    },
    render() {
      const s = this.state;
      let cpuUtil = 0;
      let latency = 0;
      let throughput = 0;
      let deadlinesMet = "100%";
      let timelineDesc = "";

      if (s.systemType === 'batch') {
        cpuUtil = 54;
        latency = "Alta (~12 ms)";
        throughput = "0.25 trab/s";
        deadlinesMet = "50% (Sin prioridad)";
        timelineDesc = "En Lotes (Batch), los trabajos se procesan secuencialmente. Cuando J2 realiza E/S, la CPU queda totalmente OCIOSA, perdiendo ciclos.";
      } else if (s.systemType === 'multiprogrammed') {
        cpuUtil = 91;
        latency = "Media (~6 ms)";
        throughput = "0.45 trab/s";
        deadlinesMet = "75%";
        timelineDesc = "En Multiprogramación, cuando J2 entra en E/S, el kernel conmuta de inmediato la CPU a J3 o J1, alcanzando un 91% de utilización.";
      } else if (s.systemType === 'timesharing') {
        cpuUtil = 86;
        latency = "Mínima (~1.8 ms)";
        throughput = "0.40 trab/s";
        deadlinesMet = "80%";
        timelineDesc = "En Tiempo Compartido, la CPU se reparte en rodajas de quantum (q=2). Todos los usuarios interactúan con baja latencia percibida.";
      } else if (s.systemType === 'realtime') {
        cpuUtil = 78;
        latency = "Determinista (~0.5 ms)";
        throughput = "0.38 trab/s";
        deadlinesMet = "100% (Garantizado)";
        timelineDesc = "En Tiempo Real, J4 (crítico) desaloja a cualquier otra tarea para cumplir su deadline estricto de 5 ms.";
      }

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Tipo de Sistema Operativo:</label>
              <select onchange="SSOO_SIMULATORS[2].setType(this.value)">
                <option value="batch" ${s.systemType === 'batch' ? 'selected' : ''}>Sistemas por Lotes (Batch Processing)</option>
                <option value="multiprogrammed" ${s.systemType === 'multiprogrammed' ? 'selected' : ''}>Sistemas Multiprogramados (ULL)</option>
                <option value="timesharing" ${s.systemType === 'timesharing' ? 'selected' : ''}>Tiempo Compartido (Time-Sharing)</option>
                <option value="realtime" ${s.systemType === 'realtime' ? 'selected' : ''}>Sistemas de Tiempo Real (Real-Time)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[2].loadExample()">Cargar Ejercicio de Ejemplo</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Cronograma de Ejecución y Ocupación de CPU</h4>
            <p class="text-muted"><small>${timelineDesc}</small></p>

            <div class="timeline-visual">
              <div class="timeline-row">
                <span class="timeline-label">CPU:</span>
                <div class="timeline-track">
                  ${s.systemType === 'batch' ? `
                    <div class="time-block" style="flex:4; background:#3b82f6;">J1 (4ms)</div>
                    <div class="time-block" style="flex:2; background:#8b5cf6;">J2 (2ms)</div>
                    <div class="time-block idle" style="flex:4; background:#ef4444;">Ociosa (E/S J2)</div>
                    <div class="time-block" style="flex:3; background:#10b981;">J3 (3ms)</div>
                    <div class="time-block" style="flex:2; background:#f59e0b;">J4 (2ms)</div>
                  ` : s.systemType === 'multiprogrammed' ? `
                    <div class="time-block" style="flex:4; background:#3b82f6;">J1 (4ms)</div>
                    <div class="time-block" style="flex:2; background:#8b5cf6;">J2 (CPU)</div>
                    <div class="time-block" style="flex:3; background:#10b981;">J3 (Mientras J2 E/S)</div>
                    <div class="time-block" style="flex:2; background:#f59e0b;">J4 (2ms)</div>
                  ` : s.systemType === 'timesharing' ? `
                    <div class="time-block" style="flex:2; background:#3b82f6;">J1 (q1)</div>
                    <div class="time-block" style="flex:2; background:#8b5cf6;">J2 (q1)</div>
                    <div class="time-block" style="flex:2; background:#10b981;">J3 (q1)</div>
                    <div class="time-block" style="flex:2; background:#f59e0b;">J4 (q1)</div>
                    <div class="time-block" style="flex:2; background:#3b82f6;">J1 (q2)</div>
                    <div class="time-block" style="flex:1; background:#10b981;">J3 (fin)</div>
                  ` : `
                    <div class="time-block" style="flex:2; background:#f59e0b;">J4 [Deadline Crítico]</div>
                    <div class="time-block" style="flex:4; background:#3b82f6;">J1 (CPU)</div>
                    <div class="time-block" style="flex:2; background:#8b5cf6;">J2 (CPU)</div>
                    <div class="time-block" style="flex:3; background:#10b981;">J3 (CPU)</div>
                  `}
                </div>
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla de Trabajos en Carga de Prueba</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Trabajo</th>
                    <th>Naturaleza</th>
                    <th>Ráfaga CPU</th>
                    <th>Ráfaga E/S</th>
                    <th>Deadline Límite</th>
                    <th>Comportamiento en ${s.systemType}</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.jobs.map(j => `
                    <tr>
                      <td><strong>${j.id}</strong></td>
                      <td>${j.type}</td>
                      <td>${j.cpu} ms</td>
                      <td>${j.io} ms</td>
                      <td>${j.deadline} ms</td>
                      <td>
                        <span class="badge ${s.systemType === 'batch' && j.io > 0 ? 'badge-danger' : 'badge-success'}">
                          ${s.systemType === 'batch' && j.io > 0 ? 'Pausa CPU en E/S' : 'Optimizado'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Utilización de CPU", value: `${cpuUtil}%`, subtext: "Aprovechamiento del hardware" },
            { label: "Latencia de Respuesta", value: `${latency}`, subtext: "Percepción de interacción" },
            { label: "Rendimiento (Throughput)", value: `${throughput}`, subtext: "Trabajos terminados por segundo" },
            { label: "Plazos Críticos Cumplidos", value: `${deadlinesMet}`, subtext: "Tolerancia a retrasos" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 3: HISTORIA - LÍNEA TEMPORAL Y BANCO DE GENERACIONES
  // --------------------------------------------------------------------------
  3: {
    state: {
      generation: 3
    },
    generationsData: {
      1: {
        title: "1ª Generación (1945-1955)",
        tech: "Tubos de Vacío y Tableros de Conmutadores",
        clock: "2 kHz",
        ram: "1 KB",
        os: "Ninguno (Programación manual directa en máquina)",
        benchmarkSec: 3600,
        multitask: "Monotarea Absoluta",
        icon: "💡"
      },
      2: {
        title: "2ª Generación (1955-1965)",
        tech: "Transistores y Tarjetas Perforadas",
        clock: "100 kHz",
        ram: "32 KB",
        os: "Monitores Residentes (FMS, IBSYS)",
        benchmarkSec: 120,
        multitask: "Lotes Uniprogramados",
        icon: "📻"
      },
      3: {
        title: "3ª Generación (1965-1980)",
        tech: "Circuitos Integrados (SSI/MSI)",
        clock: "5 MHz",
        ram: "1 MB",
        os: "OS/360, MULTICS, Nacimiento de UNIX (1969 en C)",
        benchmarkSec: 5,
        multitask: "Multiprogramación y Tiempo Compartido",
        icon: "🖲️"
      },
      4: {
        title: "4ª Generación (1980-2005)",
        tech: "Microprocesadores VLSI (PC)",
        clock: "1.5 GHz",
        ram: "512 MB",
        os: "MS-DOS, Mac OS GUI, Windows NT, Linux (1991)",
        benchmarkSec: 0.05,
        multitask: "Multitarea Apropiativa + GUI",
        icon: "💻"
      },
      5: {
        title: "5ª Generación (Actualidad)",
        tech: "Multinúcleo, Móviles, Cloud y Virtualización",
        clock: "4.2 GHz (16 Cores)",
        ram: "32 GB",
        os: "Android, iOS, Linux Cloud, Hipervisores, Contenedores",
        benchmarkSec: 0.001,
        multitask: "Computación Concurrente Masiva",
        icon: "☁️"
      }
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.generation = 3; // UNIX 1969
      this.render();
    },
    setGen(g) {
      this.state.generation = parseInt(g, 10);
      this.render();
    },
    render() {
      const g = this.generationsData[this.state.generation];
      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Seleccionar Generación Tecnológica:</label>
              <select onchange="SSOO_SIMULATORS[3].setGen(this.value)">
                <option value="1" ${this.state.generation === 1 ? 'selected' : ''}>1ª Gen: Tubos de Vacío (1945-1955)</option>
                <option value="2" ${this.state.generation === 2 ? 'selected' : ''}>2ª Gen: Transistores y Lotes (1955-1965)</option>
                <option value="3" ${this.state.generation === 3 ? 'selected' : ''}>3ª Gen: Circuitos Integrados y UNIX (1965-1980)</option>
                <option value="4" ${this.state.generation === 4 ? 'selected' : ''}>4ª Gen: Microprocesadores y PC/Linux (1980-2005)</option>
                <option value="5" ${this.state.generation === 5 ? 'selected' : ''}>5ª Gen: Nube, Móviles y Virtualización (Actualidad)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[3].loadExample()">Hito Histórico: UNIX 1969</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <div class="gen-header">
              <span class="gen-icon">${g.icon}</span>
              <div>
                <h3 style="margin:0; color:var(--accent-blue);">${g.title}</h3>
                <p style="margin:0.25rem 0 0; color:var(--text-muted);">${g.tech}</p>
              </div>
            </div>
            <div class="gen-specs-grid">
              <div class="spec-card">
                <span class="spec-label">Paradigma de S.O.:</span>
                <strong style="color:#f8fafc;">${g.os}</strong>
              </div>
              <div class="spec-card">
                <span class="spec-label">Capacidad de Multitarea:</span>
                <strong style="color:var(--color-success);">${g.multitask}</strong>
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Comparativa de Rendimiento del Mismo Benchmark (Matriz 1000x1000)</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Generación</th>
                    <th>Frecuencia Reloj</th>
                    <th>Memoria RAM</th>
                    <th>Tiempo Benchmark</th>
                    <th>Factor de Aceleración</th>
                  </tr>
                </thead>
                <tbody>
                  ${[1, 2, 3, 4, 5].map(i => {
                    const item = this.generationsData[i];
                    return `
                      <tr class="${i === this.state.generation ? 'row-highlight' : ''}">
                        <td><strong>${item.title}</strong></td>
                        <td>${item.clock}</td>
                        <td>${item.ram}</td>
                        <td><code>${item.benchmarkSec} s</code></td>
                        <td><span class="badge ${i === this.state.generation ? 'badge-primary' : 'badge-outline'}">${i === 1 ? '1x (Base)' : (3600 / item.benchmarkSec).toLocaleString() + 'x'}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Frecuencia de Reloj", value: g.clock, subtext: "Velocidad de cómputo base" },
            { label: "Memoria RAM Física", value: g.ram, subtext: "Espacio para código y datos" },
            { label: "Tiempo de Cálculo", value: `${g.benchmarkSec} s`, subtext: "Simulación de carga pesada" },
            { label: "Nivel de Abstracción", value: `Gen ${this.state.generation} / 5`, subtext: g.multitask }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 4: COMPONENTES - ARQUITECTURA MODULAR Y FLUJO INTERNO
  // --------------------------------------------------------------------------
  4: {
    state: {
      scenario: 'run_exec',
      activeStep: 0,
      steps: []
    },
    scenarios: {
      run_exec: {
        name: "Ejecución de un nuevo ejecutable (./servidor)",
        steps: [
          { comp: "Intérprete de Comandos (Shell)", desc: "El usuario escribe './servidor'. El Shell analiza la orden e invoca fork() / execve()." },
          { comp: "Gestor de Almacenamiento y Archivos", desc: "Localiza el binario ELF en disco, comprueba permisos y lee cabeceras." },
          { comp: "Gestor de Memoria Principal", desc: "Reserva marcos de página, prepara segmentos de Texto, Datos, BSS, Heap y Stack." },
          { comp: "Gestor de Procesos", desc: "Crea el PCB (task_struct), asigna PID y encola el proceso en la Cola de Listos." },
          { comp: "Planificador de CPU (Scheduler)", desc: "Asigna un núcleo de CPU disponible y conmuta el contexto para iniciar ejecución." }
        ]
      },
      file_read: {
        name: "Lectura de archivo protegido (/etc/shadow)",
        steps: [
          { comp: "Gestor de Procesos", desc: "Proceso de usuario ejecuta la syscall open('/etc/shadow', O_RDONLY)." },
          { comp: "Sistema de Protección y Seguridad", desc: "Verifica UID/GID del proceso. Detecta que no es root -> deniega el acceso con EACCES." },
          { comp: "Gestor de E/S y Archivos", desc: "Cancela la petición antes de consultar el disco físico." },
          { comp: "Gestor de Procesos", desc: "Retorna código de error -1 al proceso y establece errno = EACCES." }
        ]
      }
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.scenario = 'run_exec';
      this.state.activeStep = 0;
      this.state.steps = this.scenarios.run_exec.steps;
      this.render();
    },
    setScenario(sc) {
      this.state.scenario = sc;
      this.state.activeStep = 0;
      this.state.steps = this.scenarios[sc].steps;
      this.render();
    },
    nextStep() {
      if (this.state.activeStep < this.state.steps.length - 1) {
        this.state.activeStep++;
        this.render();
      }
    },
    reset() {
      this.state.activeStep = 0;
      this.render();
    },
    render() {
      const s = this.state;
      const current = s.steps[s.activeStep];
      const components = [
        "Intérprete de Comandos (Shell)",
        "Gestor de Procesos",
        "Gestor de Memoria Principal",
        "Gestor de E/S",
        "Gestor de Almacenamiento y Archivos",
        "Sistema de Protección y Seguridad"
      ];

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Flujo de Operación entre Componentes:</label>
              <select onchange="SSOO_SIMULATORS[4].setScenario(this.value)">
                <option value="run_exec" ${s.scenario === 'run_exec' ? 'selected' : ''}>1. Lanzamiento de un Ejecutable</option>
                <option value="file_read" ${s.scenario === 'file_read' ? 'selected' : ''}>2. Intento de Lectura Archivo Protegido</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[4].nextStep()" ${s.activeStep >= s.steps.length - 1 ? 'disabled' : ''}>Paso Siguiente ➔</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[4].loadExample()">Cargar Ejercicio de Ejemplo</button>
              <button class="btn btn-outline" onclick="SSOO_SIMULATORS[4].reset()">Reiniciar Flujo</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Diagrama Modular del Núcleo (Paso ${s.activeStep + 1} de ${s.steps.length})</h4>
            <div class="components-grid">
              ${components.map(c => {
                const isActive = current && current.comp.includes(c.split(' ')[0]);
                return `
                  <div class="component-card ${isActive ? 'active-component' : ''}">
                    <div class="comp-icon">${isActive ? '⚡' : '📦'}</div>
                    <div class="comp-title">${c}</div>
                    <div class="comp-status">${isActive ? 'PROCESANDO MENSAJE' : 'En reposo'}</div>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="step-explanation-box">
              <span class="badge badge-primary">Paso ${s.activeStep + 1}</span>
              <strong>${current ? current.comp : ''}:</strong> ${current ? current.desc : ''}
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Registro de Eventos y Coordinación entre Módulos</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Subsistema Involucrado</th>
                    <th>Acción Realizada</th>
                    <th>Estado de Transición</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.steps.map((st, idx) => `
                    <tr class="${idx === s.activeStep ? 'row-highlight' : ''}">
                      <td>Paso ${idx + 1}</td>
                      <td><strong>${st.comp}</strong></td>
                      <td>${st.desc}</td>
                      <td>
                        <span class="badge ${idx < s.activeStep ? 'badge-success' : idx === s.activeStep ? 'badge-warning' : 'badge-outline'}">
                          ${idx < s.activeStep ? '✓ Completado' : idx === s.activeStep ? '● En curso' : '○ Pendiente'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Módulo Activo", value: current ? current.comp.split(' ')[0] : 'Idle', subtext: "Controlador actual" },
            { label: "Paso del Flujo", value: `${s.activeStep + 1} / ${s.steps.length}`, subtext: "Progreso de interacción" },
            { label: "Subsistemas Requeridos", value: `${s.steps.length}`, subtext: "Coordinación modular" },
            { label: "Integridad del SO", value: "Protegida", subtext: "Modo supervisor activo" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 5: SERVICIOS - AUDITOR DE PETICIONES Y SERVICIOS
  // --------------------------------------------------------------------------
  5: {
    state: {
      category: 'all',
      log: []
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.log = [
        { id: 101, pid: 42, service: "Ejecución de Programas", type: "usuario", desc: "Lanzar compilador /usr/bin/gcc", status: "Aprobado", latency: "140 µs" },
        { id: 102, pid: 42, service: "Operación de E/S", type: "usuario", desc: "read(fd=3, buffer, 4096)", status: "Aprobado", latency: "45 µs" },
        { id: 103, pid: 88, service: "Protección y Seguridad", type: "sistema", desc: "Escritura en página de solo lectura", status: "Bloqueado (SIGSEGV)", statusType: "danger", latency: "12 µs" },
        { id: 104, pid: 15, service: "Asignación de Recursos", type: "sistema", desc: "Reserva de 200 MB en Heap", status: "Aprobado", latency: "25 µs" },
        { id: 105, pid: 90, service: "Contabilidad (Accounting)", type: "sistema", desc: "Registro de ciclos de CPU para facturación", status: "Completado", latency: "8 µs" }
      ];
      this.render();
    },
    submitRequest(serviceName, type) {
      const id = 100 + this.state.log.length + 1;
      const isBlocked = Math.random() < 0.2;
      this.state.log.unshift({
        id,
        pid: Math.floor(Math.random() * 80) + 10,
        service: serviceName,
        type: type,
        desc: `Petición dinámica de servicio [${serviceName}]`,
        status: isBlocked ? "Bloqueado (Seguridad)" : "Aprobado",
        statusType: isBlocked ? "danger" : "success",
        latency: `${Math.floor(Math.random() * 50) + 15} µs`
      });
      this.render();
    },
    render() {
      const s = this.state;
      const approved = s.log.filter(l => l.status.includes('Aprobado') || l.status.includes('Completado')).length;
      const blocked = s.log.filter(l => l.status.includes('Bloqueado')).length;

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Inyectar Petición de Servicio:</label>
              <select id="sim5-service-select">
                <option value="Operación de E/S|usuario">E/S: Lectura/Escritura de disco (Usuario)</option>
                <option value="Manipulación de Archivos|usuario">Archivos: Crear / Renombrar (Usuario)</option>
                <option value="Comunicaciones|usuario">Comunicaciones: Socket sendto() (Usuario)</option>
                <option value="Asignación de Recursos|sistema">Asignación de Recursos: Reserva RAM (Sistema)</option>
                <option value="Protección y Seguridad|sistema">Seguridad: Verificación Permisos (Sistema)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="
                const val = document.getElementById('sim5-service-select').value.split('|');
                SSOO_SIMULATORS[5].submitRequest(val[0], val[1]);
              ">+ Solicitar Servicio</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[5].loadExample()">Cargar Ejercicio de Ejemplo</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Arquitectura de Servicios del Sistema Operativo</h4>
            <div class="dual-service-view">
              <div class="service-box user-side">
                <h4 style="color:var(--accent-blue);">👤 Servicios al Usuario / Aplicaciones</h4>
                <ul>
                  <li>Interfaz de usuario (CLI / GUI)</li>
                  <li>Ejecución de programas</li>
                  <li>Operaciones de Entrada / Salida</li>
                  <li>Manipulación de archivos y directorios</li>
                  <li>Comunicaciones entre procesos (IPC)</li>
                </ul>
              </div>
              <div class="service-box kernel-side">
                <h4 style="color:var(--color-success);">⚙️ Servicios para la Eficiencia del Sistema</h4>
                <ul>
                  <li>Asignación equitativa de recursos</li>
                  <li>Contabilidad y métricas de uso (Accounting)</li>
                  <li>Detección y tratamiento de errores</li>
                  <li>Protección de memoria y control de acceso</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Registro de Auditoría de Servicios Despachados</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>PID</th>
                    <th>Servicio Solicitado</th>
                    <th>Vertiente</th>
                    <th>Descripción de la Operación</th>
                    <th>Resolución del Kernel</th>
                    <th>Latencia</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.log.map(item => `
                    <tr>
                      <td>#${item.id}</td>
                      <td><code>PID_${item.pid}</code></td>
                      <td><strong>${item.service}</strong></td>
                      <td><span class="badge ${item.type === 'usuario' ? 'badge-primary' : 'badge-outline'}">${item.type.toUpperCase()}</span></td>
                      <td>${item.desc}</td>
                      <td>
                        <span class="badge ${item.statusType === 'danger' ? 'badge-danger' : 'badge-success'}">
                          ${item.status}
                        </span>
                      </td>
                      <td><code>${item.latency}</code></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Peticiones Atendidas", value: `${approved}`, subtext: "Servicios prestados con éxito" },
            { label: "Bloqueos por Seguridad", value: `${blocked}`, subtext: "Intentos no autorizados" },
            { label: "Latencia Media", value: "48 µs", subtext: "Tiempo de despacho de servicio" },
            { label: "Tasa de Disponibilidad", value: "99.98%", subtext: "Servicios del SO operativos" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 6: INTERFAZ DE PROGRAMACIÓN - SYSCALL & MODO DUAL
  // --------------------------------------------------------------------------
  6: {
    state: {
      syscall: 'write',
      step: 0,
      steps: [
        {
          mode: "Modo Usuario (Ring 3)",
          bit: 1,
          regs: { rax: "0x01 (sys_write)", rdi: "1 (stdout)", rsi: "0x7ffd... (buffer)", rdx: "14 (longitud)" },
          desc: "1. La aplicación invoca el wrapper write() de la librería libc. Los parámetros se preparan en los registros de la CPU."
        },
        {
          mode: "Transición: Trampa Hardware (Trap / Syscall)",
          bit: "1 ➔ 0",
          regs: { rax: "0x01", rdi: "1", rsi: "0x7ffd...", rdx: "14", rip: "sys_call_table[1]" },
          desc: "2. Se ejecuta la instrucción ensamblador 'syscall'. El hardware cambia el bit de modo a 0 (Modo Supervisor) y salva PC y registros en la pila del kernel."
        },
        {
          mode: "Modo Núcleo / Supervisor (Ring 0)",
          bit: 0,
          regs: { rax: "sys_write()", rdi: "vfs_write", rsi: "tty_driver", rdx: "14" },
          desc: "3. El kernel indexa la tabla sys_call_table, localiza sys_write(), comprueba los punteros y transfiere los 14 bytes al driver del terminal."
        },
        {
          mode: "Retorno a Modo Usuario (Ring 3)",
          bit: "0 ➔ 1",
          regs: { rax: "14 (bytes escritos)", rdi: "1", rsi: "0x7ffd...", rdx: "14" },
          desc: "4. El kernel ejecuta 'sysret' o 'iret'. Se restaura el contexto del usuario, el bit de modo vuelve a 1 y el valor retornado (14) queda en %rax."
        }
      ]
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.step = 0;
      this.render();
    },
    nextStep() {
      this.state.step = (this.state.step + 1) % this.state.steps.length;
      this.render();
    },
    reset() {
      this.state.step = 0;
      this.render();
    },
    render() {
      const s = this.state;
      const cur = s.steps[s.step];
      const isKernel = cur.bit === 0 || cur.bit === "1 ➔ 0";

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Llamada al Sistema a Simular:</label>
              <select onchange="SSOO_SIMULATORS[6].reset()">
                <option value="write">sys_write(fd=1, buf, count=14)</option>
                <option value="read">sys_read(fd=0, buf, count=256)</option>
                <option value="fork">sys_fork()</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[6].nextStep()">Avanzar Ciclo CPU (${s.step + 1}/4) ➔</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[6].loadExample()">Cargar Ejercicio de Ejemplo</button>
              <button class="btn btn-outline" onclick="SSOO_SIMULATORS[6].reset()">Reiniciar</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Estado del Procesador y Cambio de Modo Dual</h4>
            
            <div class="dual-mode-diagram">
              <div class="mode-box ${!isKernel ? 'mode-active' : ''}">
                <div class="mode-badge">Ring 3</div>
                <h4>MODO USUARIO (Bit de Modo = 1)</h4>
                <p class="text-muted">Instrucciones no privilegiadas. Acceso directo a memoria del kernel bloqueado por hardware.</p>
              </div>

              <div class="trap-bridge">
                <div class="trap-arrow ${s.step === 1 ? 'active-trap' : s.step === 3 ? 'return-trap' : ''}">
                  ${s.step === 1 ? '⚡ TRAMPA (syscall)' : s.step === 3 ? '↩ RETORNO (sysret)' : '⇄ Conmutación'}
                </div>
              </div>

              <div class="mode-box ${isKernel ? 'mode-active' : ''}">
                <div class="mode-badge" style="background:#ef4444;">Ring 0</div>
                <h4>MODO NÚCLEO (Bit de Modo = 0)</h4>
                <p class="text-muted">Acceso irrestricto al hardware, tablas de páginas y espacio de memoria completo.</p>
              </div>
            </div>

            <div class="step-explanation-box" style="margin-top:1rem;">
              <strong>${cur.mode}:</strong> ${cur.desc}
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Banco de Registros de la CPU (x86-64) en este Paso</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Registro</th>
                    <th>Valor Actual</th>
                    <th>Propósito en Syscall</th>
                    <th>Nivel de Privilegio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>%rax</code></td>
                    <td><strong style="color:var(--accent-blue);">${cur.regs.rax}</strong></td>
                    <td>Número de Syscall / Código de Retorno</td>
                    <td>${cur.mode}</td>
                  </tr>
                  <tr>
                    <td><code>%rdi</code></td>
                    <td><code>${cur.regs.rdi}</code></td>
                    <td>Primer argumento (File Descriptor)</td>
                    <td>${cur.mode}</td>
                  </tr>
                  <tr>
                    <td><code>%rsi</code></td>
                    <td><code>${cur.regs.rsi}</code></td>
                    <td>Segundo argumento (Puntero a buffer de memoria)</td>
                    <td>${cur.mode}</td>
                  </tr>
                  <tr>
                    <td><code>%rdx</code></td>
                    <td><code>${cur.regs.rdx}</code></td>
                    <td>Tercer argumento (Contador de bytes)</td>
                    <td>${cur.mode}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Modo Actual CPU", value: cur.bit === 0 ? "Núcleo (Ring 0)" : "Usuario (Ring 3)", subtext: `Bit de modo: ${cur.bit}` },
            { label: "Paso de la Syscall", value: `${s.step + 1} de 4`, subtext: "Transición hardware-software" },
            { label: "Ciclos Invertidos", value: `${(s.step + 1) * 35} ciclos`, subtext: "Sobrecarga de cambio de modo" },
            { label: "Seguridad de Kernel", value: "Garantizada", subtext: "Aislamiento por hardware" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 7: OPERACIÓN DEL SISTEMA - ARRANQUE E INTERRUPCIONES
  // --------------------------------------------------------------------------
  7: {
    state: {
      mode: 'boot', // 'boot' o 'interrupts'
      bootStep: 5,
      irqCount: 142,
      timerTicks: 1240,
      activeInterrupt: null,
      bootPhases: [
        { name: "POST (Power-On Self-Test)", comp: "Firmware BIOS / UEFI", desc: "Verificación de integridad de hardware, CPU, memoria RAM y buses." },
        { name: "Lectura de MBR / Tabla GPT", comp: "Controlador de Disco", desc: "El firmware lee el primer sector físico del disco de arranque en memoria." },
        { name: "Cargador de Arranque (GRUB)", comp: "Bootloader", desc: "Muestra menú de arranque, carga la imagen del kernel y el initrd en RAM." },
        { name: "Descompresión y Carga del Kernel", comp: "Núcleo del SO", desc: "Inicializa la memoria virtual, la tabla de páginas y los controladores esenciales." },
        { name: "Montaje del Sistema de Ficheros Raíz", comp: "VFS / ext4", desc: "El kernel monta '/' en modo solo lectura y ejecuta el primer proceso." },
        { name: "Lanzamiento de PID 1 (systemd / init)", comp: "Espacio de Usuario", desc: "Primer proceso de usuario; inicializa demonios, servicios de red y la interfaz." }
      ]
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.mode = 'boot';
      this.state.bootStep = 5;
      this.render();
    },
    setMode(m) {
      this.state.mode = m;
      this.render();
    },
    advanceBoot() {
      if (this.state.bootStep < this.state.bootPhases.length - 1) {
        this.state.bootStep++;
      } else {
        this.state.bootStep = 0;
      }
      this.render();
    },
    triggerIRQ(type) {
      this.state.irqCount++;
      if (type === 'timer') this.state.timerTicks += 10;
      this.state.activeInterrupt = {
        type,
        time: new Date().toLocaleTimeString(),
        vector: type === 'timer' ? '0x20 (IRQ 0)' : type === 'teclado' ? '0x21 (IRQ 1)' : '0x2E (IRQ 14 Disco)'
      };
      this.render();
    },
    render() {
      const s = this.state;
      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Seleccionar Módulo de Operación:</label>
              <select onchange="SSOO_SIMULATORS[7].setMode(this.value)">
                <option value="boot" ${s.mode === 'boot' ? 'selected' : ''}>Secuencia de Arranque (Bootstrap)</option>
                <option value="interrupts" ${s.mode === 'interrupts' ? 'selected' : ''}>Gestor de Interrupciones y Reloj (ISR)</option>
              </select>
            </div>
            <div class="control-actions">
              ${s.mode === 'boot' ? `
                <button class="btn btn-primary" onclick="SSOO_SIMULATORS[7].advanceBoot()">Paso de Arranque ➔</button>
              ` : `
                <button class="btn btn-primary" onclick="SSOO_SIMULATORS[7].triggerIRQ('timer')">⚡ Tick de Reloj (Timer)</button>
                <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[7].triggerIRQ('teclado')">⌨️ Tecla Pulsada (IRQ 1)</button>
                <button class="btn btn-outline" onclick="SSOO_SIMULATORS[7].triggerIRQ('disco')">💽 E/S Disco Terminada</button>
              `}
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[7].loadExample()">Cargar Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            ${s.mode === 'boot' ? `
              <h4 class="box-title">Progreso del Ciclo de Arranque (Fase ${s.bootStep + 1} de ${s.bootPhases.length})</h4>
              <div class="boot-steps-grid">
                ${s.bootPhases.map((b, idx) => `
                  <div class="boot-phase-card ${idx <= s.bootStep ? 'boot-done' : ''} ${idx === s.bootStep ? 'boot-current' : ''}">
                    <div class="phase-number">${idx + 1}</div>
                    <strong>${b.name}</strong>
                    <small style="display:block; color:var(--text-muted); margin-top:0.25rem;">${b.comp}</small>
                  </div>
                `).join('')}
              </div>
              <div class="step-explanation-box" style="margin-top:1rem;">
                <strong>Detalle de la Fase:</strong> ${s.bootPhases[s.bootStep].desc}
              </div>
            ` : `
              <h4 class="box-title">Vector de Interrupciones (IDT) y Manejador en Tiempo Real</h4>
              <div class="idt-view">
                <div class="irq-box ${s.activeInterrupt ? 'irq-flash' : ''}">
                  <span class="badge badge-warning">Última Interrupción Atendida</span>
                  <h3 style="margin:0.5rem 0; color:var(--accent-blue);">${s.activeInterrupt ? s.activeInterrupt.vector : '0x20 (Timer Hardware)'}</h3>
                  <p class="text-muted" style="margin:0;">
                    ${s.activeInterrupt ? `Tipo: ${s.activeInterrupt.type} | Registros salvados en la pila y ejecutada la ISR correspondiente.` : 'Esperando señal hardware o tick de temporizador...'}
                  </p>
                </div>
              </div>
            `}
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla de Control de Interrupciones del Sistema</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Línea IRQ</th>
                    <th>Vector IDT</th>
                    <th>Dispositivo Generador</th>
                    <th>Función de la Rutina (ISR)</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>IRQ 0</code></td>
                    <td><code>0x20</code></td>
                    <td>Temporizador 8254 (Timer Tick)</td>
                    <td>Actualizar tiempo del sistema y conmutar quantum de CPU</td>
                    <td><span class="badge badge-primary">Periódica</span></td>
                  </tr>
                  <tr>
                    <td><code>IRQ 1</code></td>
                    <td><code>0x21</code></td>
                    <td>Controlador de Teclado</td>
                    <td>Leer código de escaneo del puerto 0x60 y enviar a buffer</td>
                    <td><span class="badge badge-success">Asíncrona</span></td>
                  </tr>
                  <tr>
                    <td><code>IRQ 14</code></td>
                    <td><code>0x2E</code></td>
                    <td>Controlador de Almacenamiento</td>
                    <td>Notificar fin de transferencia DMA de sector de disco</td>
                    <td><span class="badge badge-warning">E/S Disco</span></td>
                  </tr>
                  <tr>
                    <td><code>Trap 14</code></td>
                    <td><code>0x0E</code></td>
                    <td>Unidad de Gestión de Memoria (MMU)</td>
                    <td>Fallo de Página (#PF): Cargar página requerida desde swap</td>
                    <td><span class="badge badge-danger">Excepción</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Estado del Sistema", value: s.mode === 'boot' ? (s.bootStep === 5 ? "Operativo (PID 1)" : "Arrancando...") : "Operativo Normal", subtext: "Nivel de ejecución activo" },
            { label: "Ticks de Temporizador", value: `${s.timerTicks}`, subtext: "Prevención de monopolio CPU" },
            { label: "Interrupciones Totales", value: `${s.irqCount}`, subtext: "Eventos hardware procesados" },
            { label: "Latencia ISR", value: "< 2.5 µs", subtext: "Tiempo de salvaguarda de contexto" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 8: ESTRUCTURA - COMPARADOR DE ARQUITECTURAS DE KERNEL
  // --------------------------------------------------------------------------
  8: {
    state: {
      arch: 'monolithic', // 'monolithic', 'microkernel', 'layered', 'hybrid'
      crashedDriver: false
    },
    archData: {
      monolithic: {
        name: "Arquitectura Monolítica",
        desc: "Todos los servicios (VFS, IPC, Drivers, Scheduler, Red) residen en el espacio de direcciones de Ring 0.",
        ipcOverhead: "0 ns (Llamada C directa)",
        faultTolerance: "Baja: Un fallo en un driver tumba todo el sistema (Kernel Panic / Pantallazo Azul).",
        kernelMemory: "64 MB",
        score: "40 / 100"
      },
      microkernel: {
        name: "Arquitectura Microkernel",
        desc: "Solo planificación básica, memoria física e IPC residen en Ring 0. Drivers y VFS son servidores en espacio de usuario.",
        ipcOverhead: "1850 ns (Múltiples traps y copias IPC)",
        faultTolerance: "Máxima: El fallo de un driver solo mata su proceso de usuario y se reinicia al instante.",
        kernelMemory: "8 MB",
        score: "95 / 100"
      },
      layered: {
        name: "Arquitectura por Capas",
        desc: "Capas concéntricas $N$ donde la capa superior solo invoca a la inferior inmediata.",
        ipcOverhead: "450 ns (Saltos entre capas)",
        faultTolerance: "Media: Depuración sencilla y modular.",
        kernelMemory: "32 MB",
        score: "70 / 100"
      },
      hybrid: {
        name: "Arquitectura Híbrida (Windows / macOS)",
        desc: "Combina micronúcleo con subsistemas críticos (GUI, drivers de red) integrados en Ring 0 para velocidad.",
        ipcOverhead: "120 ns",
        faultTolerance: "Buena: Equilibrio práctico entre estabilidad y velocidad comercial.",
        kernelMemory: "48 MB",
        score: "80 / 100"
      }
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.arch = 'monolithic';
      this.state.crashedDriver = false;
      this.render();
    },
    setArch(a) {
      this.state.arch = a;
      this.state.crashedDriver = false;
      this.render();
    },
    injectCrash() {
      this.state.crashedDriver = true;
      this.render();
    },
    recover() {
      this.state.crashedDriver = false;
      this.render();
    },
    render() {
      const s = this.state;
      const data = this.archData[s.arch];

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Arquitectura de Núcleo a Probar:</label>
              <select onchange="SSOO_SIMULATORS[8].setArch(this.value)">
                <option value="monolithic" ${s.arch === 'monolithic' ? 'selected' : ''}>Monolítica (UNIX original, Linux tradicional)</option>
                <option value="microkernel" ${s.arch === 'microkernel' ? 'selected' : ''}>Microkernel (Mach, Minix, QNX)</option>
                <option value="layered" ${s.arch === 'layered' ? 'selected' : ''}>Por Capas (THE de Dijkstra)</option>
                <option value="hybrid" ${s.arch === 'hybrid' ? 'selected' : ''}>Híbrida (Windows NT, macOS XNU)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-danger" onclick="SSOO_SIMULATORS[8].injectCrash()" ${s.crashedDriver ? 'disabled' : ''}>💥 Inyectar Fallo en Driver de Disco</button>
              ${s.crashedDriver ? `<button class="btn btn-success" onclick="SSOO_SIMULATORS[8].recover()">🔄 Reiniciar / Recuperar</button>` : ''}
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[8].loadExample()">Cargar Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Esquema Arquitectónico: ${data.name}</h4>
            
            ${s.crashedDriver ? `
              <div class="panic-banner ${s.arch === 'monolithic' ? 'panic-fatal' : 'panic-recovered'}">
                ${s.arch === 'monolithic' ? `
                  <h3>☠️ KERNEL PANIC / BSOD (Parada Catastrófica del Sistema)</h3>
                  <p>Al ejecutarse el driver de disco en el mismo espacio de direcciones del kernel (Ring 0), su desreferencia nula ha corrompido la memoria del sistema. Requiere reinicio físico del computador.</p>
                ` : `
                  <h3>🛡️ FALLO CONTENIDO POR EL MICROKERNEL</h3>
                  <p>El driver de disco falló como proceso de usuario independiente (PID 72). El micronúcleo continúa intacto y ha reiniciado automáticamente el servidor de disco en 2 ms sin pérdida de datos ni bloqueo de la máquina.</p>
                `}
              </div>
            ` : `
              <div class="arch-visual-stack">
                <div class="arch-layer user-layer">
                  <span class="layer-tag">ESPACIO DE USUARIO (Ring 3)</span>
                  <div class="layer-modules">
                    <span class="module-chip">Aplicación Web</span>
                    <span class="module-chip">Shell Bash</span>
                    ${s.arch === 'microkernel' ? `
                      <span class="module-chip chip-highlight">Servidor VFS</span>
                      <span class="module-chip chip-highlight">Driver Disco</span>
                      <span class="module-chip chip-highlight">Pila TCP/IP</span>
                    ` : ''}
                  </div>
                </div>

                <div class="arch-boundary-line">────── Límite de Protección Hardware (Syscall / IPC) ──────</div>

                <div class="arch-layer kernel-layer">
                  <span class="layer-tag" style="background:#ef4444;">ESPACIO DE KERNEL (Ring 0)</span>
                  <div class="layer-modules">
                    <span class="module-chip">Planificador (Scheduler)</span>
                    <span class="module-chip">Gestión Memoria Física</span>
                    ${s.arch === 'monolithic' || s.arch === 'hybrid' ? `
                      <span class="module-chip">Sistema de Ficheros (VFS)</span>
                      <span class="module-chip">Drivers de Dispositivos</span>
                      <span class="module-chip">Pila de Red</span>
                    ` : `
                      <span class="module-chip chip-primary">Paso de Mensajes (IPC)</span>
                    `}
                  </div>
                </div>
              </div>
            `}
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Evaluación Cuantitativa de la Arquitectura</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Arquitectura</th>
                    <th>Sobrecarga IPC / Llamada</th>
                    <th>Memoria del Núcleo</th>
                    <th>Tolerancia a Fallos</th>
                    <th>Rendimiento Puro</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.keys(this.archData).map(k => {
                    const it = this.archData[k];
                    return `
                      <tr class="${k === s.arch ? 'row-highlight' : ''}">
                        <td><strong>${it.name}</strong></td>
                        <td><code>${it.ipcOverhead}</code></td>
                        <td>${it.kernelMemory}</td>
                        <td>${it.faultTolerance}</td>
                        <td><span class="badge ${k === 'monolithic' ? 'badge-success' : k === 'microkernel' ? 'badge-warning' : 'badge-primary'}">${k === 'monolithic' ? 'Máximo' : k === 'microkernel' ? 'Moderado' : 'Alto'}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Sobrecarga de Syscall", value: data.ipcOverhead, subtext: "Tiempo en despachar la orden" },
            { label: "Tamaño Kernel RAM", value: data.kernelMemory, subtext: "Espacio residente permanente" },
            { label: "Índice de Fiabilidad", value: data.score, subtext: "Tolerancia ante drivers defectuosos" },
            { label: "Estado del Sistema", value: s.crashedDriver ? (s.arch === 'monolithic' ? 'Colapsado' : 'Recuperado') : 'Estable', subtext: "Disponibilidad del hardware" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 9: PROCESOS - CICLO DE VIDA Y PCB INSPECTOR
  // --------------------------------------------------------------------------
  9: {
    state: {
      processes: [],
      nextPid: 100,
      contextSwitches: 0,
      activeProcess: null
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.nextPid = 104;
      this.state.contextSwitches = 12;
      this.state.processes = [
        { pid: 1, ppid: 0, name: "systemd", state: "listo", pc: "0x7f0020", priority: 1, cpuBurst: 4 },
        { pid: 101, ppid: 1, name: "bash", state: "ejecucion", pc: "0x4012a4", priority: 5, cpuBurst: 2 },
        { pid: 102, ppid: 101, name: "cat", state: "bloqueado", pc: "0x400f80", priority: 10, cpuBurst: 1 },
        { pid: 103, ppid: 101, name: "grep (zombie)", state: "terminado", pc: "0x400000", priority: 10, cpuBurst: 0 }
      ];
      this.state.activeProcess = this.state.processes[1];
      this.render();
    },
    createProcess() {
      const pid = this.state.nextPid++;
      this.state.processes.push({
        pid,
        ppid: 101,
        name: `proceso_${pid}`,
        state: "nuevo",
        pc: "0x400000",
        priority: Math.floor(Math.random() * 10) + 1,
        cpuBurst: Math.floor(Math.random() * 5) + 1
      });
      this.render();
    },
    admitToReady(pid) {
      const p = this.state.processes.find(x => x.pid === pid);
      if (p && p.state === 'nuevo') {
        p.state = 'listo';
        this.render();
      }
    },
    dispatchToRunning(pid) {
      // Poner el actual en listo
      const current = this.state.processes.find(x => x.state === 'ejecucion');
      if (current) current.state = 'listo';

      const p = this.state.processes.find(x => x.pid === pid);
      if (p) {
        p.state = 'ejecucion';
        this.state.activeProcess = p;
        this.state.contextSwitches++;
      }
      this.render();
    },
    blockForIO(pid) {
      const p = this.state.processes.find(x => x.pid === pid);
      if (p && p.state === 'ejecucion') {
        p.state = 'bloqueado';
        // Despachar otro listo si hay
        const nextReady = this.state.processes.find(x => x.state === 'listo');
        if (nextReady) {
          nextReady.state = 'ejecucion';
          this.state.activeProcess = nextReady;
        } else {
          this.state.activeProcess = null;
        }
        this.state.contextSwitches++;
        this.render();
      }
    },
    unblockIO(pid) {
      const p = this.state.processes.find(x => x.pid === pid);
      if (p && p.state === 'bloqueado') {
        p.state = 'listo';
        this.render();
      }
    },
    terminateProcess(pid) {
      const p = this.state.processes.find(x => x.pid === pid);
      if (p) {
        p.state = 'terminado';
        if (this.state.activeProcess && this.state.activeProcess.pid === pid) {
          const next = this.state.processes.find(x => x.state === 'listo');
          if (next) {
            next.state = 'ejecucion';
            this.state.activeProcess = next;
          } else {
            this.state.activeProcess = null;
          }
        }
        this.render();
      }
    },
    render() {
      const s = this.state;
      const countByState = { nuevo: 0, listo: 0, ejecucion: 0, bloqueado: 0, terminado: 0 };
      s.processes.forEach(p => countByState[p.state] = (countByState[p.state] || 0) + 1);

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[9].createProcess()">+ Crear Proceso (fork)</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[9].loadExample()">Cargar Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Diagrama de Transición de los 5 Estados del Proceso</h4>
            <div class="states-diagram">
              <div class="state-node ${countByState.nuevo > 0 ? 'node-active' : ''}">
                <div class="node-title">1. Nuevo</div>
                <div class="node-count">${countByState.nuevo} proc</div>
              </div>
              <div class="state-arrow">admitido ➔</div>
              <div class="state-node ${countByState.listo > 0 ? 'node-active' : ''}">
                <div class="node-title">2. Listo (Ready)</div>
                <div class="node-count">${countByState.listo} proc</div>
              </div>
              <div class="state-arrow">dispatch ➔<br>⬅ timeout</div>
              <div class="state-node ${countByState.ejecucion > 0 ? 'node-running' : ''}">
                <div class="node-title">3. En Ejecución</div>
                <div class="node-count">${countByState.ejecucion} proc</div>
              </div>
              <div class="state-arrow">salida ➔</div>
              <div class="state-node ${countByState.terminado > 0 ? 'node-terminated' : ''}">
                <div class="node-title">5. Terminado</div>
                <div class="node-count">${countByState.terminado} proc</div>
              </div>
            </div>
            <div style="text-align:center; margin-top:0.75rem;">
              <span class="state-node-sub ${countByState.bloqueado > 0 ? 'node-active' : ''}">
                4. Esperando / Bloqueado en E/S (${countByState.bloqueado} proc)
              </span>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla del Sistema y Bloque de Control de Proceso (PCB Inspector)</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>PID</th>
                    <th>PPID</th>
                    <th>Nombre</th>
                    <th>Estado Actual</th>
                    <th>PC (IP)</th>
                    <th>Prioridad</th>
                    <th>Acciones de Transición</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.processes.map(p => `
                    <tr class="${p.state === 'ejecucion' ? 'row-highlight' : ''}">
                      <td><code>PID_${p.pid}</code></td>
                      <td>PID_${p.ppid}</td>
                      <td><strong>${p.name}</strong></td>
                      <td>
                        <span class="badge ${p.state === 'ejecucion' ? 'badge-primary' : p.state === 'listo' ? 'badge-success' : p.state === 'bloqueado' ? 'badge-warning' : p.state === 'nuevo' ? 'badge-outline' : 'badge-danger'}">
                          ${p.state.toUpperCase()}
                        </span>
                      </td>
                      <td><code>${p.pc}</code></td>
                      <td>${p.priority}</td>
                      <td>
                        ${p.state === 'nuevo' ? `
                          <button class="btn btn-xs btn-outline" onclick="SSOO_SIMULATORS[9].admitToReady(${p.pid})">Admitir a Listo</button>
                        ` : p.state === 'listo' ? `
                          <button class="btn btn-xs btn-primary" onclick="SSOO_SIMULATORS[9].dispatchToRunning(${p.pid})">Despachar a CPU</button>
                        ` : p.state === 'ejecucion' ? `
                          <button class="btn btn-xs btn-warning" onclick="SSOO_SIMULATORS[9].blockForIO(${p.pid})">Bloquear E/S</button>
                          <button class="btn btn-xs btn-danger" onclick="SSOO_SIMULATORS[9].terminateProcess(${p.pid})">Terminar</button>
                        ` : p.state === 'bloqueado' ? `
                          <button class="btn btn-xs btn-success" onclick="SSOO_SIMULATORS[9].unblockIO(${p.pid})">Fin E/S (Despertar)</button>
                        ` : `
                          <small class="text-muted">Zombie (esperando wait)</small>
                        `}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Procesos Activos", value: `${s.processes.filter(p => p.state !== 'terminado').length}`, subtext: "Carga en memoria del sistema" },
            { label: "Cambios de Contexto", value: `${s.contextSwitches}`, subtext: "Conmutaciones de PCB" },
            { label: "En Cola de Listos", value: `${countByState.listo}`, subtext: "Esperando asignación de CPU" },
            { label: "En Espera de E/S", value: `${countByState.bloqueado}`, subtext: "Bloqueados en canal periférico" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 10: PLANIFICACIÓN DE CPU - SUITE INTEGRAL Y GANTT
  // --------------------------------------------------------------------------
  10: {
    state: {
      algorithm: 'rr', // 'fcfs', 'sjf', 'srtf', 'rr', 'priority'
      quantum: 2,
      processes: [],
      schedule: [],
      metrics: {}
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.algorithm = 'rr';
      this.state.quantum = 2;
      this.state.processes = [
        { pid: "P1", arrival: 0, burst: 5, priority: 3 },
        { pid: "P2", arrival: 1, burst: 3, priority: 1 },
        { pid: "P3", arrival: 2, burst: 8, priority: 4 },
        { pid: "P4", arrival: 3, burst: 2, priority: 2 }
      ];
      this.computeSchedule();
      this.render();
    },
    setAlgorithm(alg) {
      this.state.algorithm = alg;
      this.computeSchedule();
      this.render();
    },
    setQuantum(q) {
      this.state.quantum = Math.max(1, parseInt(q, 10));
      this.computeSchedule();
      this.render();
    },
    computeSchedule() {
      const procs = this.state.processes.map(p => ({
        ...p,
        remaining: p.burst,
        finish: 0,
        start: -1,
        waiting: 0,
        turnaround: 0,
        response: 0
      }));

      const schedule = [];
      let time = 0;
      let completed = 0;
      const n = procs.length;
      const alg = this.state.algorithm;
      const q = this.state.quantum;

      if (alg === 'fcfs') {
        const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
        sorted.forEach(p => {
          if (time < p.arrival) {
            schedule.push({ pid: "IDLE", start: time, end: p.arrival });
            time = p.arrival;
          }
          p.start = time;
          schedule.push({ pid: p.pid, start: time, end: time + p.burst });
          time += p.burst;
          p.finish = time;
          p.turnaround = p.finish - p.arrival;
          p.waiting = p.turnaround - p.burst;
          p.response = p.start - p.arrival;
        });
      } else if (alg === 'sjf') {
        // SJF no apropiativo
        const finished = new Set();
        while (completed < n) {
          const available = procs.filter(p => p.arrival <= time && !finished.has(p.pid));
          if (available.length === 0) {
            schedule.push({ pid: "IDLE", start: time, end: time + 1 });
            time++;
            continue;
          }
          available.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
          const curr = available[0];
          curr.start = time;
          schedule.push({ pid: curr.pid, start: time, end: time + curr.burst });
          time += curr.burst;
          curr.finish = time;
          curr.turnaround = curr.finish - curr.arrival;
          curr.waiting = curr.turnaround - curr.burst;
          curr.response = curr.start - curr.arrival;
          finished.add(curr.pid);
          completed++;
        }
      } else if (alg === 'srtf') {
        // SRTF apropiativo
        let currentPid = null;
        while (completed < n) {
          const available = procs.filter(p => p.arrival <= time && p.remaining > 0);
          if (available.length === 0) {
            if (schedule.length > 0 && schedule[schedule.length - 1].pid === "IDLE") {
              schedule[schedule.length - 1].end++;
            } else {
              schedule.push({ pid: "IDLE", start: time, end: time + 1 });
            }
            time++;
            continue;
          }
          available.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival);
          const curr = available[0];

          if (curr.start === -1) curr.start = time;

          if (schedule.length > 0 && schedule[schedule.length - 1].pid === curr.pid) {
            schedule[schedule.length - 1].end++;
          } else {
            schedule.push({ pid: curr.pid, start: time, end: time + 1 });
          }

          curr.remaining--;
          time++;

          if (curr.remaining === 0) {
            curr.finish = time;
            curr.turnaround = curr.finish - curr.arrival;
            curr.waiting = curr.turnaround - curr.burst;
            curr.response = curr.start - curr.arrival;
            completed++;
          }
        }
      } else if (alg === 'rr') {
        // Round Robin
        const queue = [];
        let pIndex = 0;
        const sortedArrival = [...procs].sort((a, b) => a.arrival - b.arrival);

        while (completed < n) {
          // Meter los que llegaron
          while (pIndex < n && sortedArrival[pIndex].arrival <= time) {
            queue.push(sortedArrival[pIndex]);
            pIndex++;
          }

          if (queue.length === 0) {
            schedule.push({ pid: "IDLE", start: time, end: time + 1 });
            time++;
            continue;
          }

          const curr = queue.shift();
          if (curr.start === -1) curr.start = time;

          const slice = Math.min(curr.remaining, q);
          schedule.push({ pid: curr.pid, start: time, end: time + slice });
          curr.remaining -= slice;
          time += slice;

          // Meter los que llegaron durante el slice
          while (pIndex < n && sortedArrival[pIndex].arrival <= time) {
            queue.push(sortedArrival[pIndex]);
            pIndex++;
          }

          if (curr.remaining > 0) {
            queue.push(curr);
          } else {
            curr.finish = time;
            curr.turnaround = curr.finish - curr.arrival;
            curr.waiting = curr.turnaround - curr.burst;
            curr.response = curr.start - curr.arrival;
            completed++;
          }
        }
      } else if (alg === 'priority') {
        // Prioridades no apropiativo (menor número = mayor prioridad)
        const finished = new Set();
        while (completed < n) {
          const available = procs.filter(p => p.arrival <= time && !finished.has(p.pid));
          if (available.length === 0) {
            schedule.push({ pid: "IDLE", start: time, end: time + 1 });
            time++;
            continue;
          }
          available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
          const curr = available[0];
          curr.start = time;
          schedule.push({ pid: curr.pid, start: time, end: time + curr.burst });
          time += curr.burst;
          curr.finish = time;
          curr.turnaround = curr.finish - curr.arrival;
          curr.waiting = curr.turnaround - curr.burst;
          curr.response = curr.start - curr.arrival;
          finished.add(curr.pid);
          completed++;
        }
      }

      // Calcular métricas medias
      const totalTurnaround = procs.reduce((acc, p) => acc + p.turnaround, 0);
      const totalWaiting = procs.reduce((acc, p) => acc + p.waiting, 0);
      const totalResponse = procs.reduce((acc, p) => acc + p.response, 0);
      const totalBurst = procs.reduce((acc, p) => acc + p.burst, 0);

      this.state.schedule = schedule;
      this.state.evaluatedProcesses = procs;
      this.state.metrics = {
        avgTurnaround: (totalTurnaround / n).toFixed(2),
        avgWaiting: (totalWaiting / n).toFixed(2),
        avgResponse: (totalResponse / n).toFixed(2),
        cpuUtilization: time > 0 ? ((totalBurst / time) * 100).toFixed(1) : 100,
        throughput: time > 0 ? (n / time).toFixed(2) : 0,
        totalTime: time
      };
    },
    render() {
      const s = this.state;
      const m = s.metrics;
      const totalTime = m.totalTime || 1;
      const procColors = { P1: "#3b82f6", P2: "#10b981", P3: "#8b5cf6", P4: "#f59e0b", IDLE: "#475569" };

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Algoritmo de Planificación:</label>
              <select onchange="SSOO_SIMULATORS[10].setAlgorithm(this.value)">
                <option value="rr" ${s.algorithm === 'rr' ? 'selected' : ''}>Round Robin (Apropiativo, ULL)</option>
                <option value="fcfs" ${s.algorithm === 'fcfs' ? 'selected' : ''}>FCFS (First-Come, First-Served)</option>
                <option value="sjf" ${s.algorithm === 'sjf' ? 'selected' : ''}>SJF (Shortest Job First - No apropiativo)</option>
                <option value="srtf" ${s.algorithm === 'srtf' ? 'selected' : ''}>SRTF (Shortest Remaining Time First - Apropiativo)</option>
                <option value="priority" ${s.algorithm === 'priority' ? 'selected' : ''}>Prioridades (Menor número = Más prioritario)</option>
              </select>
            </div>
            ${s.algorithm === 'rr' ? `
              <div class="control-group">
                <label>Quantum (q):</label>
                <input type="number" min="1" max="10" value="${s.quantum}" style="width:70px;" onchange="SSOO_SIMULATORS[10].setQuantum(this.value)">
              </div>
            ` : ''}
            <div class="control-actions">
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[10].loadExample()">Cargar Ejercicio de Examen ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Diagrama de Gantt de la CPU (Tiempo Total: ${totalTime} u.t.)</h4>
            <div class="gantt-chart-container">
              <div class="gantt-chart">
                ${s.schedule.map(b => {
                  const width = ((b.end - b.start) / totalTime) * 100;
                  const color = procColors[b.pid] || "#06b6d4";
                  return `
                    <div class="gantt-bar" style="width:${width}%; background-color:${color};" title="${b.pid}: [${b.start} - ${b.end}]">
                      <span>${b.pid}</span>
                      <small>${b.end - b.start}</small>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="gantt-axis">
                <span>0</span>
                ${s.schedule.map(b => `<span>${b.end}</span>`).join('')}
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla Detallada de Tiempos y Rendimiento por Proceso</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>PID</th>
                    <th>T. Llegada</th>
                    <th>Ráfaga CPU</th>
                    <th>Prioridad</th>
                    <th>T. Comienzo</th>
                    <th>T. Finalización</th>
                    <th>T. Retorno (Turnaround)</th>
                    <th>T. Espera (Waiting)</th>
                    <th>T. Respuesta</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.evaluatedProcesses.map(p => `
                    <tr>
                      <td><span class="badge" style="background:${procColors[p.pid]}; color:#fff;">${p.pid}</span></td>
                      <td>${p.arrival}</td>
                      <td>${p.burst}</td>
                      <td>${p.priority}</td>
                      <td>${p.start}</td>
                      <td>${p.finish}</td>
                      <td><strong>${p.turnaround}</strong></td>
                      <td><strong style="color:var(--color-warning);">${p.waiting}</strong></td>
                      <td>${p.response}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Tiempo Medio de Espera (TME)", value: `${m.avgWaiting} u.t.`, subtext: "Objetivo de minimización" },
            { label: "Tiempo Medio de Retorno (TMR)", value: `${m.avgTurnaround} u.t.`, subtext: "Tiempo total de estancia" },
            { label: "Utilización de CPU", value: `${m.cpuUtilization}%`, subtext: "Porcentaje de trabajo útil" },
            { label: "Rendimiento (Throughput)", value: `${m.throughput} p/ut`, subtext: "Procesos terminados por unidad" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 11: PASO DE MENSAJES - BUZONES Y RENDEZVOUS
  // --------------------------------------------------------------------------
  11: {
    state: {
      bufferCapacity: 3, // 0 = Rendezvous, 3 = Acotada, Infinity = Ilimitada
      syncMode: 'blocking', // 'blocking' o 'nonblocking'
      mailbox: [],
      p1State: 'activo',
      p2State: 'activo',
      receiverState: 'activo',
      deliveredCount: 8
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.bufferCapacity = 3;
      this.state.syncMode = 'blocking';
      this.state.mailbox = [
        { id: 1, sender: "P1", text: "Datos telemetría #1", time: "10:00:01" },
        { id: 2, sender: "P2", text: "Paquete de control #A", time: "10:00:02" }
      ];
      this.state.p1State = 'activo';
      this.state.p2State = 'activo';
      this.state.receiverState = 'activo';
      this.state.deliveredCount = 14;
      this.render();
    },
    setCapacity(cap) {
      this.state.bufferCapacity = cap === 'inf' ? 999 : parseInt(cap, 10);
      this.state.mailbox = [];
      this.render();
    },
    sendMessage(sender) {
      if (this.state.bufferCapacity === 0) {
        // Rendezvous: requiere que el receptor esté esperando
        if (this.state.receiverState === 'esperando') {
          this.state.deliveredCount++;
          this.state.receiverState = 'activo';
          this.render();
        } else {
          if (sender === 'P1') this.state.p1State = 'bloqueado_rendezvous';
          if (sender === 'P2') this.state.p2State = 'bloqueado_rendezvous';
          this.render();
        }
        return;
      }

      if (this.state.mailbox.length >= this.state.bufferCapacity) {
        if (this.state.syncMode === 'blocking') {
          if (sender === 'P1') this.state.p1State = 'bloqueado_buffer_lleno';
          if (sender === 'P2') this.state.p2State = 'bloqueado_buffer_lleno';
        }
      } else {
        this.state.mailbox.push({
          id: this.state.mailbox.length + 1,
          sender,
          text: `Mensaje de ${sender} [${new Date().toLocaleTimeString()}]`,
          time: new Date().toLocaleTimeString()
        });
      }
      this.render();
    },
    receiveMessage() {
      if (this.state.bufferCapacity === 0) {
        // Si hay un emisor bloqueado en rendezvous, se emparejan
        if (this.state.p1State === 'bloqueado_rendezvous') {
          this.state.p1State = 'activo';
          this.state.deliveredCount++;
        } else if (this.state.p2State === 'bloqueado_rendezvous') {
          this.state.p2State = 'activo';
          this.state.deliveredCount++;
        } else {
          this.state.receiverState = 'esperando';
        }
        this.render();
        return;
      }

      if (this.state.mailbox.length > 0) {
        this.state.mailbox.shift();
        this.state.deliveredCount++;
        // Desbloquear emisores si estaban esperando espacio
        this.state.p1State = 'activo';
        this.state.p2State = 'activo';
      } else {
        if (this.state.syncMode === 'blocking') {
          this.state.receiverState = 'bloqueado_buzon_vacio';
        }
      }
      this.render();
    },
    render() {
      const s = this.state;
      const capLabel = s.bufferCapacity === 0 ? "Capacidad Cero (Rendezvous Estricto)" : s.bufferCapacity > 100 ? "Capacidad Ilimitada" : `Acotada (N = ${s.bufferCapacity})`;

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Capacidad del Búfer / Enlace:</label>
              <select onchange="SSOO_SIMULATORS[11].setCapacity(this.value)">
                <option value="3" ${s.bufferCapacity === 3 ? 'selected' : ''}>Capacidad Acotada (N=3)</option>
                <option value="0" ${s.bufferCapacity === 0 ? 'selected' : ''}>Capacidad Cero (Punto de Encuentro - Rendezvous)</option>
                <option value="inf" ${s.bufferCapacity > 100 ? 'selected' : ''}>Capacidad Ilimitada</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[11].sendMessage('P1')">P1: send(Buzon)</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[11].sendMessage('P2')">P2: send(Buzon)</button>
              <button class="btn btn-success" onclick="SSOO_SIMULATORS[11].receiveMessage()">Receptor: receive()</button>
              <button class="btn btn-outline" onclick="SSOO_SIMULATORS[11].loadExample()">Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Esquema de Comunicación IPC (${capLabel})</h4>
            <div class="ipc-diagram">
              <div class="ipc-process-box">
                <span class="badge badge-primary">Emisor P1</span>
                <p>Estado: <strong>${s.p1State}</strong></p>
              </div>

              <div class="ipc-mailbox-container">
                <div class="mailbox-header">
                  <span>📮 Buzón Compartido del Kernel</span>
                  <span>${s.bufferCapacity === 0 ? 'Sin Búfer' : `${s.mailbox.length} / ${s.bufferCapacity > 100 ? '∞' : s.bufferCapacity}`}</span>
                </div>
                <div class="mailbox-queue">
                  ${s.bufferCapacity === 0 ? `
                    <div class="mailbox-empty-slot text-muted">Mecanismo Rendezvous: Emisor y receptor deben coincidir simultáneamente en el tiempo.</div>
                  ` : s.mailbox.length === 0 ? `
                    <div class="mailbox-empty-slot text-muted">Buzón vacío. Receptor bloqueado si usa recepción bloqueante.</div>
                  ` : s.mailbox.map(m => `
                    <div class="message-envelope">
                      <span>📩 #${m.id} (${m.sender})</span>
                      <small>${m.text}</small>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="ipc-process-box">
                <span class="badge badge-success">Receptor P3</span>
                <p>Estado: <strong>${s.receiverState}</strong></p>
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Cola Activa de Mensajes en Tránsito</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Msg ID</th>
                    <th>Emisor</th>
                    <th>Destinatario</th>
                    <th>Cuerpo del Mensaje</th>
                    <th>Timestamp</th>
                    <th>Estado de Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.mailbox.map(m => `
                    <tr>
                      <td>#${m.id}</td>
                      <td><strong>${m.sender}</strong></td>
                      <td>Receptor P3</td>
                      <td>${m.text}</td>
                      <td><code>${m.time}</code></td>
                      <td><span class="badge badge-warning">En Tránsito (Kernel)</span></td>
                    </tr>
                  `).join('')}
                  ${s.mailbox.length === 0 ? `<tr><td colspan="6" class="text-center text-muted">No hay mensajes pendientes en el buzón.</td></tr>` : ''}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Mensajes Entregados", value: `${s.deliveredCount}`, subtext: "Transferencias completadas" },
            { label: "Mensajes en Búfer", value: `${s.mailbox.length}`, subtext: "Ocupación actual del buzón" },
            { label: "Procesos Bloqueados", value: `${(s.p1State.includes('bloqueado') ? 1 : 0) + (s.receiverState.includes('bloqueado') || s.receiverState.includes('esperando') ? 1 : 0)}`, subtext: "Esperando sincronización" },
            { label: "Tipo de Enlace", value: s.bufferCapacity === 0 ? "Rendezvous" : "Búfer Asíncrono", subtext: "Semántica de acoplamiento" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 12: MEMORIA COMPARTIDA - SHM VS IPC Y CONDICIÓN DE CARRERA
  // --------------------------------------------------------------------------
  12: {
    state: {
      useMutex: true,
      counter: 100,
      raceDetected: false,
      log: []
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.useMutex = true;
      this.state.counter = 100;
      this.state.raceDetected = false;
      this.state.log = [
        { pid: "P1", action: "shm_open() + mmap()", desc: "Región mapeada en virtual 0x7f3000", ok: true },
        { pid: "P2", action: "shm_open() + mmap()", desc: "Mismo marco físico mapeado en virtual 0x7f4000", ok: true },
        { pid: "P1", action: "Escritura protegida por Mutex", desc: "counter = 100", ok: true }
      ];
      this.render();
    },
    toggleMutex(val) {
      this.state.useMutex = val;
      this.render();
    },
    performConcurrentIncrement() {
      if (this.state.useMutex) {
        this.state.counter += 2;
        this.state.raceDetected = false;
        this.state.log.unshift({
          pid: "P1 & P2",
          action: "Incremento Sincronizado",
          desc: "P1 adquiere mutex -> counter++ -> libera. P2 adquiere mutex -> counter++ -> libera.",
          ok: true
        });
      } else {
        // Carrera: ambos leen 100 a la vez, ambos escriben 101 perdiendo 1 incremento
        this.state.counter += 1;
        this.state.raceDetected = true;
        this.state.log.unshift({
          pid: "P1 & P2",
          action: "¡CONDICIÓN DE CARRERA!",
          desc: "P1 y P2 leyeron el mismo valor simultáneamente en RAM. Se ha perdido una actualización.",
          ok: false
        });
      }
      this.render();
    },
    render() {
      const s = this.state;
      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Sincronización sobre Memoria Compartida:</label>
              <select onchange="SSOO_SIMULATORS[12].toggleMutex(this.value === 'true')">
                <option value="true" ${s.useMutex ? 'selected' : ''}>Cerrojo Mutex Activado (Exclusión Mutua Correcta)</option>
                <option value="false" ${!s.useMutex ? 'selected' : ''}>Sin Sincronización (Demostrar Condición de Carrera)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[12].performConcurrentIncrement()">⚡ Ejecutar P1++ y P2++ Simultáneos</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[12].loadExample()">Cargar Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Arquitectura de Memoria Compartida (POSIX shm_open + mmap)</h4>
            
            <div class="shm-visual-grid">
              <div class="process-vmem">
                <span class="badge badge-primary">Proceso P1</span>
                <p>Espacio Virtual: <code>0x7f3000</code></p>
                <div class="mapping-arrow">Mapea marco físico ➔</div>
              </div>

              <div class="shared-ram-block ${s.raceDetected ? 'block-corrupt' : ''}">
                <div class="ram-badge">RAM FÍSICA COMPARTIDA</div>
                <div class="shm-data">
                  <span>Variable 'counter':</span>
                  <strong class="counter-display">${s.counter}</strong>
                </div>
                <small style="color:${s.useMutex ? 'var(--color-success)' : 'var(--color-danger)'};">
                  ${s.useMutex ? '🔒 Protegido con sem_t / pthread_mutex' : '⚠️ Sin exclusión mutua: vulnerable a carreras'}
                </small>
              </div>

              <div class="process-vmem">
                <span class="badge badge-success">Proceso P2</span>
                <p>Espacio Virtual: <code>0x7f4000</code></p>
                <div class="mapping-arrow">⬅ Mapea mismo marco</div>
              </div>
            </div>

            ${s.raceDetected ? `
              <div class="callout callout-important" style="margin-top:1rem; border-color:var(--color-danger);">
                <span class="callout-icon">🚨</span>
                <div>
                  <strong>Condición de Carrera Detectada:</strong> Al desactivar el cerrojo, P1 y P2 realizaron la lectura en paralelo antes de que cualquiera escribiera el resultado. En lugar de sumar 2, el contador solo subió 1.
                </div>
              </div>
            ` : ''}
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Historial de Operaciones de Lectura / Escritura en RAM</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Actor</th>
                    <th>Operación</th>
                    <th>Diagnóstico de Concurrencia</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.log.map(l => `
                    <tr>
                      <td><strong>${l.pid}</strong></td>
                      <td>${l.action}</td>
                      <td>${l.desc}</td>
                      <td><span class="badge ${l.ok ? 'badge-success' : 'badge-danger'}">${l.ok ? 'OK' : 'Corrupción'}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Ancho de Banda IPC", value: "> 12.8 GB/s", subtext: "Velocidad nativa del bus DDR4" },
            { label: "Llamadas al Sistema", value: "0 por transferencia", subtext: "Solo shm_open al inicio" },
            { label: "Valor del Contador", value: `${s.counter}`, subtext: "Dato en memoria compartida" },
            { label: "Estado de Concurrencia", value: s.useMutex ? "Seguro (Exclusión Mutua)" : "Condición de Carrera", subtext: s.useMutex ? "Sin anomalías" : "Pérdida de actualizaciones" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 13: HILOS - MODELOS DE HILOS Y MULTIPROCESAMIENTO
  // --------------------------------------------------------------------------
  13: {
    state: {
      model: 'one_to_one', // 'many_to_one', 'one_to_one', 'many_to_many'
      threadCount: 4,
      coreCount: 4,
      blockedThread: false
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.model = 'one_to_one';
      this.state.threadCount = 4;
      this.state.coreCount = 4;
      this.state.blockedThread = false;
      this.render();
    },
    setModel(m) {
      this.state.model = m;
      this.state.blockedThread = false;
      this.render();
    },
    simulateBlockingSyscall() {
      this.state.blockedThread = true;
      this.render();
    },
    unblock() {
      this.state.blockedThread = false;
      this.render();
    },
    render() {
      const s = this.state;
      let parallelSpeedup = "3.85x";
      let allBlocked = false;

      if (s.model === 'many_to_one') {
        parallelSpeedup = "1.00x (Sin paralelismo real en multinúcleo)";
        if (s.blockedThread) allBlocked = true;
      } else if (s.model === 'one_to_one') {
        parallelSpeedup = "3.85x (4 núcleos activos)";
      } else {
        parallelSpeedup = "3.40x (Multiplexado híbrido)";
      }

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Modelo de Correspondencia de Hilos:</label>
              <select onchange="SSOO_SIMULATORS[13].setModel(this.value)">
                <option value="one_to_one" ${s.model === 'one_to_one' ? 'selected' : ''}>Uno a Uno (Estándar Linux / Windows - NPTL)</option>
                <option value="many_to_one" ${s.model === 'many_to_one' ? 'selected' : ''}>Muchos a Uno (Green Threads / Espacio Usuario)</option>
                <option value="many_to_many" ${s.model === 'many_to_many' ? 'selected' : ''}>Muchos a Muchos (Multiplexado)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-warning" onclick="SSOO_SIMULATORS[13].simulateBlockingSyscall()" ${s.blockedThread ? 'disabled' : ''}>🛑 Hilo 1 ejecuta syscall bloqueante</button>
              ${s.blockedThread ? `<button class="btn btn-success" onclick="SSOO_SIMULATORS[13].unblock()">Desbloquear E/S</button>` : ''}
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[13].loadExample()">Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Estructura del Proceso Multihilo y Núcleos de CPU</h4>
            
            <div class="threads-process-box">
              <div class="shared-mem-bar">
                <span>RECURSOS COMPARTIDOS DEL PROCESO:</span>
                <code>Código (.text)</code> | <code>Datos Globales (.data)</code> | <code>Montón (Heap)</code> | <code>Archivos Abiertos</code>
              </div>

              <div class="threads-grid">
                ${[1, 2, 3, 4].map(id => {
                  const isBlocked = (id === 1 && s.blockedThread) || (allBlocked && s.blockedThread);
                  return `
                    <div class="thread-card ${isBlocked ? 'thread-blocked' : 'thread-active'}">
                      <div class="thread-header">
                        <strong>Hilo TID_${id}</strong>
                        <span class="badge ${isBlocked ? 'badge-danger' : 'badge-success'}">${isBlocked ? 'Bloqueado' : 'Ejecutando'}</span>
                      </div>
                      <small>Pila privada (Stack_${id})</small>
                      <small>Registros propios (PC, SP)</small>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            ${allBlocked ? `
              <div class="callout callout-important" style="margin-top:1rem; border-color:var(--color-danger);">
                <span class="callout-icon">⚠️</span>
                <div>
                  <strong>Desventaja Crítica del Modelo Muchos a Uno:</strong> Al bloquearse el Hilo 1 en una llamada al sistema de E/S, el kernel ve un solo proceso tradicional y suspende el proceso completo. ¡Los hilos 2, 3 y 4 quedan congelados aunque tengan trabajo pendiente!
                </div>
              </div>
            ` : ''}
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla de Control de Hilos (TCB - Thread Control Block)</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>TID</th>
                    <th>PID Contenedor</th>
                    <th>Pila Local</th>
                    <th>Núcleo Asignado</th>
                    <th>Estado de Ejecución</th>
                  </tr>
                </thead>
                <tbody>
                  ${[1, 2, 3, 4].map(id => `
                    <tr>
                      <td><code>TID_${id}</code></td>
                      <td>PID_200</td>
                      <td><code>0x7fff000 + ${id * 4}KB</code></td>
                      <td>${s.model === 'many_to_one' ? 'Core 0 (Compartido)' : `Core ${id - 1}`}</td>
                      <td>
                        <span class="badge ${(id === 1 && s.blockedThread) || (allBlocked && s.blockedThread) ? 'badge-danger' : 'badge-success'}">
                          ${(id === 1 && s.blockedThread) || (allBlocked && s.blockedThread) ? 'Bloqueado en Syscall' : 'En Ejecución Paralela'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Hilos de Usuario Activos", value: `${s.threadCount}`, subtext: "Flujos concurrentes" },
            { label: "Cores de CPU Usados", value: s.model === 'many_to_one' ? "1 de 4" : "4 de 4", subtext: "Aprovechamiento multinúcleo" },
            { label: "Aceleración Paralela", value: parallelSpeedup, subtext: "Speedup frente a secuencial" },
            { label: "Coste Conmutación", value: "~150 ns", subtext: "Mucho menor que entre procesos" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 14: SINCRONIZACIÓN - PRODUCTOR-CONSUMIDOR Y SEMÁFOROS
  // --------------------------------------------------------------------------
  14: {
    state: {
      problem: 'prod_cons', // 'prod_cons', 'peterson', 'philosophers'
      bufferSize: 5,
      buffer: ["Item_1", "Item_2"],
      mutex: 1,
      empty: 3,
      full: 2,
      inCriticalSection: null,
      deadlockDetected: false,
      philosophers: ["Pensando", "Pensando", "Comiendo", "Pensando", "Hambriento"]
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.problem = 'prod_cons';
      this.state.buffer = ["Dato_A", "Dato_B"];
      this.state.mutex = 1;
      this.state.empty = 3;
      this.state.full = 2;
      this.state.inCriticalSection = null;
      this.render();
    },
    setProblem(p) {
      this.state.problem = p;
      this.render();
    },
    produce() {
      if (this.state.empty > 0) {
        this.state.empty--;
        this.state.inCriticalSection = "Productor";
        setTimeout(() => {
          this.state.buffer.push(`Dato_${Date.now() % 1000}`);
          this.state.full++;
          this.state.inCriticalSection = null;
          this.render();
        }, 300);
      }
      this.render();
    },
    consume() {
      if (this.state.full > 0) {
        this.state.full--;
        this.state.inCriticalSection = "Consumidor";
        setTimeout(() => {
          this.state.buffer.shift();
          this.state.empty++;
          this.state.inCriticalSection = null;
          this.render();
        }, 300);
      }
      this.render();
    },
    render() {
      const s = this.state;
      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Problema Clásico de Sincronización:</label>
              <select onchange="SSOO_SIMULATORS[14].setProblem(this.value)">
                <option value="prod_cons" ${s.problem === 'prod_cons' ? 'selected' : ''}>1. Productor-Consumidor (Búfer Acotado con Semáforos)</option>
                <option value="philosophers" ${s.problem === 'philosophers' ? 'selected' : ''}>2. Cena de los Filósofos (Detección de Deadlock)</option>
              </select>
            </div>
            <div class="control-actions">
              ${s.problem === 'prod_cons' ? `
                <button class="btn btn-primary" onclick="SSOO_SIMULATORS[14].produce()" ${s.empty === 0 ? 'disabled' : ''}>+ Producir Dato</button>
                <button class="btn btn-success" onclick="SSOO_SIMULATORS[14].consume()" ${s.full === 0 ? 'disabled' : ''}>- Consumir Dato</button>
              ` : `
                <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[14].loadExample()">Reiniciar Filósofos</button>
              `}
              <button class="btn btn-outline" onclick="SSOO_SIMULATORS[14].loadExample()">Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            ${s.problem === 'prod_cons' ? `
              <h4 class="box-title">Búfer Acotado Circular de 5 Posiciones</h4>
              <div class="sync-buffer-slots">
                ${[0, 1, 2, 3, 4].map(idx => {
                  const hasItem = idx < s.buffer.length;
                  return `
                    <div class="sync-slot ${hasItem ? 'slot-full' : 'slot-empty'}">
                      <div class="slot-idx">Slot #${idx}</div>
                      <strong>${hasItem ? s.buffer[idx] : 'VACÍO'}</strong>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="semaphores-panel">
                <div class="sem-card"><span>Semáforo mutex:</span> <strong>${s.mutex}</strong> <small>(Exclusión mutua)</small></div>
                <div class="sem-card"><span>Semáforo empty:</span> <strong>${s.empty}</strong> <small>(Huecos libres)</small></div>
                <div class="sem-card"><span>Semáforo full:</span> <strong>${s.full}</strong> <small>(Diferencial ocupado)</small></div>
              </div>
            ` : `
              <h4 class="box-title">Mesa Redonda: Cena de los 5 Filósofos</h4>
              <div class="philosophers-table-view">
                ${s.philosophers.map((st, i) => `
                  <div class="philo-node philo-${st.toLowerCase()}">
                    <span>Filósofo ${i}</span>
                    <strong>${st}</strong>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Estado de la Sección Crítica</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Entidad</th>
                    <th>Estado de Sección Crítica</th>
                    <th>Condición de Exclusión Mutua</th>
                    <th>Garantía de Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Proceso Productor</strong></td>
                    <td>${s.inCriticalSection === 'Productor' ? '<span class="badge badge-warning">DENTRO DE SECCIÓN CRÍTICA</span>' : '<span class="badge badge-outline">Fuera</span>'}</td>
                    <td>Garantizada por wait(mutex)</td>
                    <td>Sin inanición</td>
                  </tr>
                  <tr>
                    <td><strong>Proceso Consumidor</strong></td>
                    <td>${s.inCriticalSection === 'Consumidor' ? '<span class="badge badge-warning">DENTRO DE SECCIÓN CRÍTICA</span>' : '<span class="badge badge-outline">Fuera</span>'}</td>
                    <td>Garantizada por wait(mutex)</td>
                    <td>Sin inanición</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "En Sección Crítica", value: s.inCriticalSection ? s.inCriticalSection : "Ninguno (Libre)", subtext: "Exclusión Mutua estricta" },
            { label: "Huecos Libres (empty)", value: `${s.empty} de 5`, subtext: "Capacidad disponible" },
            { label: "Elementos Listos (full)", value: `${s.full} items`, subtext: "Elementos consumibles" },
            { label: "Violaciones Críticas", value: "0", subtext: "Condiciones de carrera prevenidas" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 15: MEMORIA PRINCIPAL - ASIGNACIÓN CONTIGUA Y FRAGMENTACIÓN
  // --------------------------------------------------------------------------
  15: {
    state: {
      strategy: 'first_fit', // 'first_fit', 'best_fit', 'worst_fit'
      totalMem: 1024, // KB
      partitions: []
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.strategy = 'first_fit';
      this.state.partitions = [
        { pid: "SO", base: 0, size: 200, free: false },
        { pid: null, base: 200, size: 300, free: true },
        { pid: "P1", base: 500, size: 150, free: false },
        { pid: null, base: 650, size: 120, free: true },
        { pid: "P2", base: 770, size: 180, free: false },
        { pid: null, base: 950, size: 74, free: true }
      ];
      this.render();
    },
    setStrategy(st) {
      this.state.strategy = st;
      this.render();
    },
    allocateProcess(pid, size) {
      size = parseInt(size, 10);
      const freeSlots = this.state.partitions.filter(p => p.free && p.size >= size);
      if (freeSlots.length === 0) {
        alert("Fallo de asignación: No hay ningún hueco contiguo con tamaño suficiente (Fragmentación Externa).");
        return;
      }

      let chosen = null;
      if (this.state.strategy === 'first_fit') {
        chosen = freeSlots[0];
      } else if (this.state.strategy === 'best_fit') {
        freeSlots.sort((a, b) => a.size - b.size);
        chosen = freeSlots[0];
      } else if (this.state.strategy === 'worst_fit') {
        freeSlots.sort((a, b) => b.size - a.size);
        chosen = freeSlots[0];
      }

      const idx = this.state.partitions.indexOf(chosen);
      const leftover = chosen.size - size;

      if (leftover > 0) {
        this.state.partitions.splice(idx, 1,
          { pid, base: chosen.base, size: size, free: false },
          { pid: null, base: chosen.base + size, size: leftover, free: true }
        );
      } else {
        chosen.pid = pid;
        chosen.free = false;
      }
      this.render();
    },
    compactMemory() {
      const allocated = this.state.partitions.filter(p => !p.free);
      let currentBase = 0;
      const newPartitions = [];

      allocated.forEach(p => {
        newPartitions.push({ ...p, base: currentBase });
        currentBase += p.size;
      });

      const freeTotal = this.state.totalMem - currentBase;
      if (freeTotal > 0) {
        newPartitions.push({ pid: null, base: currentBase, size: freeTotal, free: true });
      }

      this.state.partitions = newPartitions;
      this.render();
    },
    render() {
      const s = this.state;
      const allocatedMem = s.partitions.filter(p => !p.free).reduce((a, b) => a + b.size, 0);
      const freeMem = s.totalMem - allocatedMem;
      const freeHoles = s.partitions.filter(p => p.free);
      const extFrag = freeHoles.length > 1 ? freeMem : 0;

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Estrategia de Asignación Dinámica:</label>
              <select onchange="SSOO_SIMULATORS[15].setStrategy(this.value)">
                <option value="first_fit" ${s.strategy === 'first_fit' ? 'selected' : ''}>Primer Ajuste (First-Fit)</option>
                <option value="best_fit" ${s.strategy === 'best_fit' ? 'selected' : ''}>Mejor Ajuste (Best-Fit)</option>
                <option value="worst_fit" ${s.strategy === 'worst_fit' ? 'selected' : ''}>Peor Ajuste (Worst-Fit)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[15].allocateProcess('P' + (Math.floor(Math.random()*80)+3), 100)">+ Asignar Proceso (100 KB)</button>
              <button class="btn btn-warning" onclick="SSOO_SIMULATORS[15].compactMemory()">📦 Compactar Memoria</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[15].loadExample()">Cargar Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Mapa de Asignación de la Memoria Principal (Total: 1024 KB)</h4>
            <div class="memory-bar">
              ${s.partitions.map(p => {
                const width = (p.size / s.totalMem) * 100;
                return `
                  <div class="mem-block ${p.free ? 'mem-free' : 'mem-allocated'}" style="width:${width}%;" title="${p.free ? 'Hueco Libre' : p.pid}: ${p.size} KB [Base: ${p.base}]">
                    <span>${p.free ? 'Libre' : p.pid}</span>
                    <small>${p.size}K</small>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="mem-axis">
              <span>0 KB</span>
              <span>256 KB</span>
              <span>512 KB</span>
              <span>768 KB</span>
              <span>1024 KB</span>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla de Particiones y Huecos Libres</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Dirección Base</th>
                    <th>Tamaño</th>
                    <th>Dirección Límite</th>
                    <th>Estado</th>
                    <th>Proceso</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.partitions.map(p => `
                    <tr class="${p.free ? '' : 'row-highlight'}">
                      <td><code>${p.base} KB</code></td>
                      <td>${p.size} KB</td>
                      <td><code>${p.base + p.size - 1} KB</code></td>
                      <td><span class="badge ${p.free ? 'badge-success' : 'badge-primary'}">${p.free ? 'HUECO LIBRE' : 'OCUPADO'}</span></td>
                      <td><strong>${p.free ? '—' : p.pid}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Memoria Ocupada", value: `${allocatedMem} KB`, subtext: `${((allocatedMem / s.totalMem) * 100).toFixed(1)}% de utilización` },
            { label: "Memoria Libre Total", value: `${freeMem} KB`, subtext: "Espacio no ocupado" },
            { label: "Fragmentación Externa", value: `${extFrag} KB`, subtext: `${freeHoles.length} huecos dispersos no contiguos` },
            { label: "Número de Huecos", value: `${freeHoles.length}`, subtext: "Fragmentos libres en RAM" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 16: PAGINACIÓN - TRADUCTOR MMU, TABLA DE PÁGINAS Y TLB
  // --------------------------------------------------------------------------
  16: {
    state: {
      pageSize: 4096, // bytes = 2^12
      logicalAddr: 13500, // p = 3, d = 1212
      tlbHits: 24,
      tlbMisses: 3,
      pageTable: [
        { p: 0, f: 5, valid: true },
        { p: 1, f: 8, valid: true },
        { p: 2, f: 2, valid: true },
        { p: 3, f: 14, valid: true },
        { p: 4, f: 1, valid: true }
      ],
      tlb: [
        { p: 3, f: 14 },
        { p: 0, f: 5 }
      ]
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.logicalAddr = 13500;
      this.state.pageSize = 4096;
      this.render();
    },
    setAddr(val) {
      this.state.logicalAddr = Math.max(0, parseInt(val, 10));
      this.render();
    },
    render() {
      const s = this.state;
      const p = Math.floor(s.logicalAddr / s.pageSize);
      const d = s.logicalAddr % s.pageSize;
      const inTLB = s.tlb.some(e => e.p === p);
      const ptEntry = s.pageTable.find(e => e.p === p);
      const frame = ptEntry ? ptEntry.f : (inTLB ? s.tlb.find(e => e.p === p).f : 99);
      const physicalAddr = (frame * s.pageSize) + d;
      const hitRatio = Math.round((s.tlbHits / (s.tlbHits + s.tlbMisses)) * 100);
      const eat = Math.round((hitRatio / 100) * (20 + 100) + (1 - hitRatio / 100) * (20 + 200));

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Dirección Lógica (Virtual) en Bytes:</label>
              <input type="number" min="0" max="65535" value="${s.logicalAddr}" style="width:130px;" onchange="SSOO_SIMULATORS[16].setAddr(this.value)">
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[16].setAddr(13500)">Ejemplo: 13500 B</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[16].setAddr(5000)">Ejemplo: 5000 B</button>
              <button class="btn btn-outline" onclick="SSOO_SIMULATORS[16].loadExample()">Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Traductor de Direcciones de la MMU con TLB</h4>
            
            <div class="mmu-pipeline-grid">
              <div class="mmu-card">
                <span class="mmu-tag">Dirección Lógica: ${s.logicalAddr}</span>
                <div class="binary-split">
                  <div class="split-p">Página p = ${p}</div>
                  <div class="split-d">Offset d = ${d}</div>
                </div>
                <small class="text-muted">4 KB = 12 bits de desplazamiento</small>
              </div>

              <div class="mmu-arrow">➔ Búsqueda TLB</div>

              <div class="mmu-card ${inTLB ? 'mmu-tlb-hit' : 'mmu-tlb-miss'}">
                <span class="mmu-tag">Caché TLB</span>
                <strong>${inTLB ? '✓ ACIERTO EN TLB (Hit)' : '✗ FALLO TLB (Consulta RAM)'}</strong>
                <small style="display:block; margin-top:0.25rem;">Marco f = ${frame}</small>
              </div>

              <div class="mmu-arrow">➔ Cálculo Físico</div>

              <div class="mmu-card" style="background:#0f172a; border-color:var(--color-success);">
                <span class="mmu-tag" style="background:var(--color-success); color:#fff;">Dirección Física</span>
                <h3 style="margin:0.25rem 0; color:var(--color-success);">${physicalAddr}</h3>
                <small>(${frame} × 4096) + ${d}</small>
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Tabla de Páginas del Proceso en Memoria Principal</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Número de Página (p)</th>
                    <th>Marco Físico Asignado (f)</th>
                    <th>Bit Validez (V/I)</th>
                    <th>Protección</th>
                    <th>Estado de Consulta Actual</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.pageTable.map(entry => `
                    <tr class="${entry.p === p ? 'row-highlight' : ''}">
                      <td>Página <code>#${entry.p}</code></td>
                      <td>Marco <code>#${entry.f}</code></td>
                      <td><span class="badge badge-success">1 (Válida en RAM)</span></td>
                      <td>Lectura / Escritura (RW)</td>
                      <td>${entry.p === p ? '<span class="badge badge-primary">TRADUCCIÓN ACTIVA</span>' : '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Marco Físico Obtenido", value: `Marco #${frame}`, subtext: `Dirección física base: ${frame * 4096}` },
            { label: "Tasa de Aciertos TLB", value: `${hitRatio}%`, subtext: "Aceleración hardware MMU" },
            { label: "Tiempo de Acceso (EAT)", value: `${eat} ns`, subtext: "Frente a 220 ns sin TLB" },
            { label: "Fragmentación Externa", value: "0 KB", subtext: "Eliminada por paginación" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 17: MEMORIA VIRTUAL - REEMPLAZO DE PÁGINAS Y BÉLÁDY
  // --------------------------------------------------------------------------
  17: {
    state: {
      algorithm: 'fifo', // 'fifo', 'lru', 'opt', 'clock'
      frameCount: 3,
      refString: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1],
      steps: [],
      faultCount: 0,
      hitCount: 0
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.algorithm = 'fifo';
      this.state.frameCount = 3;
      this.state.refString = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
      this.simulate();
      this.render();
    },
    loadBelady() {
      // Secuencia clásica de la anomalía de Bélády
      this.state.refString = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
      this.state.algorithm = 'fifo';
      this.simulate();
      this.render();
    },
    setAlgorithm(a) {
      this.state.algorithm = a;
      this.simulate();
      this.render();
    },
    setFrames(f) {
      this.state.frameCount = parseInt(f, 10);
      this.simulate();
      this.render();
    },
    simulate() {
      const frames = [];
      const steps = [];
      let faults = 0;
      let hits = 0;
      const numFrames = this.state.frameCount;
      const refs = this.state.refString;
      const alg = this.state.algorithm;

      const lastUsed = {};
      const fifoQueue = [];

      refs.forEach((page, idx) => {
        const hit = frames.includes(page);
        if (hit) {
          hits++;
          lastUsed[page] = idx;
          steps.push({ page, frames: [...frames], hit: true, victim: null });
        } else {
          faults++;
          let victim = null;
          if (frames.length < numFrames) {
            frames.push(page);
            fifoQueue.push(page);
            lastUsed[page] = idx;
          } else {
            // Reemplazo
            if (alg === 'fifo') {
              victim = fifoQueue.shift();
              const fIdx = frames.indexOf(victim);
              frames[fIdx] = page;
              fifoQueue.push(page);
            } else if (alg === 'lru') {
              let lruPage = frames[0];
              let oldestTime = lastUsed[lruPage] ?? -1;
              frames.forEach(f => {
                if ((lastUsed[f] ?? -1) < oldestTime) {
                  oldestTime = lastUsed[f];
                  lruPage = f;
                }
              });
              victim = lruPage;
              const fIdx = frames.indexOf(victim);
              frames[fIdx] = page;
            } else if (alg === 'opt') {
              // Buscar el que tardará más en usarse
              let farthest = -1;
              let optPage = frames[0];
              frames.forEach(f => {
                const nextUse = refs.slice(idx + 1).indexOf(f);
                if (nextUse === -1) {
                  optPage = f;
                  farthest = 999999;
                } else if (nextUse > farthest) {
                  farthest = nextUse;
                  optPage = f;
                }
              });
              victim = optPage;
              const fIdx = frames.indexOf(victim);
              frames[fIdx] = page;
            }
            lastUsed[page] = idx;
          }
          steps.push({ page, frames: [...frames], hit: false, victim });
        }
      });

      this.state.steps = steps;
      this.state.faultCount = faults;
      this.state.hitCount = hits;
    },
    render() {
      const s = this.state;
      const total = s.refString.length;
      const faultRate = total > 0 ? ((s.faultCount / total) * 100).toFixed(1) : 0;

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Algoritmo de Reemplazo:</label>
              <select onchange="SSOO_SIMULATORS[17].setAlgorithm(this.value)">
                <option value="fifo" ${s.algorithm === 'fifo' ? 'selected' : ''}>FIFO (First-In, First-Out)</option>
                <option value="lru" ${s.algorithm === 'lru' ? 'selected' : ''}>LRU (Least Recently Used)</option>
                <option value="opt" ${s.algorithm === 'opt' ? 'selected' : ''}>Óptimo (OPT / MIN - Teórico)</option>
              </select>
            </div>
            <div class="control-group">
              <label>Marcos Físicos:</label>
              <select onchange="SSOO_SIMULATORS[17].setFrames(this.value)">
                <option value="3" ${s.frameCount === 3 ? 'selected' : ''}>3 Marcos</option>
                <option value="4" ${s.frameCount === 4 ? 'selected' : ''}>4 Marcos</option>
                <option value="5" ${s.frameCount === 5 ? 'selected' : ''}>5 Marcos</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-primary" onclick="SSOO_SIMULATORS[17].loadBelady()">🚨 Demostrar Anomalía de Bélády</button>
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[17].loadExample()">Ejemplo Clásico ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Matriz de Estados de Marcos de Página por Referencia</h4>
            <div class="page-matrix-container">
              <div class="matrix-grid">
                ${s.steps.map(st => `
                  <div class="matrix-col ${st.hit ? 'col-hit' : 'col-fault'}">
                    <div class="ref-label">${st.page}</div>
                    ${[...Array(s.frameCount)].map((_, fi) => `
                      <div class="frame-cell">${st.frames[fi] !== undefined ? st.frames[fi] : '—'}</div>
                    `).join('')}
                    <div class="status-cell">${st.hit ? '✓ Hit' : '✗ Fallo'}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Resumen de Evaluación de Memoria Virtual</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Métrica Evaluada</th>
                    <th>Valor</th>
                    <th>Significado Técnico</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Referencias a Memoria</strong></td>
                    <td>${total} accesos</td>
                    <td>Secuencia de páginas leídas/escritas por el proceso</td>
                  </tr>
                  <tr>
                    <td><strong>Fallos de Página (Page Faults)</strong></td>
                    <td><strong style="color:var(--color-danger);">${s.faultCount}</strong></td>
                    <td>Requirieron interrupción por trap e invocación de E/S a disco swap</td>
                  </tr>
                  <tr>
                    <td><strong>Aciertos de Página (Hits)</strong></td>
                    <td><strong style="color:var(--color-success);">${s.hitCount}</strong></td>
                    <td>Página ya presente en la memoria física RAM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Fallos de Página", value: `${s.faultCount}`, subtext: "Interrupciones por trap", variant: "kpi-danger" },
            { label: "Tasa de Fallos", value: `${faultRate}%`, subtext: "Porcentaje de accesos a swap" },
            { label: "Aciertos (Hits)", value: `${s.hitCount}`, subtext: "Acceso inmediato en RAM", variant: "kpi-success" },
            { label: "Marcos Asignados", value: `${s.frameCount} marcos`, subtext: "Memoria física disponible" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 18: ALMACENAMIENTO SECUNDARIO - PLANIFICACIÓN DE CABEZA DE DISCO
  // --------------------------------------------------------------------------
  18: {
    state: {
      algorithm: 'sstf', // 'fcfs', 'sstf', 'scan', 'cscan', 'look', 'clook'
      initialHead: 53,
      direction: 'up', // 'up' o 'down'
      requests: [98, 183, 37, 122, 14, 124, 65, 67],
      path: [],
      totalSeek: 0
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.algorithm = 'sstf';
      this.state.initialHead = 53;
      this.state.requests = [98, 183, 37, 122, 14, 124, 65, 67];
      this.calculateSeek();
      this.render();
    },
    setAlgorithm(a) {
      this.state.algorithm = a;
      this.calculateSeek();
      this.render();
    },
    calculateSeek() {
      const head = this.state.initialHead;
      const reqs = [...this.state.requests];
      const alg = this.state.algorithm;
      const path = [head];
      let current = head;
      let total = 0;

      if (alg === 'fcfs') {
        reqs.forEach(r => {
          total += Math.abs(r - current);
          current = r;
          path.push(current);
        });
      } else if (alg === 'sstf') {
        const remaining = [...reqs];
        while (remaining.length > 0) {
          remaining.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
          const next = remaining.shift();
          total += Math.abs(next - current);
          current = next;
          path.push(current);
        }
      } else if (alg === 'scan') {
        const left = reqs.filter(r => r < head).sort((a, b) => b - a);
        const right = reqs.filter(r => r >= head).sort((a, b) => a - b);
        // Hacia arriba (199) y luego hacia abajo
        right.forEach(r => { total += Math.abs(r - current); current = r; path.push(current); });
        total += Math.abs(199 - current); current = 199; path.push(199);
        left.forEach(r => { total += Math.abs(r - current); current = r; path.push(current); });
      } else if (alg === 'look') {
        const left = reqs.filter(r => r < head).sort((a, b) => b - a);
        const right = reqs.filter(r => r >= head).sort((a, b) => a - b);
        right.forEach(r => { total += Math.abs(r - current); current = r; path.push(current); });
        left.forEach(r => { total += Math.abs(r - current); current = r; path.push(current); });
      } else if (alg === 'cscan') {
        const left = reqs.filter(r => r < head).sort((a, b) => a - b);
        const right = reqs.filter(r => r >= head).sort((a, b) => a - b);
        right.forEach(r => { total += Math.abs(r - current); current = r; path.push(current); });
        total += Math.abs(199 - current); current = 199; path.push(199);
        total += 199; current = 0; path.push(0);
        left.forEach(r => { total += Math.abs(r - current); current = r; path.push(current); });
      }

      this.state.path = path;
      this.state.totalSeek = total;
    },
    render() {
      const s = this.state;
      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Algoritmo de Planificación de Cabeza:</label>
              <select onchange="SSOO_SIMULATORS[18].setAlgorithm(this.value)">
                <option value="sstf" ${s.algorithm === 'sstf' ? 'selected' : ''}>SSTF (Shortest Seek Time First)</option>
                <option value="fcfs" ${s.algorithm === 'fcfs' ? 'selected' : ''}>FCFS (First-Come, First-Served)</option>
                <option value="scan" ${s.algorithm === 'scan' ? 'selected' : ''}>SCAN (Algoritmo del Ascensor)</option>
                <option value="look" ${s.algorithm === 'look' ? 'selected' : ''}>LOOK (Optimizado)</option>
                <option value="cscan" ${s.algorithm === 'cscan' ? 'selected' : ''}>C-SCAN (Circular SCAN)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[18].loadExample()">Cargar Ejercicio de Examen ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Trayectoria de Desplazamiento del Brazo Mecánico (Cilindros 0 a 199)</h4>
            <div class="disk-track-diagram">
              <div class="disk-track-axis">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>199</span>
              </div>
              <div class="track-path-line">
                ${s.path.map((cyl, i) => {
                  const left = (cyl / 199) * 100;
                  return `
                    <div class="track-point" style="left:${left}%; top:${i * 22}px;" title="Paso ${i}: Cilindro ${cyl}">
                      <span>${cyl}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Secuencia de Movimiento del Cabezal</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Paso</th>
                    <th>Cilindro Destino</th>
                    <th>Desplazamiento desde Previo</th>
                    <th>Cilindros Acumulados</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.path.map((c, i) => {
                    const prev = i === 0 ? c : s.path[i - 1];
                    const dist = Math.abs(c - prev);
                    return `
                      <tr>
                        <td>Paso #${i}</td>
                        <td><strong>Cilindro ${c}</strong></td>
                        <td>${i === 0 ? 'Posición Inicial' : dist + ' cilindros'}</td>
                        <td>${i === 0 ? '0' : '—'}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Recorrido Total", value: `${s.totalSeek} cilindros`, subtext: "Distancia total recorrida" },
            { label: "Desplazamiento Medio", value: `${(s.totalSeek / s.requests.length).toFixed(1)} cil/pet`, subtext: "Media por búsqueda" },
            { label: "Peticiones Servidas", value: `${s.requests.length}`, subtext: "Cola atendida al 100%" },
            { label: "Posición Inicial", value: `Cilindro ${s.initialHead}`, subtext: "Punto de partida del brazo" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 19: SISTEMAS DE ARCHIVOS - ASIGNACIÓN CONTIGUA, ENLAZADA Y FAT
  // --------------------------------------------------------------------------
  19: {
    state: {
      method: 'fat', // 'contiguous', 'linked', 'fat', 'indexed'
      blocks: [],
      files: []
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.method = 'fat';
      this.state.files = [
        { name: "apuntes_ssoo.pdf", start: 2, size: 4, blocks: [2, 5, 8, 12], color: "#3b82f6" },
        { name: "kernel_log.txt", start: 14, size: 3, blocks: [14, 15, 16], color: "#10b981" },
        { name: "foto.png", start: 20, size: 5, blocks: [20, 21, 25, 28, 30], color: "#f59e0b" }
      ];
      this.render();
    },
    setMethod(m) {
      this.state.method = m;
      this.render();
    },
    render() {
      const s = this.state;
      const totalBlocks = 36;
      const blockOwners = Array(totalBlocks).fill(null);

      s.files.forEach(f => {
        f.blocks.forEach(b => {
          if (b < totalBlocks) blockOwners[b] = f;
        });
      });

      const occupied = blockOwners.filter(x => x !== null).length;

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Método de Asignación en Disco:</label>
              <select onchange="SSOO_SIMULATORS[19].setMethod(this.value)">
                <option value="fat" ${s.method === 'fat' ? 'selected' : ''}>FAT (File Allocation Table con enlaces en memoria)</option>
                <option value="contiguous" ${s.method === 'contiguous' ? 'selected' : ''}>Asignación Contigua (Fragmentación externa)</option>
                <option value="linked" ${s.method === 'linked' ? 'selected' : ''}>Asignación Enlazada (Punteros en bloques)</option>
                <option value="indexed" ${s.method === 'indexed' ? 'selected' : ''}>Asignación Indexada (Bloque Índice)</option>
              </select>
            </div>
            <div class="control-actions">
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[19].loadExample()">Cargar Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Matriz de Bloques de Disco (Cuadrícula 6x6)</h4>
            <div class="disk-grid-6x6">
              ${[...Array(totalBlocks)].map((_, i) => {
                const f = blockOwners[i];
                return `
                  <div class="disk-sector-cell ${f ? 'sector-occupied' : 'sector-free'}" style="${f ? `border-color:${f.color}; background:${f.color}22;` : ''}">
                    <span class="sec-num">${i}</span>
                    <strong style="color:${f ? f.color : 'inherit'};">${f ? f.name.slice(0, 4) : 'Libre'}</strong>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Entradas de Directorio y Mapeo Físico</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nombre de Archivo</th>
                    <th>Bloque Inicial / Índice</th>
                    <th>Tamaño (Bloques)</th>
                    <th>Cadena de Bloques Asignados</th>
                    <th>Eficiencia de Acceso Aleatorio</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.files.map(f => `
                    <tr>
                      <td><strong style="color:${f.color};">${f.name}</strong></td>
                      <td>Bloque #${f.start}</td>
                      <td>${f.size} bloques (16 KB)</td>
                      <td><code>${f.blocks.join(' ➔ ')}</code></td>
                      <td>
                        <span class="badge ${s.method === 'contiguous' || s.method === 'fat' || s.method === 'indexed' ? 'badge-success' : 'badge-warning'}">
                          ${s.method === 'contiguous' ? 'O(1) Directo Inmediato' : s.method === 'fat' ? 'O(1) Búsqueda en RAM' : 'O(N) Secuencial'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Bloques Ocupados", value: `${occupied} de ${totalBlocks}`, subtext: `${((occupied / totalBlocks) * 100).toFixed(1)}% utilizado` },
            { label: "Espacio Libre", value: `${totalBlocks - occupied} bloques`, subtext: "Capacidad disponible" },
            { label: "Fragmentación Externa", value: s.method === 'contiguous' ? "Alta" : "Nula (0 KB)", subtext: "Pérdida por huecos" },
            { label: "Sobrecarga de Punteros", value: s.method === 'fat' ? "Tabla FAT en RAM" : "Mínima", subtext: "Metadatos del FS" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  },

  // --------------------------------------------------------------------------
  // LECCIÓN 20: IMPLEMENTACIÓN FS - INODO UNIX Y JOURNALING
  // --------------------------------------------------------------------------
  20: {
    state: {
      fileSizeKb: 64, // KB
      journalActive: true,
      journalCrash: false
    },
    init(container) {
      this.container = container;
      this.loadExample();
    },
    loadExample() {
      this.state.fileSizeKb = 64;
      this.state.journalCrash = false;
      this.render();
    },
    setSize(val) {
      this.state.fileSizeKb = parseInt(val, 10);
      this.render();
    },
    simulateCrash() {
      this.state.journalCrash = true;
      this.render();
    },
    recoverJournal() {
      this.state.journalCrash = false;
      this.render();
    },
    render() {
      const s = this.state;
      const blockSize = 4; // 4 KB por bloque
      const blocksNeeded = Math.ceil(s.fileSizeKb / blockSize);
      const directCount = Math.min(blocksNeeded, 12);
      const indirectNeeded = blocksNeeded > 12;
      const doubleIndirectNeeded = blocksNeeded > 12 + 1024;

      const html = `
        <div class="sim-wrapper">
          <div class="sim-controls-bar">
            <div class="control-group">
              <label>Tamaño de Archivo a Almacenar (KB):</label>
              <input type="range" min="4" max="512" step="4" value="${s.fileSizeKb}" style="width:140px;" oninput="SSOO_SIMULATORS[20].setSize(this.value)">
              <span><strong>${s.fileSizeKb} KB</strong> (${blocksNeeded} bloques)</span>
            </div>
            <div class="control-actions">
              <button class="btn btn-danger" onclick="SSOO_SIMULATORS[20].simulateCrash()" ${s.journalCrash ? 'disabled' : ''}>⚡ Simular Corte Eléctrico (Crash)</button>
              ${s.journalCrash ? `<button class="btn btn-success" onclick="SSOO_SIMULATORS[20].recoverJournal()">🛡️ Recuperar con Journal (2s)</button>` : ''}
              <button class="btn btn-secondary" onclick="SSOO_SIMULATORS[20].loadExample()">Ejemplo ULL</button>
            </div>
          </div>

          <div class="sim-canvas-box">
            <h4 class="box-title">Estructura del Inodo UNIX (ext4) y Expansión de Punteros</h4>
            
            <div class="inode-structure-view">
              <div class="inode-meta-box">
                <span class="badge badge-primary">Metadatos del Inodo #1042</span>
                <p>Modo: <code>-rwxr-xr-x</code> | UID: 1000 | Tamaño: ${s.fileSizeKb} KB</p>
                <small>Enlaces duros: 1 | Marcas: atime, mtime, ctime</small>
              </div>

              <div class="inode-pointers-grid">
                <div class="pointer-block pointer-direct">
                  <strong>12 Punteros Directos</strong>
                  <span>${directCount} / 12 bloques asignados</span>
                </div>

                <div class="pointer-block ${indirectNeeded ? 'pointer-active' : 'pointer-inactive'}">
                  <strong>1 Indirecto Simple</strong>
                  <span>${indirectNeeded ? `Activo (${blocksNeeded - 12} bloques direccionados)` : 'Sin usar (archivo cabe en directos)'}</span>
                </div>

                <div class="pointer-block ${doubleIndirectNeeded ? 'pointer-active' : 'pointer-inactive'}">
                  <strong>1 Indirecto Doble</strong>
                  <span>${doubleIndirectNeeded ? 'Activo (Archivo masivo)' : 'Inactivo'}</span>
                </div>
              </div>
            </div>

            ${s.journalCrash ? `
              <div class="panic-banner panic-recovered" style="margin-top:1rem;">
                <h3>🛡️ RECUPERACIÓN CONSISTENTE MEDIANTE JOURNALING (DIARIO)</h3>
                <p>Durante la escritura de los bloques ocurrió un corte eléctrico. El sistema operativo detecta la transacción pendiente en el diario circular (ext4 journal), reproduce las operaciones incompletas y restaura la consistencia del superbloque e inodos en 2 segundos sin ejecutar el lento fsck.</p>
              </div>
            ` : ''}
          </div>

          <div class="sim-table-box">
            <h4 class="box-title">Estructura Interna del Inodo y Gestión de Espacio Libre</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Campo del Inodo</th>
                    <th>Valor Actual</th>
                    <th>Propósito en el Sistema de Archivos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>i_size</code></td>
                    <td>${s.fileSizeKb * 1024} Bytes</td>
                    <td>Longitud real de los datos del archivo</td>
                  </tr>
                  <tr>
                    <td><code>i_blocks</code></td>
                    <td>${blocksNeeded} bloques (de 4 KB)</td>
                    <td>Sectores físicos reservados en disco</td>
                  </tr>
                  <tr>
                    <td><code>i_block[0..11]</code></td>
                    <td>Punteros Directos</td>
                    <td>Acceso instantáneo para archivos de hasta 48 KB</td>
                  </tr>
                  <tr>
                    <td><code>i_block[12]</code></td>
                    <td>${indirectNeeded ? 'Puntero Bloque Índice #840' : 'NULL'}</td>
                    <td>Apunta a bloque con 1024 punteros de datos adicionales</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          ${SSOO_SIMULATORS.utils.createKPICards([
            { label: "Tamaño de Archivo", value: `${s.fileSizeKb} KB`, subtext: "Longitud en espacio lógico" },
            { label: "Bloques Asignados", value: `${blocksNeeded} bloques`, subtext: "Bloques de datos en disco" },
            { label: "Nivel de Indirección", value: indirectNeeded ? "Indirecto Simple" : "Directo puro", subtext: "Jerarquía de punteros de inodo" },
            { label: "Estado del Journal", value: s.journalCrash ? "En Recuperación" : "Consistente", subtext: "Tolerancia a cortes de energía" }
          ])}
        </div>
      `;
      this.container.innerHTML = html;
    }
  }
};
