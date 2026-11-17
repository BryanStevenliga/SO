/**
 * ============================================================================
 * SISTEMAS OPERATIVOS - ULL ESIT (ull-esit-sistemas-operativos.github.io/ssoo-apuntes/)
 * Base de Datos de Teoría, Definiciones Formales y Conceptos Clave
 * ============================================================================
 */

const SSOO_THEORY_DATA = {
  1: {
    module: "MÓDULO 1: INTRODUCCIÓN",
    moduleNumber: 1,
    lessonNumber: 1,
    title: "Definiciones",
    subtitle: "Concepto de Sistema Operativo, visiones del sistema y el núcleo",
    summary: "Un sistema operativo actúa como intermediario entre el usuario de un computador y el hardware, gestionando los recursos de forma eficiente y proporcionando un entorno cómodo para ejecutar programas.",
    sections: [
      {
        title: "1. ¿Qué es un Sistema Operativo?",
        content: `
          <p>Según los apuntes de la ULL ESIT (siguiendo a Silberschatz y Tanenbaum), un <strong>Sistema Operativo (SO)</strong> es un programa que actúa como <em>intermediario</em> entre el usuario de un ordenador y el hardware de este. Su propósito fundamental es proporcionar un entorno en el que el usuario pueda ejecutar programas de forma cómoda y eficiente.</p>
          <div class="callout callout-important">
            <span class="callout-icon">📌</span>
            <div>
              <strong>Definición Clave (ULL ESIT):</strong>
              El sistema operativo es el software básico que controla los recursos hardware de la máquina, abstrae su complejidad física y ofrece una interfaz estandarizada y segura a las aplicaciones de usuario.
            </div>
          </div>
        `
      },
      {
        title: "2. Las dos visiones del Sistema Operativo",
        content: `
          <div class="grid-2col">
            <div class="theory-card">
              <h4>👁️ Visión desde el Usuario</h4>
              <p>El usuario busca <strong>comodidad, facilidad de uso y rendimiento</strong>. No desea lidiar con la circuitería, las pistas del disco ni las interrupciones del controlador. Para el usuario, el SO es una máquina virtual abstracta que facilita la ejecución de sus programas y oculta los detalles del hardware.</p>
            </div>
            <div class="theory-card">
              <h4>⚙️ Visión desde el Sistema</h4>
              <p>Desde la perspectiva del sistema, el SO es un <strong>asignador de recursos</strong> (<em>Resource Allocator</em>) y un <strong>programa de control</strong> (<em>Control Program</em>):</p>
              <ul>
                <li><strong>Asignador de recursos:</strong> Decide de forma justa y eficiente cómo repartir la CPU, la memoria, el espacio de almacenamiento y los dispositivos de E/S entre múltiples programas en conflicto.</li>
                <li><strong>Programa de control:</strong> Supervisa la ejecución de los programas de usuario para evitar errores, violaciones de seguridad y el uso inadecuado o monopolio del hardware.</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: "3. El Núcleo (Kernel)",
        content: `
          <p>No todo el software suministrado con una distribución es el sistema operativo. Formalmente, el <strong>núcleo o kernel</strong> es el único programa que se encuentra <em>en ejecución continua</em> en todo momento en la computadora (en modo privilegiado). Todo lo demás son:</p>
          <ul>
            <li><strong>Programas del sistema:</strong> Asociados al SO pero fuera del núcleo (compiladores, gestores de paquetes, shells, servicios demonio).</li>
            <li><strong>Programas de aplicación:</strong> Desarrollados por los usuarios para resolver problemas específicos (navegadores, suites ofimáticas, bases de datos).</li>
          </ul>
        `
      }
    ],
    examNotes: "Pregunta clásica de examen ULL: Distinguir entre las dos visiones del SO (usuario vs sistema) y explicar por qué el SO debe actuar tanto de árbitro (asignador de recursos) como de policía (programa de control).",
    codeSnippet: `// Representación conceptual del bucle principal del Kernel (simplificado)
void kernel_main() {
    init_hardware();
    init_memory_management();
    init_process_scheduler();
    init_file_system();
    
    // El kernel entra en bucle despachando procesos y esperando interrupciones
    while(1) {
        process_t* next = schedule_next_process();
        context_switch_to(next);
        wait_for_hardware_interrupt();
    }
}`
  },

  2: {
    module: "MÓDULO 1: INTRODUCCIÓN",
    moduleNumber: 1,
    lessonNumber: 2,
    title: "Tipos de sistemas",
    subtitle: "Evolución de arquitecturas: lotes, multiprogramación, tiempo compartido y tiempo real",
    summary: "Clasificación de los sistemas operativos según sus objetivos operativos y el modo en que gestionan la alternancia de tareas y el tiempo de respuesta.",
    sections: [
      {
        title: "1. Clasificación Fundamental de Sistemas",
        content: `
          <p>A lo largo de la historia de la computación, los sistemas operativos han evolucionado adaptándose a las necesidades de procesamiento y a la reducción de costes de hardware:</p>
          <div class="table-responsive">
            <table class="theory-table">
              <thead>
                <tr>
                  <th>Tipo de Sistema</th>
                  <th>Características Principales</th>
                  <th>Mecanismo Clave</th>
                  <th>Objetivo Primario</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Por Lotes (Batch)</strong></td>
                  <td>Los trabajos similares se agrupan en lotes. Sin interacción del usuario durante la ejecución.</td>
                  <td>Monitor residente y SPOOLing (Simultaneous Peripheral Operations On-Line).</td>
                  <td>Maximizar el uso del hardware caro de la época.</td>
                </tr>
                <tr>
                  <td><strong>Multiprogramados</strong></td>
                  <td>Varios procesos residen simultáneamente en memoria. La CPU nunca está ociosa si hay trabajo.</td>
                  <td>Conmutación de CPU cuando un proceso realiza una operación de E/S.</td>
                  <td>Aumentar drásticamente la utilización de la CPU.</td>
                </tr>
                <tr>
                  <td><strong>Tiempo Compartido (Time-Sharing)</strong></td>
                  <td>Multitarea interactiva. La CPU se reparte entre los usuarios mediante cuantos de tiempo muy breves.</td>
                  <td>Planificación apropiativa (Round Robin) con reloj hardware.</td>
                  <td>Minimizar el tiempo de respuesta para el usuario interactivo.</td>
                </tr>
                <tr>
                  <td><strong>Tiempo Real (Real-Time)</strong></td>
                  <td>Las restricciones de tiempo son críticas. Un resultado correcto fuera de plazo es erróneo.</td>
                  <td>Prioridades estrictas, temporizadores deterministas y desalojo rápido.</td>
                  <td>Garantizar plazos de ejecución (deadlines).</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        title: "2. Tiempo Real Duro vs Blando",
        content: `
          <div class="grid-2col">
            <div class="theory-card">
              <h4>⏱️ Tiempo Real Duro (Hard Real-Time)</h4>
              <p>Garantiza que las tareas críticas se completan <strong>estrictamente dentro de su plazo</strong>. Si se sobrepasa el plazo límite, se produce un fallo catastrófico del sistema (ej. control de frenos ABS, aviónica, marcapasos, centrales nucleares). No suele usar memoria virtual ni paginación para evitar latencias impredecibles.</p>
            </div>
            <div class="theory-card">
              <h4>⏳ Tiempo Real Blando (Soft Real-Time)</h4>
              <p>Las tareas críticas tienen máxima prioridad sobre las demás, pero <strong>no se garantiza el cumplimiento absoluto del plazo</strong> en el 100% de los casos. Si se pierde un plazo, solo se degrada la calidad del servicio (ej. streaming de vídeo/audio, videojuegos online, robótica no crítica).</p>
            </div>
          </div>
        `
      }
    ],
    examNotes: "En los exámenes de la ULL ESIT es habitual comparar el comportamiento de la CPU en un sistema por lotes (CPU ociosa durante la E/S) frente a un sistema multiprogramado (conmutación automática a otro proceso en espera).",
    codeSnippet: `// Modelo conceptual de un bucle de tiempo compartido con quantum
#define QUANTUM_TICKS 10

void timer_interrupt_handler() {
    current_process->ticks_used++;
    if (current_process->ticks_used >= QUANTUM_TICKS) {
        current_process->ticks_used = 0;
        scheduler_preempt_and_rotate(); // Desalojo Round Robin
    }
}`
  },

  3: {
    module: "MÓDULO 1: INTRODUCCIÓN",
    moduleNumber: 1,
    lessonNumber: 3,
    title: "Historia (Extra)",
    subtitle: "De los tubos de vacío a la computación ubicua y la nube",
    summary: "Recorrido por las cinco generaciones de computadores y cómo cada salto tecnológico en hardware propició una revolución en el software del sistema operativo.",
    sections: [
      {
        title: "1. Las Cinco Generaciones de Sistemas",
        content: `
          <ul class="timeline-list">
            <li>
              <strong>1ª Generación (1945–1955) - Tubos de vacío y tableros:</strong>
              Sin sistema operativo. Programación directa en lenguaje máquina mediante cables y conmutadores físicos. Registro manual de turnos en papel.
            </li>
            <li>
              <strong>2ª Generación (1955–1965) - Transistores y sistemas por lotes:</strong>
              Nacen los primeros sistemas operativos rudimentarios: monitores residentes (como FMS - Fortran Monitor System e IBSYS en IBM 7094). Introducción de tarjetas perforadas y cinta magnética.
            </li>
            <li>
              <strong>3ª Generación (1965–1980) - Circuitos integrados y multiprogramación:</strong>
              IBM crea el OS/360 unificando líneas científicas y comerciales. Nace <em>MULTICS</em>, y de su simplificación en 1969 surge <strong>UNIX</strong> en Bell Labs (creado por Ken Thompson y Dennis Ritchie en lenguaje C).
            </li>
            <li>
              <strong>4ª Generación (1980–Actualidad) - Computadores personales y microprocesadores:</strong>
              Revolución de los microchips (LSI/VLSI). Nacimiento de CP/M, MS-DOS, Apple Macintosh (primera GUI comercial de éxito), Microsoft Windows y el nacimiento en 1991 de <strong>Linux</strong> por Linus Torvalds sobre arquitectura POSIX.
            </li>
            <li>
              <strong>5ª Generación / Actualidad - Dispositivos móviles, Nube y Virtualización:</strong>
              Sistemas móviles dominantes (Android con kernel Linux, iOS), hipervisores tipo 1 y tipo 2, contenedores (Docker/LXC) y orquestación masiva en clúster.
            </li>
          </ul>
        `
      }
    ],
    examNotes: "Importancia histórica de UNIX: fue el primer SO reescrito casi en su totalidad en lenguaje de alto nivel (C), lo que permitió una portabilidad sin precedentes entre arquitecturas de hardware diferentes.",
    codeSnippet: `/* El legendario comentario en el código fuente de UNIX Version 6 (Lions' Commentary) */
/* You are not expected to understand this */
swtch() {
    static struct proc *p;
    ...
}`
  },

  4: {
    module: "MÓDULO 2: ORGANIZACIÓN",
    moduleNumber: 2,
    lessonNumber: 4,
    title: "Componentes",
    subtitle: "Módulos fundamentales que integran un sistema operativo moderno",
    summary: "Los componentes del sistema operativo dividen la enorme complejidad de la máquina en subsistemas bien definidos con responsabilidades e interfaces concretas.",
    sections: [
      {
        title: "1. Los Grandes Componentes del Sistema Operativo",
        content: `
          <p>Siguiendo la estructura del temario de la ULL ESIT, los componentes esenciales son:</p>
          <div class="grid-3col">
            <div class="theory-card">
              <h4>1. Gestor de Procesos</h4>
              <p>Crea, destruye, suspende, reanuda y sincroniza procesos e hilos. Asigna la CPU mediante algoritmos de planificación.</p>
            </div>
            <div class="theory-card">
              <h4>2. Gestor de Memoria Principal</h4>
              <p>Realiza el seguimiento de qué partes de la memoria están en uso y por quién. Asigna y desasigna dinámicamente espacio.</p>
            </div>
            <div class="theory-card">
              <h4>3. Gestor de E/S</h4>
              <p>Oculta las peculiaridades de los periféricos mediante manejadores (drivers), búferes de memoria caché y spooling.</p>
            </div>
            <div class="theory-card">
              <h4>4. Gestor de Almacenamiento</h4>
              <p>Abstrae los bloques físicos del disco en archivos lógicos organizados en directorios con control de acceso.</p>
            </div>
            <div class="theory-card">
              <h4>5. Sistema de Protección</h4>
              <p>Garantiza que solo los procesos autorizados puedan acceder a los recursos de CPU, memoria y ficheros.</p>
            </div>
            <div class="theory-card">
              <h4>6. Intérprete de Comandos</h4>
              <p>Interfaz (CLI o GUI) que lee y ejecuta las instrucciones directas del usuario hacia los servicios del núcleo.</p>
            </div>
          </div>
        `
      }
    ],
    examNotes: "Cada componente interactúa con los demás a través de interfaces internas protegidas; el gestor de procesos depende del gestor de memoria para asignar el espacio de direcciones de cada tarea.",
    codeSnippet: `// Estructura modular de interacción en el SO
void execute_binary(const char *path) {
    // 1. Gestor de ficheros lee el binario
    file_t *f = vfs_open(path, O_RDONLY);
    // 2. Gestor de memoria reserva páginas
    address_space_t *as = mm_create_space();
    // 3. Gestor de procesos crea el PCB
    process_t *p = process_create(f, as);
    // 4. Planificador lo inserta en cola de listos
    sched_enqueue(p);
}`
  },

  5: {
    module: "MÓDULO 2: ORGANIZACIÓN",
    moduleNumber: 2,
    lessonNumber: 5,
    title: "Servicios",
    subtitle: "Funcionalidades ofrecidas a usuarios, programas y al propio sistema",
    summary: "Los servicios del sistema operativo se dividen en dos vertientes: los orientados a facilitar la programación y uso, y los orientados a garantizar la eficiencia del sistema.",
    sections: [
      {
        title: "1. Servicios para el Usuario y las Aplicaciones",
        content: `
          <ul>
            <li><strong>Interfaz de usuario:</strong> Línea de órdenes (CLI/Shell) o interfaces gráficas (GUI).</li>
            <li><strong>Ejecución de programas:</strong> Cargar un ejecutable en memoria, inicializar pilas y registros, y ejecutarlo.</li>
            <li><strong>Operaciones de E/S:</strong> Dado que los programas no pueden interactuar directamente con el hardware por seguridad, el SO proporciona mecanismos seguros de lectura/escritura.</li>
            <li><strong>Manipulación del sistema de archivos:</strong> Crear, borrar, renombrar, listar y buscar archivos y directorios.</li>
            <li><strong>Comunicaciones:</strong> Intercambio de información entre procesos en la misma máquina o a través de una red (IPC, sockets).</li>
            <li><strong>Detección y tratamiento de errores:</strong> Detección de fallos en CPU, memoria, disco o E/S, y adopción de medidas correctoras sin tumbar el sistema.</li>
          </ul>
        `
      },
      {
        title: "2. Servicios para Garantizar la Eficiencia del Sistema",
        content: `
          <ul>
            <li><strong>Asignación de recursos:</strong> Reparto dinámico de núcleos de cómputo, marcos de memoria y canales de E/S entre múltiples tareas.</li>
            <li><strong>Contabilidad (Accounting):</strong> Registro del tiempo y volumen de recursos consumidos por cada usuario o proceso (para monitorización o facturación).</li>
            <li><strong>Protección y seguridad:</strong> Control estricto de accesos para asegurar que ningún proceso interfiera con los datos de otro ni con el propio núcleo.</li>
          </ul>
        `
      }
    ],
    examNotes: "Distinguir entre llamada al sistema (mecanismo técnico) y servicio del sistema operativo (concepto funcional que se presta al usuario o aplicación).",
    codeSnippet: `// Ejemplo en C: una aplicación solicitando el servicio de escritura
#include <unistd.h>

int main() {
    const char msg[] = "Solicitando servicio de E/S al SO\\n";
    // write() invoca el servicio de E/S del kernel mediante una llamada al sistema
    write(STDOUT_FILENO, msg, sizeof(msg) - 1);
    return 0;
}`
  },

  6: {
    module: "MÓDULO 2: ORGANIZACIÓN",
    moduleNumber: 2,
    lessonNumber: 6,
    title: "Interfaz de programación",
    subtitle: "Llamadas al sistema (System Calls), modo dual de la CPU y APIs estándar",
    summary: "La interfaz de programación está formada por las llamadas al sistema. Permiten a los programas solicitar servicios al núcleo pasando del modo usuario no privilegiado al modo núcleo mediante una trampa software.",
    sections: [
      {
        title: "1. Llamadas al Sistema (System Calls)",
        content: `
          <p>Las <strong>llamadas al sistema</strong> constituyen la interfaz formal entre los programas de aplicación y los servicios provistos por el núcleo del sistema operativo. Por lo general están disponibles como funciones en lenguaje C o ensamblador.</p>
          <div class="callout callout-important">
            <span class="callout-icon">🛡️</span>
            <div>
              <strong>Modo Dual de Operación de la CPU:</strong>
              Para proteger el hardware y los procesos entre sí, la CPU dispone de al menos dos modos:
              <ul>
                <li><strong>Modo Usuario (bit de modo = 1):</strong> Instrucciones restringidas; no puede acceder directamente a puertos de E/S ni a la memoria del kernel.</li>
                <li><strong>Modo Núcleo / Kernel / Supervisor (bit de modo = 0):</strong> La CPU puede ejecutar cualquier instrucción de la máquina y acceder a todo el espacio físico de memoria.</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: "2. Paso de Parámetros a una Llamada al Sistema",
        content: `
          <p>Existen tres métodos habituales para pasar parámetros al sistema operativo durante una syscall:</p>
          <ol>
            <li><strong>En registros de la CPU:</strong> El método más rápido. Los parámetros se cargan directamente en registros hardware (ej. <code>%rdi, %rsi, %rdx</code> en x86-64). Limitado por el número de registros disponibles.</li>
            <li><strong>En un bloque de memoria:</strong> Los parámetros se escriben en una tabla o bloque de memoria y se pasa la dirección del bloque en un único registro.</li>
            <li><strong>En la pila (Stack):</strong> El programa introduce (push) los parámetros en la pila del sistema y el sistema operativo los extrae (pop).</li>
          </ol>
        `
      },
      {
        title: "3. APIs Estándar vs Syscalls",
        content: `
          <p>Los desarrolladores rara vez invocan la instrucción de trampa (trap/syscall) directamente. En su lugar, utilizan una <strong>API (Application Programming Interface)</strong> estándar:</p>
          <ul>
            <li><strong>POSIX API:</strong> Estándar IEEE para sistemas tipo UNIX (Linux, macOS, BSD).</li>
            <li><strong>Win32/Win64 API:</strong> Para sistemas operativos Microsoft Windows.</li>
            <li><strong>C Library (libc):</strong> Funciones envoltorio (<em>wrappers</em>) como <code>printf()</code>, <code>malloc()</code> o <code>read()</code> que preparan los registros e invocan la llamada al sistema subyacente.</li>
          </ul>
        `
      }
    ],
    examNotes: "Pregunta frecuente ULL: Explicar paso a paso qué ocurre cuando se ejecuta una instrucción 'syscall' o 'trap' (cambio de bit de modo 1->0, salvaguarda de PC y registros en la pila del kernel, indexación en la tabla sys_call_table, ejecución y retorno con sysret/iret cambiando bit 0->1).",
    codeSnippet: `// Paso a paso en C y Ensamblador x86-64:
// Invocación directa de syscall write() sin pasar por libc wrapper
#include <unistd.h>

long my_write(int fd, const void *buf, size_t count) {
    long ret;
    __asm__ volatile (
        "mov $1, %%rax\\n"    // Syscall número 1 en x86-64 es sys_write
        "mov %1, %%rdi\\n"    // Primer argumento: fd
        "mov %2, %%rsi\\n"    // Segundo argumento: buffer
        "mov %3, %%rdx\\n"    // Tercer argumento: count
        "syscall\\n"          // Trampa hardware -> Conmuta a modo kernel
        "mov %%rax, %0\\n"    // Valor devuelto por el kernel
        : "=r"(ret)
        : "r"((long)fd), "r"(buf), "r"((long)count)
        : "%rax", "%rdi", "%rsi", "%rdx"
    );
    return ret;
}`
  },

  7: {
    module: "MÓDULO 2: ORGANIZACIÓN",
    moduleNumber: 2,
    lessonNumber: 7,
    title: "Operación del sistema",
    subtitle: "Secuencia de arranque (Bootstrap), interrupciones y temporizadores",
    summary: "Estudio de cómo cobra vida el computador desde que se pulsa el botón de encendido y cómo el sistema operativo mantiene el control permanente del hardware mediante interrupciones y el reloj.",
    sections: [
      {
        title: "1. Secuencia de Arranque (Bootstrap)",
        content: `
          <ol>
            <li><strong>Encendido y POST:</strong> La CPU ejecuta el firmware en memoria no volátil (BIOS o UEFI) que realiza el autodiagnóstico del hardware (POST - Power-On Self-Test).</li>
            <li><strong>Cargador de arranque (Bootloader):</strong> El firmware localiza el dispositivo de arranque y lee el sector de arranque (MBR / partición EFI). Se carga el bootloader (ej. GRUB).</li>
            <li><strong>Carga del Núcleo:</strong> El bootloader carga la imagen del kernel en la memoria principal y le transfiere el control de ejecución.</li>
            <li><strong>Inicialización del Sistema:</strong> El kernel configura las estructuras de datos (gestión de memoria, tabla de páginas, interrupciones, planificador) y monta el sistema de archivos raíz.</li>
            <li><strong>Creación del Primer Proceso:</strong> Se crea el proceso raíz del espacio de usuario (PID 1: <code>systemd</code> o <code>init</code>), que a su vez lanza los servicios y la pantalla de inicio de sesión.</li>
          </ol>
        `
      },
      {
        title: "2. Gestión de Interrupciones",
        content: `
          <p>El sistema operativo es un sistema <em>guiado por eventos</em>. Los eventos son señalizados mediante <strong>interrupciones</strong>:</p>
          <div class="grid-2col">
            <div class="theory-card">
              <h4>⚡ Interrupciones Hardware</h4>
              <p>Generadas asíncronamente por periféricos enviando una señal eléctrica a la CPU a través del bus de control (ej. tecla pulsada, llegada de paquete de red, sector leído en disco).</p>
            </div>
            <div class="theory-card">
              <h4>🛑 Trampas o Excepciones Software</h4>
              <p>Generadas síncronamente por la CPU al ejecutar una instrucción: por un error (división por cero, acceso ilegal a memoria / segfault) o a petición (llamada al sistema <code>syscall</code>).</p>
            </div>
          </div>
          <p>La CPU detiene su trabajo actual, salva el Contador de Programa (PC) y registros en la pila, e indexa el <strong>Vector de Interrupciones (IVT / IDT)</strong> para ejecutar la <em>Rutina de Servicio de Interrupción (ISR)</em> correspondiente.</p>
        `
      },
      {
        title: "3. El Temporizador (Timer) Hardware",
        content: `
          <p>Para evitar que un proceso de usuario entre en un bucle infinito y monopolice la CPU para siempre, el sistema operativo configura un <strong>temporizador hardware</strong> que genera interrupciones periódicas fijas (ticks de reloj). En cada interrupción de reloj, el SO retoma el control y evalúa si el proceso actual ha agotado su cuanto de tiempo, forzando un desalojo si es necesario.</p>
        `
      }
    ],
    examNotes: "Concepto crucial: ¿Por qué el temporizador hardware debe ser una instrucción privilegiada? Porque si un programa de usuario pudiera modificar el temporizador, podría desactivarlo y retener la CPU indefinidamente.",
    codeSnippet: `// Vector de Interrupciones típico en arquitectura x86
struct idt_entry {
    uint16_t isr_low;    // 16 bits bajos de la dirección del ISR
    uint16_t kernel_cs;   // Selector del segmento de código del kernel
    uint8_t  ist;         // Interrupt Stack Table
    uint8_t  attributes;  // Tipo y atributos de privilegio (DPL)
    uint16_t isr_mid;    // 16 bits intermedios
    uint32_t isr_high;   // 32 bits altos (modo 64 bits)
    uint32_t reserved;
} __attribute__((packed));`
  },

  8: {
    module: "MÓDULO 2: ORGANIZACIÓN",
    moduleNumber: 2,
    lessonNumber: 8,
    title: "Sistemas por su estructura",
    subtitle: "Estructuras monolíticas, por capas, microkernel, módulos dinámicos e híbridas",
    summary: "Análisis de las distintas arquitecturas de diseño del núcleo del sistema operativo, sopesando el rendimiento, la facilidad de mantenimiento, la modularidad y la tolerancia a fallos.",
    sections: [
      {
        title: "1. Principales Arquitecturas de Núcleo",
        content: `
          <div class="table-responsive">
            <table class="theory-table">
              <thead>
                <tr>
                  <th>Estructura</th>
                  <th>Organización</th>
                  <th>Ventajas</th>
                  <th>Inconvenientes</th>
                  <th>Ejemplos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Monolítica</strong></td>
                  <td>Todos los servicios (planificador, memoria, drivers, sistema de archivos) se ejecutan en un único espacio de direcciones del kernel.</td>
                  <td>Máximo rendimiento y velocidad (llamadas a funciones directas en RAM).</td>
                  <td>Difícil de mantener. Un error o fallo en un driver tumba todo el sistema (Kernel Panic / BSOD).</td>
                  <td>UNIX original, Linux tradicional, MS-DOS.</td>
                </tr>
                <tr>
                  <td><strong>Por Capas (Layered)</strong></td>
                  <td>El sistema se divide en capas $N$, donde cada capa solo puede invocar servicios de la capa inferior $N-1$. Capa 0 = Hardware, Capa más alta = Usuario.</td>
                  <td>Gran modularidad, facilidad de depuración y verificación formal.</td>
                  <td>Sobrecarga de rendimiento en llamadas que deben cruzar múltiples capas intermedias.</td>
                  <td>Sistema THE de Dijkstra, Venus.</td>
                </tr>
                <tr>
                  <td><strong>Microkernel</strong></td>
                  <td>El núcleo contiene lo mínimo imprescindible (comunicación IPC básica, gestión de memoria primaria y planificación). El resto (drivers, sistemas de archivos) son procesos en espacio de usuario.</td>
                  <td>Alta fiabilidad, seguridad y extensibilidad. Si un driver falla, se reinicia como proceso sin caer el SO.</td>
                  <td>Pérdida de rendimiento notable debido al continuo paso de mensajes (IPC) y conmutación de contexto.</td>
                  <td>Mach, Minix, QNX, L4.</td>
                </tr>
                <tr>
                  <td><strong>Módulos Dinámicos (LKM)</strong></td>
                  <td>Núcleo monolítico base que permite cargar y descargar módulos en tiempo de ejecución según se requieran sin reiniciar.</td>
                  <td>Combina el rendimiento monolítico con la flexibilidad de no tener que recompilar el kernel.</td>
                  <td>Los módulos siguen ejecutándose en espacio de kernel, por lo que un fallo en un módulo puede colapsar el núcleo.</td>
                  <td>Linux (Loadable Kernel Modules).</td>
                </tr>
                <tr>
                  <td><strong>Híbrida</strong></td>
                  <td>Combina microkernel para modularidad con componentes monolíticos en espacio de kernel para maximizar rendimiento de subsistemas críticos.</td>
                  <td>Equilibrio óptimo entre rendimiento, compatibilidad y modularidad.</td>
                  <td>Complejidad de diseño arquitectónico.</td>
                  <td>Windows NT / 10 / 11, macOS (XNU = Mach + BSD).</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      }
    ],
    examNotes: "Debate Tanenbaum-Torvalds (1992): Tanenbaum sostenía que el diseño monolítico de Linux estaba obsoleto y que el futuro eran los micronúcleos (Minix). Linus defendió que el rendimiento práctico de los monolíticos era muy superior en hardware real.",
    codeSnippet: `/* Ejemplo de Módulo Cargable en Linux (LKM en C) */
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("ULL ESIT SSOO");
MODULE_DESCRIPTION("Modulo de ejemplo para demostrar LKM");

static int __init modulo_inicio(void) {
    printk(KERN_INFO "SSOO ULL: Modulo cargado dinamicamente en el kernel\\n");
    return 0;
}

static void __exit modulo_salida(void) {
    printk(KERN_INFO "SSOO ULL: Modulo descargado del kernel\\n");
}

module_init(modulo_inicio);
module_exit(modulo_salida);`
  },

  9: {
    module: "MÓDULO 3: GESTIÓN DE PROCESOS",
    moduleNumber: 3,
    lessonNumber: 9,
    title: "Procesos",
    subtitle: "Concepto de proceso, espacio de direcciones, PCB, diagrama de estados y llamadas fork/exec",
    summary: "Un proceso es un programa en ejecución. Consta de su código binario, espacio de memoria propio (pila, montón, datos) y su Bloque de Control de Proceso (PCB).",
    sections: [
      {
        title: "1. ¿Qué es un Proceso?",
        content: `
          <p>Un <strong>programa</strong> es una entidad pasiva (un fichero almacena en disco con instrucciones binarias). Un <strong>proceso</strong> es una <em>entidad activa</em>: el programa en ejecución con su contador de programa (PC), sus registros y sus recursos asignados.</p>
          <div class="theory-card">
            <h4>🗺️ Espacio de Direcciones de un Proceso</h4>
            <ul>
              <li><strong>Texto / Código:</strong> Instrucciones de máquina que ejecuta la CPU (de solo lectura).</li>
              <li><strong>Datos Inicializados (.data):</strong> Variables globales y estáticas con valor inicial explícito.</li>
              <li><strong>Datos no Inicializados (.bss):</strong> Variables globales y estáticas sin inicializar (inicializadas a cero por el cargador).</li>
              <li><strong>Montón (Heap):</strong> Memoria reservada dinámicamente en tiempo de ejecución (mediante <code>malloc</code> en C o <code>new</code> en C++). Crece hacia direcciones altas.</li>
              <li><strong>Pila (Stack):</strong> Almacena registros de activación, parámetros de funciones, direcciones de retorno y variables locales. Crece hacia direcciones bajas.</li>
            </ul>
          </div>
        `
      },
      {
        title: "2. El Bloque de Control de Proceso (PCB)",
        content: `
          <p>El sistema operativo representa cada proceso mediante una estructura de datos llamada <strong>PCB (Process Control Block)</strong> o descriptor de proceso (<code>struct task_struct</code> en Linux):</p>
          <ul>
            <li><strong>Identificador de Proceso (PID):</strong> Número entero único que identifica al proceso.</li>
            <li><strong>Estado del proceso:</strong> Nuevo, Listo, En Ejecución, Bloqueado o Terminado.</li>
            <li><strong>Contador de Programa (PC):</strong> Dirección de la siguiente instrucción a ejecutar.</li>
            <li><strong>Registros de la CPU:</strong> Contenido de los registros del procesador cuando el proceso no está en ejecución.</li>
            <li><strong>Información de Planificación:</strong> Prioridad, punteros a colas de planificación, ráfagas de tiempo consumidas.</li>
            <li><strong>Información de Gestión de Memoria:</strong> Tablas de páginas o registros base y límite.</li>
            <li><strong>Información Contable y de E/S:</strong> Descriptores de ficheros abiertos, dispositivos asignados.</li>
          </ul>
        `
      },
      {
        title: "3. Ciclo de Vida y Estados del Proceso",
        content: `
          <p>Un proceso transita entre los siguientes 5 estados fundamentales:</p>
          <ol>
            <li><strong>Nuevo (New):</strong> El proceso está siendo creado.</li>
            <li><strong>Listo (Ready):</strong> El proceso está cargado en memoria y esperando ser asignado a un procesador.</li>
            <li><strong>En ejecución (Running):</strong> Se están ejecutando instrucciones en la CPU.</li>
            <li><strong>Esperando / Bloqueado (Waiting):</strong> El proceso está esperando a que ocurra un evento (terminación de E/S o recepción de una señal).</li>
            <li><strong>Terminado (Terminated):</strong> El proceso ha completado su ejecución.</li>
          </ol>
          <div class="callout callout-important">
            <span class="callout-icon">🔄</span>
            <div>
              <strong>Cambio de Contexto (Context Switch):</strong>
              Consiste en salvar el estado del proceso actual en su PCB y cargar el estado salvado del nuevo proceso seleccionado para ejecutar. Es <em>sobrecarga pura</em>: la máquina no realiza trabajo útil mientras conmuta de contexto.
            </div>
          </div>
        `
      },
      {
        title: "4. Creación y Terminación: fork, exec, wait",
        content: `
          <p>En sistemas POSIX / Linux:</p>
          <ul>
            <li><code>fork()</code>: Crea un nuevo proceso duplicando el proceso padre. El hijo obtiene una copia idéntica del espacio de memoria (optimizada mediante <em>Copy-on-Write</em>). <code>fork()</code> devuelve 0 al proceso hijo y el PID del hijo al proceso padre.</li>
            <li><code>exec()</code>: Sustituye el espacio de memoria y el código del proceso actual por un nuevo programa binario ejecutable.</li>
            <li><code>wait() / waitpid()</code>: El padre suspende su ejecución hasta que un hijo termine, recogiendo su código de salida.</li>
            <li><strong>Proceso Zombie:</strong> Un proceso hijo que ha terminado pero su padre aún no ha invocado <code>wait()</code>. Su PCB permanece en la tabla del sistema.</li>
            <li><strong>Proceso Huérfano:</strong> Un proceso cuyo padre terminó antes que él. Es adoptado inmediatamente por <code>init</code> (PID 1), que realiza periódicamente <code>wait()</code> para limpiar zombies.</li>
          </ul>
        `
      }
    ],
    examNotes: "Cálculo en examen ULL: ¿Cuántos procesos crea un código con varios fork()? Fórmula: con $N$ llamadas fork() consecutivas sin control condicional se generan $2^N$ procesos en total ($2^N - 1$ procesos hijos creados).",
    codeSnippet: `// Patrón clásico de creación de procesos en C (POSIX)
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        perror("Fallo en fork");
        return 1;
    } else if (pid == 0) {
        // Código ejecutado exclusivamente por el PROCESO HIJO
        printf("[Hijo] PID: %d, PPID: %d. Ejecutando nuevo programa...\\n", getpid(), getppid());
        execlp("/bin/ls", "ls", "-l", NULL);
        perror("Fallo en exec");
        return 1;
    } else {
        // Código ejecutado exclusivamente por el PROCESO PADRE
        printf("[Padre] PID: %d. Esperando a que el hijo %d termine...\\n", getpid(), pid);
        int status;
        waitpid(pid, &status, 0); // Evita que el hijo quede en estado zombie
        printf("[Padre] Hijo terminado con estado: %d\\n", WEXITSTATUS(status));
    }
    return 0;
}`
  },

  10: {
    module: "MÓDULO 3: GESTIÓN DE PROCESOS",
    moduleNumber: 3,
    lessonNumber: 10,
    title: "Planificación de la CPU",
    subtitle: "Ráfagas de CPU/IO, criterios de planificación y algoritmos FCFS, SJF, SRTF, RR y Prioridades",
    summary: "El planificador de la CPU asigna los núcleos de procesamiento a los procesos listos, buscando maximizar el rendimiento y la equidad minimizando los tiempos de espera y respuesta.",
    sections: [
      {
        title: "1. Ciclo de Ráfagas y Tipos de Planificación",
        content: `
          <p>La ejecución de un proceso consiste en una alternancia entre <strong>ráfagas de CPU</strong> (procesamiento intensivo) y <strong>ráfagas de E/S</strong> (espera de datos del disco, red o teclado).</p>
          <div class="grid-2col">
            <div class="theory-card">
              <h4>🛑 Planificación No Apropiativa (Cooperativa)</h4>
              <p>Una vez que la CPU ha sido asignada a un proceso, este la conserva hasta que termina o hasta que voluntariamente pasa al estado de espera (bloqueo por E/S).</p>
            </div>
            <div class="theory-card">
              <h4>⚡ Planificación Apropiativa (Con Desalojo)</h4>
              <p>El sistema operativo puede desalojar a la fuerza a un proceso que está ejecutándose en la CPU (por ejemplo, al agotarse su cuanto de tiempo o al llegar un proceso con mayor prioridad).</p>
            </div>
          </div>
        `
      },
      {
        title: "2. Criterios y Fórmulas de Evaluación",
        content: `
          <div class="table-responsive">
            <table class="theory-table">
              <thead>
                <tr>
                  <th>Métrica</th>
                  <th>Definición y Fórmula</th>
                  <th>Objetivo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Utilización de CPU</strong></td>
                  <td>Porcentaje de tiempo que la CPU está ocupada realizando trabajo útil: $U = (t_{ocupada} / t_{total}) \\times 100\\%$</td>
                  <td>Maximizar (40% a 90%)</td>
                </tr>
                <tr>
                  <td><strong>Rendimiento (Throughput)</strong></td>
                  <td>Número de procesos completados por unidad de tiempo: $R = N / t_{total}$</td>
                  <td>Maximizar</td>
                </tr>
                <tr>
                  <td><strong>Tiempo de Retorno (Turnaround)</strong></td>
                  <td>Tiempo transcurrido desde que el proceso llega hasta que finaliza por completo: $T_{retorno} = T_{fin} - T_{llegada}$</td>
                  <td>Minimizar</td>
                </tr>
                <tr>
                  <td><strong>Tiempo de Espera (Waiting Time)</strong></td>
                  <td>Tiempo total que el proceso ha pasado en la cola de listos esperando por CPU: $T_{espera} = T_{retorno} - Ráfaga_{CPU}$</td>
                  <td>Minimizar</td>
                </tr>
                <tr>
                  <td><strong>Tiempo de Respuesta (Response)</strong></td>
                  <td>Tiempo transcurrido desde la llegada hasta la primera vez que obtiene la CPU: $T_{respuesta} = T_{1^{a}\\_ejecución} - T_{llegada}$</td>
                  <td>Minimizar</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        title: "3. Algoritmos Clásicos de Planificación",
        content: `
          <ul>
            <li><strong>FCFS (First-Come, First-Served):</strong> No apropiativo. Los procesos se asignan en orden estricto de llegada a la cola de listos. Sufre del <em>efecto convoy</em> (procesos cortos esperando detrás de uno muy largo).</li>
            <li><strong>SJF (Shortest Job First):</strong> No apropiativo. Asigna la CPU al proceso con la ráfaga de CPU más corta. Es <em>óptimo</em> para minimizar el tiempo medio de espera. Puede causar <em>inanición (starvation)</em> de procesos largos.</li>
            <li><strong>SRTF (Shortest Remaining Time First):</strong> Versión apropiativa de SJF. Si llega un nuevo proceso con una ráfaga inferior al tiempo restante del proceso en ejecución, este es desalojado.</li>
            <li><strong>Round Robin (RR):</strong> Apropiativo con cuanto de tiempo fijo ($q$). Cada proceso recibe como máximo un turno de $q$ unidades de tiempo. Si $q \\to \\infty$, se convierte en FCFS; si $q$ es muy pequeño, la sobrecarga por cambios de contexto degrada el sistema.</li>
            <li><strong>Prioridades:</strong> Se asigna un número de prioridad a cada proceso (menor número = mayor prioridad). Para evitar la inanición se utiliza la técnica de <strong>envejecimiento (aging)</strong>, incrementando la prioridad de los procesos a medida que esperan en la cola.</li>
            <li><strong>Colas Multinivel con Retroalimentación (MLFQ):</strong> Múltiples colas con diferentes prioridades y algoritmos; los procesos pueden cambiar de cola según su comportamiento de ráfaga de CPU.</li>
          </ul>
        `
      }
    ],
    examNotes: "Problema garantizado en exámenes ULL ESIT: Construir el Diagrama de Gantt para un conjunto de procesos con tiempos de llegada y ráfagas, y calcular el Tiempo Medio de Espera (TME) y el Tiempo Medio de Retorno (TMR) comparando FCFS, SJF, SRTF y Round Robin.",
    codeSnippet: `// Cálculo analítico del tiempo de espera y retorno para un proceso en C
typedef struct {
    int pid;
    int t_llegada;
    int t_rafaga;
    int t_restante;
    int t_comienzo;
    int t_fin;
    int t_retorno;
    int t_espera;
    int t_respuesta;
} Proceso;

void calcular_metricas(Proceso *p) {
    p->t_retorno = p->t_fin - p->t_llegada;
    p->t_espera = p->t_retorno - p->t_rafaga;
}`
  },

  11: {
    module: "MÓDULO 3: GESTIÓN DE PROCESOS",
    moduleNumber: 3,
    lessonNumber: 11,
    title: "Paso de mensajes",
    subtitle: "Mecanismo IPC de comunicación indirecta y directa, buzones, puertos y sincronización",
    summary: "El paso de mensajes permite a los procesos comunicarse y sincronizarse sin compartir un espacio de direcciones común, siendo fundamental tanto en sistemas mononúcleo como en sistemas distribuidos.",
    sections: [
      {
        title: "1. Fundamentos del Paso de Mensajes (IPC)",
        content: `
          <p>Un sistema de paso de mensajes proporciona al menos dos operaciones primitivas fundamentales:</p>
          <ul>
            <li><code>send(destino, mensaje)</code>: Envía un mensaje al receptor especificado.</li>
            <li><code>receive(origen, mensaje)</code>: Recibe un mensaje del emisor especificado.</li>
          </ul>
        `
      },
      {
        title: "2. Esquemas de Direccionamiento",
        content: `
          <div class="grid-2col">
            <div class="theory-card">
              <h4>📬 Comunicación Directa</h4>
              <p>Cada proceso que desea comunicarse debe nombrar explícitamente al receptor o emisor:</p>
              <ul>
                <li><strong>Simétrica:</strong> <code>send(P, msg)</code> y <code>receive(Q, msg)</code>. Ambos se conocen.</li>
                <li><strong>Asimétrica:</strong> <code>send(P, msg)</code> y <code>receive(&id, msg)</code>. El receptor acepta mensajes de cualquier origen y la variable <code>id</code> recibe el remitente.</li>
              </ul>
            </div>
            <div class="theory-card">
              <h4>📮 Comunicación Indirecta (Buzones / Mailboxes)</h4>
              <p>Los mensajes se envían a y se reciben desde <em>buzones</em> o <em>puertos</em> abstractos compartidos:</p>
              <ul>
                <li><code>send(Buzon_A, msg)</code></li>
                <li><code>receive(Buzon_A, msg)</code></li>
                <li>Permite relaciones de comunicación 1 a 1, 1 a Muchos o Muchos a Muchos sin acoplamiento directo entre PIDs.</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: "3. Sincronización y Capacidad del Búfer",
        content: `
          <p>La comunicación puede ser <strong>bloqueante (síncrona)</strong> o <strong>no bloqueante (asíncrona)</strong>:</p>
          <ul>
            <li><strong>Envío bloqueante:</strong> El proceso emisor se suspende hasta que el mensaje es recibido por el receptor o almacenado en el buzón.</li>
            <li><strong>Envío no bloqueante:</strong> El emisor deposita el mensaje y reanuda su ejecución inmediatamente.</li>
            <li><strong>Recepción bloqueante:</strong> El receptor se bloquea hasta que hay un mensaje disponible en la cola.</li>
            <li><strong>Recepción no bloqueante:</strong> El receptor obtiene un mensaje si existe o recibe un indicador nulo/error de inmediato.</li>
          </ul>
          <p><strong>Capacidad del enlace/búfer:</strong></p>
          <ol>
            <li><strong>Capacidad Cero:</strong> No hay cola de espera. El emisor <em>debe</em> esperar al receptor obligatoriamente (<strong>Punto de Encuentro o Rendezvous</strong>).</li>
            <li><strong>Capacidad Acotada ($N$):</strong> El búfer almacena hasta $N$ mensajes. Si está lleno, el emisor bloqueante debe esperar.</li>
            <li><strong>Capacidad Ilimitada:</strong> El búfer puede crecer indefinidamente. El emisor nunca se bloquea.</li>
          </ol>
        `
      }
    ],
    examNotes: "Diferencia clave en examen: El paso de mensajes no sufre de condiciones de carrera directas en memoria, ya que los datos viajan mediante copias gestionadas por el kernel, pero presenta mayor sobrecarga de llamadas al sistema que la memoria compartida.",
    codeSnippet: `// Ejemplo en C usando colas de mensajes POSIX (mq_open, mq_send, mq_receive)
#include <mqueue.h>
#include <stdio.h>
#include <string.h>

void demo_posix_mq() {
    mqd_t mq = mq_open("/mi_cola_ull", O_CREAT | O_RDWR, 0644, NULL);
    char buffer[128] = "Mensaje IPC desde proceso emisor";
    
    // Envío de mensaje con prioridad 1
    mq_send(mq, buffer, strlen(buffer) + 1, 1);
    
    char recv_buf[128];
    unsigned int prio;
    // Recepción bloqueante
    mq_receive(mq, recv_buf, sizeof(recv_buf), &prio);
    printf("Recibido: %s con prioridad %u\\n", recv_buf, prio);
    mq_close(mq);
}`
  },

  12: {
    module: "MÓDULO 3: GESTIÓN DE PROCESOS",
    moduleNumber: 3,
    lessonNumber: 12,
    title: "Memoria compartida",
    subtitle: "Región de memoria compartida, mapeo con mmap, llamadas POSIX y necesidad de sincronización",
    summary: "La memoria compartida permite a dos o más procesos acceder a la misma zona de memoria física, proporcionando el mecanismo IPC más rápido posible al evitar la intervención del kernel en cada transferencia.",
    sections: [
      {
        title: "1. Concepto y Funcionamiento",
        content: `
          <p>Por defecto, el sistema operativo aísla el espacio de direcciones de cada proceso mediante hardware (MMU) para garantizar la seguridad. La <strong>memoria compartida</strong> consiste en que dos o más procesos acuerdan eliminar dicha protección sobre una región concreta, mapeando los mismos marcos físicos en sus respectivas tablas de páginas.</p>
          <div class="callout callout-important">
            <span class="callout-icon">⚡</span>
            <div>
              <strong>Máxima Velocidad:</strong>
              Una vez establecida la región compartida, los procesos leen y escriben a la velocidad nativa de la memoria RAM principal, sin necesidad de llamadas al sistema intermedias ni copias de datos al espacio del kernel.
            </div>
          </div>
        `
      },
      {
        title: "2. Responsabilidad de Sincronización",
        content: `
          <p>A diferencia del paso de mensajes, donde el kernel gestiona los buzones y el orden, en la memoria compartida el sistema operativo <strong>no proporciona sincronización implícita</strong>.</p>
          <p>Es responsabilidad <em>estricta del programador</em> utilizar mecanismos de sincronización (semáforos o cerrojos mutex) para evitar que dos procesos escriban simultáneamente en la misma posición provocando condiciones de carrera y corrupción de datos.</p>
        `
      },
      {
        title: "3. API POSIX para Memoria Compartida",
        content: `
          <ol>
            <li><code>shm_open()</code>: Crea o abre un objeto de memoria compartida POSIX (similar a <code>open</code>).</li>
            <li><code>ftruncate()</code>: Fija el tamaño en bytes de la región compartida.</li>
            <li><code>mmap()</code>: Proyecta la memoria compartida en el espacio de direcciones virtuales del proceso invocador.</li>
            <li><code>munmap()</code>: Desasocia la proyección de memoria.</li>
            <li><code>shm_unlink()</code>: Elimina el nombre del objeto de memoria compartida del sistema.</li>
          </ol>
        `
      }
    ],
    examNotes: "Comparativa clásica en la ULL ESIT: Memoria Compartida vs Paso de Mensajes. La memoria compartida es ideal para grandes volúmenes de datos locales de alta velocidad; el paso de mensajes es superior para sistemas distribuidos y volúmenes de datos pequeños sin sincronización explícita.",
    codeSnippet: `// Ejemplo en C: Creación y proyección de memoria compartida POSIX
#include <stdio.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <unistd.h>

typedef struct {
    int contador;
    char mensaje[64];
} DatosCompartidos;

int main() {
    // 1. Crear el objeto en /dev/shm
    int fd = shm_open("/shm_ssoo_ull", O_CREAT | O_RDWR, 0666);
    // 2. Definir el tamaño en memoria
    ftruncate(fd, sizeof(DatosCompartidos));
    // 3. Proyectar en la tabla de páginas del proceso
    DatosCompartidos *shm_ptr = (DatosCompartidos*) mmap(
        NULL, sizeof(DatosCompartidos),
        PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0
    );
    
    // Escritura directa a velocidad de RAM sin syscall
    shm_ptr->contador = 42;
    
    munmap(shm_ptr, sizeof(DatosCompartidos));
    close(fd);
    return 0;
}`
  },

  13: {
    module: "MÓDULO 3: GESTIÓN DE PROCESOS",
    moduleNumber: 3,
    lessonNumber: 13,
    title: "Hilos",
    subtitle: "Unidad básica de utilización de CPU, modelos de hilos y ventajas frente a procesos",
    summary: "Un hilo (thread) es la unidad básica de ejecución en la CPU. Múltiples hilos dentro de un mismo proceso comparten el código, los datos y los archivos abiertos, pero mantienen su propio contador de programa, registros y pila.",
    sections: [
      {
        title: "1. ¿Qué es un Hilo?",
        content: `
          <p>Un hilo es un flujo de control secuencial dentro de un proceso. Un proceso tradicional dispone de un único hilo de control. Los sistemas modernos permiten <strong>procesos multihilo</strong>.</p>
          <div class="grid-2col">
            <div class="theory-card">
              <h4>📦 Lo que CADA HILO tiene propio:</h4>
              <ul>
                <li>Identificador de hilo (TID).</li>
                <li>Contador de Programa (PC) individual.</li>
                <li>Conjunto de Registros de la CPU.</li>
                <li>Pila propia (Stack) para variables locales y llamadas.</li>
              </ul>
            </div>
            <div class="theory-card">
              <h4>🤝 Lo que TODOS LOS HILOS comparten:</h4>
              <ul>
                <li>Segmento de Código / Texto de instrucciones.</li>
                <li>Segmento de Datos y variables globales.</li>
                <li>El Montón (Heap) y memoria dinámica.</li>
                <li>Recursos del SO (descriptores de ficheros, señales).</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: "2. Ventajas del Multihilo",
        content: `
          <ul>
            <li><strong>Capacidad de respuesta (Reactivity):</strong> Una aplicación puede mantener una interfaz interactiva mientras otro hilo realiza cómputos pesados en segundo plano.</li>
            <li><strong>Compartición de recursos:</strong> Comparten memoria por defecto sin necesidad de configurar IPC ni llamadas complejas al sistema.</li>
            <li><strong>Economía:</strong> Crear un hilo y conmutar el contexto entre hilos de un mismo proceso es mucho más barato que entre procesos independientes (no requiere invalidar la caché TLB ni cambiar tablas de páginas).</li>
            <li><strong>Aprovechamiento de arquitecturas multinúcleo:</strong> Los hilos pueden ejecutarse simultáneamente en núcleos físicos distintos.</li>
          </ul>
        `
      },
      {
        title: "3. Modelos de Correspondencia Multihilo",
        content: `
          <ul>
            <li><strong>Muchos a Uno (Many-to-One):</strong> Múltiples hilos a nivel de usuario gestionados por una librería en espacio de usuario se asignan a un solo hilo de kernel. <em>Desventaja:</em> Si un hilo realiza una llamada al sistema bloqueante, todo el proceso se congela; no puede aprovechar varios núcleos de CPU.</li>
            <li><strong>Uno a Uno (One-to-One):</strong> Cada hilo de usuario se mapea directamente a un hilo del núcleo. Es el modelo estándar en Linux (NPTL - Native POSIX Thread Library) y Windows. Permite paralelismo real en multinúcleo; ligera sobrecarga en la creación de hilos en el kernel.</li>
            <li><strong>Muchos a Muchos (Many-to-Many):</strong> Multiplexa $M$ hilos de usuario sobre $N$ hilos de kernel ($M \\ge N$). Ofrece flexibilidad, pero su implementación es extremadamente compleja.</li>
          </ul>
        `
      }
    ],
    examNotes: "Cuidado en el examen: Los hilos de un mismo proceso NO están protegidos entre sí. Si un hilo corrompe un puntero en el Heap o realiza un acceso ilegal, todo el proceso colapsará provocando un Segmentation Fault.",
    codeSnippet: `// Creación de hilos concurrentes en C con POSIX Threads (pthreads)
#include <pthread.h>
#include <stdio.h>

void* tarea_hilo(void* arg) {
    long id = (long)arg;
    printf("Hilo #%ld ejecutándose en su propio flujo de control\\n", id);
    pthread_exit(NULL);
}

int main() {
    pthread_t hilos[4];
    for (long i = 0; i < 4; i++) {
        pthread_create(&hilos[i], NULL, tarea_hilo, (void*)i);
    }
    for (int i = 0; i < 4; i++) {
        pthread_join(hilos[i], NULL); // Espera la finalización de los hilos
    }
    return 0;
}`
  },

  14: {
    module: "MÓDULO 3: GESTIÓN DE PROCESOS",
    moduleNumber: 3,
    lessonNumber: 14,
    title: "Sincronización",
    subtitle: "Condiciones de carrera, problema de la sección crítica, algoritmo de Peterson, semáforos y mutex",
    summary: "Cuando múltiples procesos o hilos acceden a datos compartidos de forma concurrente, el resultado depende del orden de intercalación. La sincronización garantiza la exclusión mutua y previene errores de concurrencia.",
    sections: [
      {
        title: "1. Condiciones de Carrera y Sección Crítica",
        content: `
          <p>Una <strong>condición de carrera (race condition)</strong> ocurre cuando varios procesos acceden y manipulan los mismos datos compartidos de forma concurrente y el resultado final depende del orden concreto en el que se intercalan las instrucciones de la CPU.</p>
          <div class="theory-card">
            <h4>📐 Los Tres Requisitos del Problema de la Sección Crítica:</h4>
            <ol>
              <li><strong>Exclusión Mutua (Mutual Exclusion):</strong> Si el proceso $P_i$ está ejecutando su sección crítica, ningún otro proceso puede estar ejecutando su sección crítica simultáneamente.</li>
              <li><strong>Progreso (Progress):</strong> Si ningún proceso está en su sección crítica y hay procesos que desean entrar, solo aquellos que no estén en su sección restante pueden participar en la decisión de quién entra a continuación, y la decisión no puede posponerse indefinidamente.</li>
              <li><strong>Espera Acotada (Bounded Waiting):</strong> Debe existir un límite finito en el número de veces que se permite a otros procesos entrar a sus secciones críticas después de que un proceso haya solicitado entrar y antes de que se conceda dicha solicitud (previene la inanición).</li>
            </ol>
          </div>
        `
      },
      {
        title: "2. Solución de Peterson y Soporte Hardware",
        content: `
          <p>El <strong>Algoritmo de Peterson</strong> es una solución clásica basada en software para 2 procesos que utiliza dos variables compartidas: <code>boolean flag[2]</code> (indica intención de entrar) y <code>int turn</code> (indica a quién le toca el turno en caso de empate).</p>
          <p>A nivel de hardware, los procesadores modernos ofrecen <strong>instrucciones atómicas e indivisibles</strong>:</p>
          <ul>
            <li><code>TestAndSet(&variable)</code>: Lee el valor de una variable y la fija a 1 en un único ciclo indivisible.</li>
            <li><code>CompareAndSwap(&val, esperado, nuevo)</code>: Compara <code>val</code> con el valor esperado y, si coinciden, lo actualiza al nuevo valor atómicamente.</li>
          </ul>
        `
      },
      {
        title: "3. Primitivas: Mutex y Semáforos",
        content: `
          <div class="grid-2col">
            <div class="theory-card">
              <h4>🔒 Cerrojos Mutex</h4>
              <p>Variable binaria con dos operaciones: <code>acquire()</code> y <code>release()</code>. Si el cerrojo está tomado, el hilo que intenta adquirirlo se bloquea o realiza una espera activa (<em>spinlock</em>).</p>
            </div>
            <div class="theory-card">
              <h4>🚦 Semáforos de Dijkstra</h4>
              <p>Variable entera $S$ accesible únicamente a través de dos operaciones atómicas estándar:</p>
              <ul>
                <li><code>wait(S)</code> (o $P(S)$): Si $S \le 0$ espera; decrementa $S$ en 1.</li>
                <li><code>signal(S)</code> (o $V(S)$): Incrementa $S$ en 1 y despierta a un proceso bloqueado.</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: "4. Problemas Clásicos de Sincronización",
        content: `
          <ul>
            <li><strong>Productor-Consumidor (Búfer Acotado):</strong> Tres semáforos: <code>mutex=1</code> (exclusión mutua del búfer), <code>empty=N</code> (huecos vacíos disponibles), <code>full=0</code> (elementos producidos disponibles).</li>
            <li><strong>Lectores-Escritores:</strong> Múltiples lectores pueden leer simultáneamente, pero un escritor exige acceso exclusivo impidiendo la lectura o escritura simultánea de cualquier otro.</li>
            <li><strong>Cena de los Filósofos:</strong> Ilustra el riesgo de <em>interbloqueo (deadlock)</em> si los 5 filósofos toman simultáneamente el palillo de su izquierda y quedan esperando el de su derecha para siempre.</li>
          </ul>
        `
      }
    ],
    examNotes: "Pregunta clásica: ¿Por qué en un sistema monoprocesador basta con desactivar interrupciones para lograr exclusión mutua pero en un multiprocesador esto es ineficaz? En multiprocesador desactivar interrupciones en un núcleo no impide que los otros núcleos sigan ejecutando código concurrente.",
    codeSnippet: `// Solución clásica al Productor-Consumidor con semáforos POSIX
#include <semaphore.h>
#include <pthread.h>

sem_t mutex; // Controla la exclusión mutua sobre el búfer
sem_t empty; // Contador de huecos libres (inicia en N)
sem_t full;  // Contador de elementos ocupados (inicia en 0)

void* productor(void* arg) {
    while(1) {
        int item = producir_dato();
        sem_wait(&empty); // Espera a que haya un hueco libre
        sem_wait(&mutex); // Entra en sección crítica
        insertar_en_buffer(item);
        sem_post(&mutex); // Sale de sección crítica
        sem_post(&full);  // Notifica que hay un nuevo elemento disponible
    }
}`
  },

  15: {
    module: "MÓDULO 4: GESTIÓN DE LA MEMORIA",
    moduleNumber: 4,
    lessonNumber: 15,
    title: "Memoria principal",
    subtitle: "Jerarquía de memoria, vinculación de direcciones, MMU, asignación contigua y fragmentación",
    summary: "La memoria principal es el repositorio central de almacenamiento de acceso rápido para la CPU. La gestión de memoria coordina la reubicación, protección y partición del espacio físico.",
    sections: [
      {
        title: "1. Vinculación de Direcciones (Address Binding)",
        content: `
          <p>Un programa reside en disco como fichero ejecutable binario. Para ser ejecutado debe ser llevado a la memoria principal. La vinculación de instrucciones y datos a direcciones de memoria puede ocurrir en tres fases:</p>
          <ul>
            <li><strong>Tiempo de compilación:</strong> Si se conoce de antemano la posición física exacta de memoria, se genera <em>código absoluto</em>. Si la dirección cambia, debe recompilarse todo el programa.</li>
            <li><strong>Tiempo de carga:</strong> El compilador genera <em>código reubicable</em>. La vinculación definitiva a direcciones físicas se realiza en el momento de cargar el programa en memoria.</li>
            <li><strong>Tiempo de ejecución:</strong> Si el proceso puede moverse de una posición a otra durante su ejecución, la vinculación se pospone hasta la propia instrucción mediante hardware especial: la <strong>MMU (Memory Management Unit)</strong> con registros base y límite.</li>
          </ul>
        `
      },
      {
        title: "2. Espacio de Direcciones Lógicas vs Físicas",
        content: `
          <p>La dirección generada por la CPU se denomina <strong>dirección lógica o virtual</strong>. La dirección cargada en el bus de direcciones de la memoria RAM se denomina <strong>dirección física</strong>.</p>
          <div class="theory-card">
            <h4>🛡️ Registros Base y Límite de la MMU:</h4>
            <p>El <strong>registro base (o de reubicación)</strong> contiene la dirección física mínima del proceso. El <strong>registro límite</strong> contiene el tamaño máximo del proceso. Para cada acceso:</p>
            <p style="text-align:center; font-family:monospace; font-size:1.1rem; color:var(--accent-blue);">
              Dirección Lógica &lt; Límite ? (Dirección Física = Dirección Lógica + Base) : TRAP_VIOLACION_MEMORIA
            </p>
          </div>
        `
      },
      {
        title: "3. Asignación Contigua y Fragmentación",
        content: `
          <p>En los esquemas clásicos continuos, cada proceso ocupa una sección contigua de memoria:</p>
          <div class="grid-2col">
            <div class="theory-card">
              <h4>🧩 Fragmentación Interna</h4>
              <p>Ocurre cuando la memoria asignada a un proceso es ligeramente mayor que la solicitada (típico en particiones fijas). El espacio sobrante dentro del bloque asignado está desperdiciado y no puede ser usado por nadie más.</p>
            </div>
            <div class="theory-card">
              <h4>🕳️ Fragmentación Externa</h4>
              <p>Ocurre en particiones variables cuando hay suficiente memoria libre total en el sistema para satisfacer una petición, pero está dividida en pequeños <em>huecos dispersos</em> no contiguos. Se soluciona mediante <strong>compactación</strong>.</p>
            </div>
          </div>
          <p><strong>Estrategias de Asignación de Huecos Dinámicos:</strong></p>
          <ul>
            <li><strong>Primer Ajuste (First-Fit):</strong> Asigna el primer hueco que sea suficientemente grande. Muy rápido.</li>
            <li><strong>Mejor Ajuste (Best-Fit):</strong> Busca el hueco más pequeño que sea suficiente. Genera los huecos residuales más pequeños posibles.</li>
            <li><strong>Peor Ajuste (Worst-Fit):</strong> Asigna el hueco más grande disponible. Deja el hueco sobrante más grande posible (suele ser ineficiente).</li>
          </ul>
        `
      }
    ],
    examNotes: "Demostración teórica en examen ULL: La 'regla del 50%' establece que, utilizando la estrategia de primer ajuste, si se asignan $N$ bloques, las pérdidas por fragmentación externa harán que aproximadamente $0.5 N$ bloques adicionales se pierdan en huecos.",
    codeSnippet: `// Comprobación hardware de la MMU (simulación lógica)
bool mmu_translate(uint32_t logical_addr, uint32_t base, uint32_t limit, uint32_t *physical_addr) {
    if (logical_addr >= limit) {
        // La dirección lógica sobrepasa el límite asignado al proceso
        trigger_cpu_trap(TRAP_SEGMENTATION_FAULT);
        return false;
    }
    *physical_addr = logical_addr + base;
    return true;
}`
  },

  16: {
    module: "MÓDULO 4: GESTIÓN DE LA MEMORIA",
    moduleNumber: 4,
    lessonNumber: 16,
    title: "Paginación",
    subtitle: "Marcos de página, páginas lógicas, tablas de páginas, TLB y tiempo de acceso efectivo",
    summary: "La paginación es un esquema de gestión de memoria que permite que el espacio físico de un proceso sea no contiguo, eliminando la fragmentación externa dividiendo la memoria en bloques de tamaño fijo.",
    sections: [
      {
        title: "1. Mecanismo de Paginación Básica",
        content: `
          <p>La paginación divide la memoria de forma homogénea:</p>
          <ul>
            <li>La <strong>memoria física</strong> se divide en bloques de tamaño fijo denominados <strong>Marcos de Página (Frames)</strong>.</li>
            <li>La <strong>memoria lógica</strong> se divide en bloques del mismo tamaño exacto denominados <strong>Páginas (Pages)</strong>.</li>
            <li>El tamaño de página es siempre una potencia de 2 (habitualmente 4 KB u 8 KB).</li>
          </ul>
          <p>Cada dirección lógica generada por la CPU se descompone en dos campos:</p>
          <div class="theory-card">
            <h4>Dirección Lógica = [ Número de Página ($p$) | Desplazamiento ($d$) ]</h4>
            <p>Si la dirección lógica tiene $m$ bits y el tamaño de página es $2^n$ bytes:</p>
            <ul>
              <li>El <strong>desplazamiento ($d$)</strong> ocupa los $n$ bits de menor peso (offset dentro de la página).</li>
              <li>El <strong>número de página ($p$)</strong> ocupa los $m - n$ bits de mayor peso (índice en la tabla de páginas).</li>
              <li><strong>Traducción a Física:</strong> Se consulta la Tabla de Páginas para obtener el marco $f$. La dirección física resultante es: $(f \times 2^n) + d$.</li>
            </ul>
          </div>
        `
      },
      {
        title: "2. El TLB (Translation Lookaside Buffer)",
        content: `
          <p>Dado que la Tabla de Páginas reside en la memoria RAM, cada acceso a memoria requeriría dos accesos físicos: uno para leer la tabla de páginas y otro para leer los datos reales, reduciendo la velocidad a la mitad.</p>
          <p>Para solucionarlo, la MMU incorpora el <strong>TLB (Translation Lookaside Buffer)</strong>, una memoria asociativa caché de hardware ultrarrápida que almacena las traducciones recientes $(p \to f)$.</p>
          <div class="callout callout-important">
            <span class="callout-icon">📈</span>
            <div>
              <strong>Cálculo del Tiempo de Acceso Efectivo (EAT):</strong>
              Si la tasa de acierto del TLB es $\alpha$, el tiempo de búsqueda en el TLB es $\epsilon$, y el tiempo de acceso a la memoria RAM principal es $t_{mem}$:
              <p style="text-align:center; font-family:monospace; font-size:1.05rem; color:var(--accent-blue); margin-top:0.5rem;">
                EAT = \alpha \times (\epsilon + t_{mem}) + (1 - \alpha) \times (\epsilon + 2 \times t_{mem})
              </p>
            </div>
          </div>
        `
      },
      {
        title: "3. Bits de Control en la Tabla de Páginas",
        content: `
          <p>Cada entrada de la tabla de páginas (PTE) incluye bits de estado esenciales:</p>
          <ul>
            <li><strong>Bit de Validez / Presencia (V/I):</strong> 1 si la página está presente en la memoria física RAM; 0 si la página es ilegal o está expulsada a disco (memoria virtual).</li>
            <li><strong>Bits de Protección:</strong> Permisos de Lectura (R), Escritura (W) y Ejecución (X).</li>
            <li><strong>Bit Modificado / Sucio (Dirty Bit):</strong> 1 si la página ha sido modificada por una escritura desde que se cargó.</li>
            <li><strong>Bit de Referencia:</strong> 1 si la página ha sido leída o escrita recientemente (utilizado por algoritmos de reemplazo).</li>
          </ul>
        `
      }
    ],
    examNotes: "Ejercicio típico ULL ESIT: Dada una dirección lógica de 32 bits con páginas de 4 KB ($2^{12}$ bytes), calcular el número de página $p$ y el desplazamiento $d$, traducir la dirección física con la tabla dada y calcular el EAT para un hit-ratio del 95%.",
    codeSnippet: `// Traducción de dirección en C con operaciones binarias
#define PAGE_SHIFT 12          // 4 KB = 2^12 bytes
#define PAGE_MASK  0x00000FFF   // Máscara para obtener los 12 bits de desplazamiento

uint32_t traducir_direccion(uint32_t logica, uint32_t *tabla_paginas) {
    uint32_t p = logica >> PAGE_SHIFT;    // Número de página (bits altos)
    uint32_t d = logica & PAGE_MASK;      // Desplazamiento (bits bajos)
    uint32_t f = tabla_paginas[p];        // Consulta del marco en la tabla
    return (f << PAGE_SHIFT) | d;         // Dirección física compuesta
}`
  },

  17: {
    module: "MÓDULO 4: GESTIÓN DE LA MEMORIA",
    moduleNumber: 4,
    lessonNumber: 17,
    title: "Memoria virtual",
    subtitle: "Paginación por demanda, fallo de página, algoritmos de reemplazo y thrashing",
    summary: "La memoria virtual separa la memoria lógica del usuario de la memoria física real, permitiendo ejecutar programas mucho más grandes que la memoria RAM física disponible mediante paginación por demanda.",
    sections: [
      {
        title: "1. Paginación por Demanda y Fallo de Página",
        content: `
          <p>En la <strong>paginación por demanda</strong>, las páginas de un proceso solo se cargan en memoria principal cuando el procesador intenta acceder a ellas. Si la CPU referencia una página que no está cargada en RAM (bit de validez = 0), la MMU genera una trampa hardware llamada <strong>Fallo de Página (Page Fault)</strong>.</p>
          <div class="theory-card">
            <h4>🔄 Secuencia de Atención a un Fallo de Página (6 Pasos):</h4>
            <ol>
              <li>La MMU detecta el bit de validez a 0 e interrumpe la CPU con un trap de fallo de página.</li>
              <li>El SO suspende el proceso y comprueba en el PCB si la dirección lógica era legal o un acceso indebido.</li>
              <li>Se localiza la página deseada en el almacenamiento secundario (área de intercambio o swap en disco).</li>
              <li>Se busca un marco libre en la RAM. Si no hay marcos libres, se ejecuta un <strong>algoritmo de reemplazo de páginas</strong> para elegir una página víctima (si la víctima está 'sucia', se escribe a disco).</li>
              <li>Se inicia la lectura de disco para cargar la página requerida en el marco asignado.</li>
              <li>Al finalizar la E/S, se actualiza la tabla de páginas con el marco y bit de validez = 1, y se <strong>reinicia exactamente la instrucción</strong> que causó el fallo.</li>
            </ol>
          </div>
        `
      },
      {
        title: "2. Algoritmos de Reemplazo de Páginas",
        content: `
          <div class="table-responsive">
            <table class="theory-table">
              <thead>
                <tr>
                  <th>Algoritmo</th>
                  <th>Criterio de Elección de Víctima</th>
                  <th>Características y Rendimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>FIFO (First-In, First-Out)</strong></td>
                  <td>Expulsa la página que lleva más tiempo en memoria principal.</td>
                  <td>Fácil de implementar con cola. Sufre de la <strong>Anomalía de Bélády</strong> (aumentar el número de marcos puede aumentar el número de fallos).</td>
                </tr>
                <tr>
                  <td><strong>Óptimo (OPT / MIN)</strong></td>
                  <td>Expulsa la página que no será referenciada durante el período más largo en el futuro.</td>
                  <td>Produce la menor tasa de fallos posible. Teórico e inviable en la práctica (requiere conocer el futuro). Cota superior de referencia.</td>
                </tr>
                <tr>
                  <td><strong>LRU (Least Recently Used)</strong></td>
                  <td>Expulsa la página que no ha sido utilizada durante el mayor tiempo pasado.</td>
                  <td>Aproxima a OPT mediante la hipótesis de localidad. Excelente rendimiento. No sufre anomalía de Bélády. Requiere soporte hardware (contadores o pila).</td>
                </tr>
                <tr>
                  <td><strong>Segunda Oportunidad (Reloj)</strong></td>
                  <td>Inspecciona las páginas en orden circular evaluando su bit de referencia. Si el bit es 1, le da una segunda oportunidad, lo pone a 0 y avanza; si es 0, la reemplaza.</td>
                  <td>Aproximación eficiente y práctica a LRU empleada ampliamente en sistemas operativos reales.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        title: "3. Hiperpaginación (Thrashing)",
        content: `
          <p>La <strong>hiperpaginación (thrashing)</strong> ocurre cuando un sistema pasa más tiempo paginando (esperando transferencias de disco por fallos continuos de página) que ejecutando instrucciones útiles. La utilización de la CPU cae en picado.</p>
          <p><strong>Causa:</strong> La suma de los conjuntos de trabajo de todos los procesos activos excede el número total de marcos físicos disponibles en la memoria RAM: $\sum WSS_i > \text{Marcos\_totales}$.</p>
          <p><strong>Solución:</strong> El modelo de <strong>Conjunto de Trabajo (Working-Set Model de Peter Denning)</strong> monitoriza las páginas referenciadas en una ventana de tiempo $\Delta$ para asegurar que cada proceso disponga de sus páginas activas antes de permitirle competir por la CPU.</p>
        `
      }
    ],
    examNotes: "Pregunta estrella de examen ULL: Demostrar la Anomalía de Bélády con el algoritmo FIFO usando la secuencia clásica: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 pasando de 3 a 4 marcos (los fallos pasan de 9 a 10).",
    codeSnippet: `// Simulación del algoritmo del Reloj (Segunda Oportunidad) en C
int seleccionar_victima_reloj(Marco *marcos, int num_marcos, int *puntero_reloj) {
    while (1) {
        if (marcos[*puntero_reloj].bit_referencia == 0) {
            int victima = *puntero_reloj;
            *puntero_reloj = (*puntero_reloj + 1) % num_marcos;
            return victima; // Encontrada página con bit 0
        }
        // Segunda oportunidad concedida: poner a 0 y avanzar
        marcos[*puntero_reloj].bit_referencia = 0;
        *puntero_reloj = (*puntero_reloj + 1) % num_marcos;
    }
}`
  },

  18: {
    module: "MÓDULO 5: GESTIÓN DEL ALMACENAMIENTO",
    moduleNumber: 5,
    lessonNumber: 18,
    title: "Almacenamiento secundario",
    subtitle: "Estructura de discos HDD y SSD, métricas de acceso y algoritmos de planificación del cabezal",
    summary: "El almacenamiento secundario proporciona persistencia y alta capacidad no volátil. Dado que los accesos a disco son órdenes de magnitud más lentos que la RAM, la planificación del cabezal es crítica.",
    sections: [
      {
        title: "1. Discos Magnéticos (HDD) vs Estado Sólido (SSD)",
        content: `
          <div class="grid-2col">
            <div class="theory-card">
              <h4>💽 Discos Duros Magnéticos (HDD)</h4>
              <p>Constan de platos giratorios recubiertos de material magnético organizados en pistas concéntricas y cilindros, divididos en sectores de 512 bytes o 4 KB.</p>
              <p><strong>Componentes del Tiempo de Acceso:</strong></p>
              <ul>
                <li><strong>Tiempo de Búsqueda (Seek Time):</strong> Tiempo en posicionar el brazo mecánico sobre el cilindro deseado (el factor más lento y dominante, 3–9 ms).</li>
                <li><strong>Latencia Rotacional:</strong> Tiempo que tarda el sector deseado en girar hasta colocarse bajo la cabeza ($1 / (2 \times RPM)$).</li>
                <li><strong>Tiempo de Transferencia:</strong> Tiempo para transferir los datos del sector al bus.</li>
              </ul>
            </div>
            <div class="theory-card">
              <h4>⚡ Discos de Estado Sólido (SSD)</h4>
              <p>Basados en memoria flash NAND. No tienen partes mecánicas móviles; tiempo de búsqueda prácticamente nulo.</p>
              <p><strong>Características de bajo nivel:</strong></p>
              <ul>
                <li>Se lee y escribe a nivel de <strong>páginas</strong> (4 KB a 16 KB).</li>
                <li>Solo se puede borrar a nivel de <strong>bloques</strong> enteros (128 a 512 páginas).</li>
                <li>Requieren algoritmos de <strong>nivelación de desgaste (Wear Leveling)</strong> y el comando <strong>TRIM</strong> para evitar degradación de rendimiento.</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: "2. Algoritmos de Planificación de Disco",
        content: `
          <p>En discos magnéticos, el objetivo principal del planificador es <strong>minimizar la distancia total recorrida por el cabezal</strong> (número total de cilindros atravesados):</p>
          <div class="table-responsive">
            <table class="theory-table">
              <thead>
                <tr>
                  <th>Algoritmo</th>
                  <th>Criterio de Movimiento del Brazo</th>
                  <th>Ventajas y Desventajas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>FCFS</strong></td>
                  <td>Atiende las peticiones en orden estricto de llegada.</td>
                  <td>Completamente equitativo; produce movimientos caóticos y largos desplazamientos de cabeza.</td>
                </tr>
                <tr>
                  <td><strong>SSTF (Shortest Seek Time First)</strong></td>
                  <td>Selecciona la petición más cercana a la posición actual del cabezal.</td>
                  <td>Reduce significativamente el recorrido total. Puede causar <strong>inanición (starvation)</strong> de peticiones alejadas.</td>
                </tr>
                <tr>
                  <td><strong>SCAN (Algoritmo del Ascensor)</strong></td>
                  <td>El cabezal se mueve en una dirección fija atendiendo peticiones hasta llegar al <em>extremo físico</em> del disco, invierte el sentido y atiende en la dirección contraria.</td>
                  <td>Comportamiento equilibrado y predecible; sin inanición.</td>
                </tr>
                <tr>
                  <td><strong>C-SCAN (Circular SCAN)</strong></td>
                  <td>El cabezal se desplaza en una sola dirección atendiendo peticiones hasta el extremo; al llegar al final retorna inmediatamente al inicio sin atender nada en el viaje de regreso.</td>
                  <td>Ofrece un tiempo de espera más homogéneo y uniforme que SCAN.</td>
                </tr>
                <tr>
                  <td><strong>LOOK y C-LOOK</strong></td>
                  <td>Variantes de SCAN y C-SCAN donde el brazo solo viaja hasta la <em>última petición pendiente</em> en esa dirección, en lugar de continuar inútilmente hasta el extremo físico del disco.</td>
                  <td>Elimina desplazamientos innecesarios a los bordes vacíos del disco.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      }
    ],
    examNotes: "Problema fijo en exámenes ULL ESIT: Dada una cola de peticiones a cilindros (ej. 98, 183, 37, 122, 14, 124, 65, 67) con cabeza inicial en 53, calcular el número total de cilindros recorridos para FCFS, SSTF, SCAN y C-LOOK.",
    codeSnippet: `// Cálculo del recorrido total para FCFS en C
int calcular_recorrido_fcfs(int *peticiones, int n, int cabeza_inicial) {
    int recorrido_total = 0;
    int pos_actual = cabeza_inicial;
    for (int i = 0; i < n; i++) {
        recorrido_total += abs(peticiones[i] - pos_actual);
        pos_actual = peticiones[i];
    }
    return recorrido_total;
}`
  },

  19: {
    module: "MÓDULO 5: GESTIÓN DEL ALMACENAMIENTO",
    moduleNumber: 5,
    lessonNumber: 19,
    title: "Sistemas de archivos",
    subtitle: "Concepto de archivo, directorios, métodos de acceso y métodos de asignación de espacio",
    summary: "El sistema de archivos proporciona una abstracción lógica estructurada para el almacenamiento masivo permanente, gestionando la jerarquía de directorios y la asignación física de bloques en disco.",
    sections: [
      {
        title: "1. Concepto y Atributos de Archivo",
        content: `
          <p>Un <strong>archivo</strong> es una colección de información relacionada con nombre, almacenada de forma persistente en almacenamiento secundario. Para el SO, a nivel abstracto es simplemente una secuencia contigua de bytes lógicos.</p>
          <div class="theory-card">
            <h4>📋 Atributos Clave de un Archivo:</h4>
            <ul>
              <li><strong>Nombre:</strong> Identificador simbólico legible por humanos.</li>
              <li><strong>Identificador:</strong> Número entero único del archivo en el sistema de ficheros (número de inodo).</li>
              <li><strong>Tipo:</strong> Extensión o número mágico que define el formato.</li>
              <li><strong>Ubicación:</strong> Punteros a los bloques físicos en el dispositivo.</li>
              <li><strong>Tamaño:</strong> Tamaño actual en bytes y bloques asignados.</li>
              <li><strong>Protección y Permisos:</strong> Control de acceso (lectura/escritura/ejecución por usuario/grupo/otros).</li>
              <li><strong>Marcas de tiempo:</strong> Fechas de creación, última modificación y último acceso.</li>
            </ul>
          </div>
        `
      },
      {
        title: "2. Estructura de Directorios y Enlaces",
        content: `
          <p>Los sistemas modernos utilizan una <strong>estructura de árbol jerárquica</strong>:</p>
          <ul>
            <li><strong>Ruta Absoluta:</strong> Comienza desde la raíz del sistema de archivos (ej. <code>/home/usuario/ssoo/apuntes.txt</code>).</li>
            <li><strong>Ruta Relativa:</strong> Se interpreta con respecto al directorio de trabajo actual (ej. <code>./apuntes.txt</code>).</li>
            <li><strong>Enlaces Duros (Hard Links):</strong> Múltiples entradas de directorio que apuntan al <em>mismo número de inodo</em>. Comparten bloques físicos y permisos; el archivo solo se borra físicamente cuando el contador de enlaces llega a 0.</li>
            <li><strong>Enlaces Simbólicos (Soft / Symlinks):</strong> Archivos especiales cuyo contenido es simplemente la ruta textual hacia otro archivo. Si el archivo destino se elimina, el symlink queda roto.</li>
          </ul>
        `
      },
      {
        title: "3. Métodos de Asignación de Bloques en Disco",
        content: `
          <div class="table-responsive">
            <table class="theory-table">
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Estructura</th>
                  <th>Ventajas</th>
                  <th>Desventajas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Asignación Contigua</strong></td>
                  <td>Cada archivo ocupa un conjunto de bloques consecutivos en disco. Entrada de directorio: [Bloque inicial, Longitud].</td>
                  <td>Acceso secuencial y acceso directo sumamente rápidos. Rendimiento excelente.</td>
                  <td>Sufre de grave <strong>fragmentación externa</strong>. Requiere conocer el tamaño del archivo con antelación o reubicarlo si crece.</td>
                </tr>
                <tr>
                  <td><strong>Asignación Enlazada (Linked)</strong></td>
                  <td>Cada archivo es una lista enlazada de bloques de disco dispersos. Cada bloque contiene un puntero al siguiente bloque.</td>
                  <td>Sin fragmentación externa. Los archivos pueden crecer libremente mientras haya bloques libres.</td>
                  <td>Acceso directo / aleatorio muy lento (debe recorrer secuencialmente todos los punteros anteriores). Riesgo si se corrompe un puntero.</td>
                </tr>
                <tr>
                  <td><strong>Tabla de Asignación de Archivos (FAT)</strong></td>
                  <td>Variante de la enlazada donde todos los punteros se extraen de los bloques de datos y se agrupan en una tabla en memoria (FAT).</td>
                  <td>Acelera el acceso directo respecto a la enlazada clásica ya que la búsqueda de bloques se hace en RAM sobre la tabla FAT.</td>
                  <td>La tabla FAT debe residir en memoria RAM; puede ser voluminosa en discos de gran capacidad.</td>
                </tr>
                <tr>
                  <td><strong>Asignación Indexada</strong></td>
                  <td>Cada archivo tiene un <strong>Bloque Índice</strong> que almacena un arreglo con los punteros a todos sus bloques de datos.</td>
                  <td>Soporta acceso directo rápido sin fragmentación externa.</td>
                  <td>Sobrecarga de espacio por el bloque índice en archivos muy pequeños. Para archivos muy grandes requiere índices multinivel.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      }
    ],
    examNotes: "Pregunta clásica: ¿Cómo implementa el sistema de ficheros de UNIX (ext2/3/4) la asignación indexada? Mediante una estructura combinada en el inodo que incluye punteros directos, indirecto simple, indirecto doble e indirecto triple.",
    codeSnippet: `// Entrada clásica de un directorio tipo UNIX
struct dirent {
    ino_t d_ino;             // Número de inodo (identificador único)
    char  d_name[256];       // Nombre simbólico del archivo
};`
  },

  20: {
    module: "MÓDULO 5: GESTIÓN DEL ALMACENAMIENTO",
    moduleNumber: 5,
    lessonNumber: 20,
    title: "Implementación de sistemas de archivos",
    subtitle: "Inodos, estructuras en memoria y en disco, gestión de espacio libre y Journaling",
    summary: "Estructuras de datos concretas para materializar un sistema de archivos: desde el bloque de arranque y superbloque hasta la arquitectura del Inodo UNIX, la caché de búferes y la consistencia con diario.",
    sections: [
      {
        title: "1. Estructuras en Disco y en Memoria",
        content: `
          <div class="grid-2col">
            <div class="theory-card">
              <h4>💾 Estructuras en Disco</h4>
              <ul>
                <li><strong>Bloque de arranque (Boot Block):</strong> Código inicial para arrancar el SO.</li>
                <li><strong>Superbloque (Superblock):</strong> Metadatos globales del sistema de archivos (número de bloques, tamaño, inodos libres, bloques libres).</li>
                <li><strong>Tabla de Inodos:</strong> Array con los descriptores de todos los archivos.</li>
                <li><strong>Bloques de Datos:</strong> Bloques que contienen los datos reales y directorios.</li>
              </ul>
            </div>
            <div class="theory-card">
              <h4>🧠 Estructuras en Memoria Principal</h4>
              <ul>
                <li><strong>Tabla de montajes:</strong> Información de particiones montadas.</li>
                <li><strong>Caché de directorios:</strong> Acelera la resolución de nombres a inodos.</li>
                <li><strong>Tabla global de archivos abiertos:</strong> Contiene una copia del inodo de cada archivo abierto y un contador de referencias.</li>
                <li><strong>Tabla de archivos abiertos por proceso:</strong> Asocia los descriptores de fichero (fd 0, 1, 2...) con la tabla global y el puntero de lectura/escritura (offset).</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: "2. La Arquitectura del Inodo UNIX",
        content: `
          <p>El <strong>Inodo (Index Node)</strong> contiene toda la información de un archivo excepto su nombre:</p>
          <div class="theory-card">
            <h4>Estructura de Punteros de un Inodo Típico (15 Punteros):</h4>
            <ul>
              <li><strong>12 Punteros Directos:</strong> Apuntan directamente a los primeros 12 bloques de datos (acceso ultrarrápido para archivos pequeños).</li>
              <li><strong>1 Puntero Indirecto Simple:</strong> Apunta a un bloque índice que contiene punteros directos a bloques de datos.</li>
              <li><strong>1 Puntero Indirecto Doble:</strong> Apunta a un bloque que contiene punteros a bloques indirectos simples.</li>
              <li><strong>1 Puntero Indirecto Triple:</strong> Permite direccionar archivos masivos de varios Terabytes.</li>
            </ul>
          </div>
        `
      },
      {
        title: "3. Gestión del Espacio Libre",
        content: `
          <ul>
            <li><strong>Vector de Bits / Mapa de Bits (Bitmap):</strong> Un array donde cada bit representa un bloque de disco (0 = ocupado, 1 = libre). Extremadamente rápido y sencillo de manipular mediante instrucciones de búsqueda de bits a nivel de CPU.</li>
            <li><strong>Lista Enlazada de Bloques Libres:</strong> Cada bloque libre contiene un puntero al siguiente bloque libre. No consume memoria RAM, pero es lenta de recorrer.</li>
            <li><strong>Agrupamiento y Recuento:</strong> Almacena bloques contiguos libres en bloques índices o registra [primer_bloque, cantidad_bloques_contiguos].</li>
          </ul>
        `
      },
      {
        title: "4. Consistencia y Sistemas de Archivos con Diario (Journaling)",
        content: `
          <p>Un corte de energía durante una escritura en disco puede dejar el sistema de archivos en un estado inconsistente (ej. bloque marcado como asignado en el inodo pero no retirado del mapa de bits libres).</p>
          <div class="callout callout-important">
            <span class="callout-icon">🛡️</span>
            <div>
              <strong>Journaling (ext3, ext4, NTFS):</strong>
              Antes de modificar la estructura de datos real en el disco, todas las modificaciones se escriben secuencialmente en un área circular especial llamada <strong>diario (journal o log)</strong> y se confirman (commit).
              Si se produce un fallo eléctrico, al reiniciar el sistema operativo no necesita escanear todo el disco con <code>fsck</code> (lo cual tardaría horas), sino que simplemente reproduce o descarta las transacciones pendientes del diario en cuestión de segundos.
            </div>
          </div>
        `
      }
    ],
    examNotes: "Cálculo matemático habitual ULL: Dado un tamaño de bloque de 4 KB y punteros de bloque de 4 bytes (1024 punteros por bloque índice), calcular el tamaño máximo de un archivo direccionable por un inodo con 12 punteros directos, 1 indirecto simple, 1 indirecto doble y 1 indirecto triple.",
    codeSnippet: `// Representación simplificada del Inodo UNIX en C
struct inode {
    uint16_t i_mode;       // Permisos y tipo de fichero
    uint16_t i_uid;        // Identificador del propietario
    uint32_t i_size;       // Tamaño en bytes
    uint32_t i_atime;      // Último acceso
    uint32_t i_mtime;      // Última modificación
    uint32_t i_links_count;// Contador de enlaces duros
    uint32_t i_blocks;     // Bloques asignados de 512 bytes
    uint32_t i_block[15];  // 0-11: Directos, 12: Ind. Simple, 13: Ind. Doble, 14: Ind. Triple
};`
  }
};
