# Plataforma Web Educativa e Interactiva: Sistemas Operativos (ULL ESIT)

Aplicación web educativa, técnica e interactiva desarrollada con **HTML5 semántico, CSS3 moderno en modo oscuro técnico y JavaScript vanilla puro** (sin frameworks ni dependencias externas), basada **ESTRICTAMENTE** en el temario, definiciones formales y algoritmos de los apuntes oficiales de **Sistemas Operativos de la Escuela Superior de Ingeniería y Tecnología (ESIT) de la Universidad de La Laguna (ULL)** ([ull-esit-sistemas-operativos.github.io/ssoo-apuntes/](https://ull-esit-sistemas-operativos.github.io/ssoo-apuntes/)).

---

## 🚀 Cómo Iniciar la Aplicación

No requiere instalación de librerías ni dependencias (ni `npm`, ni `node`, ni compiladores):
1. Haz doble clic en el archivo `index.html` o ábrelo en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari, Opera).
2. O bien, si prefieres servirlo mediante un servidor web local:
   ```bash
   # Con Python (si está disponible)
   python -m http.server 8080
   # O con cualquier servidor estático
   ```
3. Accede a `http://localhost:8080` (o directamente con `file:///.../index.html`).

---

## 📂 Estructura del Proyecto

```
SO/
├── index.html          # Estructura principal, barra de navegación con 5 módulos y 20 lecciones
├── styles.css          # Sistema de diseño en modo oscuro técnico (#0f172a, #1e293b, #334155, #3b82f6, #10b981, #ef4444)
├── js/
│   ├── theory-data.js  # Base de conocimiento teórica completa y fiel a los apuntes de la ULL ESIT
│   ├── simulators.js   # 20 motores de simulación interactiva con controles, visualización gráfica, tablas de estado y KPIs
│   └── app.js          # Controlador de la aplicación, acordeón del menú lateral, router de lecciones y buscador
└── README.md           # Documentación pedagógica y manual de uso
```

---

## 📚 Temario y Módulos Implementados

### MÓDULO 1: INTRODUCCIÓN
1. **Definiciones:** Concepto de SO como intermediario, asignador de recursos (*Resource Allocator*), programa de control (*Control Program*), visiones del usuario y del sistema, y definición formal del núcleo (*Kernel*).
   - *Simulador:* Asignador de recursos y control de accesos abusivos (cores, RAM, canales E/S).
2. **Tipos de sistemas:** Evolución operativa: sistemas por lotes (*Batch*), multiprogramación, tiempo compartido (*Time-sharing*) y sistemas de tiempo real (*Hard* vs *Soft*).
   - *Simulador:* Comparador en paralelo del aprovechamiento de CPU y latencia entre los 4 tipos de sistemas.
3. **Historia (Extra):** Las cinco generaciones de la computación (tubos de vacío, transistores, circuitos integrados, microprocesadores, cloud y móviles) y el nacimiento de UNIX en 1969 en lenguaje C.
   - *Simulador:* Banco de pruebas con ejecución de un benchmark de cálculo a través de las 5 generaciones.

### MÓDULO 2: ORGANIZACIÓN
4. **Componentes:** Gestor de procesos, gestor de memoria principal, gestor de E/S, gestor de almacenamiento y archivos, sistema de protección y seguridad, e intérprete de comandos.
   - *Simulador:* Flujo de interacción animado entre componentes ante llamadas de usuario y violaciones de seguridad.
5. **Servicios:** Servicios orientados al usuario (ejecución, E/S, ficheros, comunicaciones, errores) y servicios para la eficiencia del sistema (asignación, contabilidad y protección).
   - *Simulador:* Auditor y despachador de peticiones con métricas de latencia y control de accesos.
6. **Interfaz de programación:** Llamadas al sistema (*System Calls*), modo dual de operación de la CPU (Modo Usuario bit=1 vs Modo Núcleo bit=0), mecanismos de paso de parámetros y APIs POSIX vs Win32.
   - *Simulador:* Trazador paso a paso del ciclo de una syscall, con registros x86-64 y cambio de anillo Ring 3 ➔ Ring 0.
7. **Operación del sistema:** Secuencia de arranque (*Bootstrap*, BIOS/UEFI, MBR/GPT, GRUB, PID 1 systemd) y gestión de interrupciones hardware (IRQ, APIC, ISR) y temporizador (*Timer*).
   - *Simulador:* Secuenciador del ciclo de arranque y simulador en vivo de atención a interrupciones y ticks de reloj.
8. **Sistemas por su estructura:** Arquitectura monolítica, por capas (*THE Dijkstra*), micronúcleo (*Mach, Minix, QNX*), módulos dinámicos (*LKM*) e híbrida (*Windows NT, macOS XNU*).
   - *Simulador:* Inyección de fallos en drivers: colapso en monolítico (*Kernel Panic*) vs contención en micronúcleo.

### MÓDULO 3: GESTIÓN DE PROCESOS
9. **Procesos:** Concepto de proceso, espacio de direcciones (Texto, Datos, BSS, Heap, Stack), PCB (*Process Control Block*), diagrama de 5 estados, transiciones, `fork()`, `exec()`, `wait()`, zombies y huérfanos.
   - *Simulador:* Gestor interactivo del ciclo de vida y visualizador en tiempo real de los campos del PCB.
10. **Planificación de la CPU:** Alternancia de ráfagas CPU/IO, planificación cooperativa vs apropiativa, métricas de retorno, espera y respuesta, y algoritmos FCFS, SJF, SRTF, Round Robin y Prioridades.
    - *Simulador:* Generador de diagramas de Gantt proporcionales con métricas analíticas exactas (TME, TMR, Throughput).
11. **Paso de mensajes:** Mecanismo IPC directo e indirecto (buzones/puertos), primitivas `send`/`receive`, sincronización bloqueante/no bloqueante y búfer de capacidad cero (*Rendezvous*), acotada e ilimitada.
    - *Simulador:* Pipeline de mensajes en buzón del kernel con detección de procesos bloqueados y rendezvous.
12. **Memoria compartida:** Abstracción POSIX (`shm_open`, `ftruncate`, `mmap`, `munmap`), acceso a velocidad de RAM sin syscalls por dato y necesidad de sincronización.
    - *Simulador:* Comparador con demostración visual de **condición de carrera** al desactivar el cerrojo mutex.
13. **Hilos:** Definición de thread, recursos compartidos vs privados (TID, PC, registros, pila), modelos de correspondencia (Muchos a Uno, Uno a Uno, Muchos a Muchos) y ventajas de rendimiento.
    - *Simulador:* Ejecución en CPU multinúcleo con demostración del bloqueo global en Many-to-One ante E/S.
14. **Sincronización:** Condiciones de carrera, requisitos de la sección crítica (exclusión mutua, progreso, espera acotada), algoritmo de Peterson, semáforos de Dijkstra y problemas clásicos (Productor-Consumidor y Filósofos).
    - *Simulador:* Búfer circular con semáforos `mutex`, `empty` y `full`, y mesa redonda con prevención de interbloqueos (*deadlocks*).

### MÓDULO 4: GESTIÓN DE LA MEMORIA
15. **Memoria principal:** Vinculación de direcciones, registros base y límite de la MMU, asignación contigua en particiones fijas y variables, fragmentación interna vs externa y algoritmos First-Fit, Best-Fit y Worst-Fit.
    - *Simulador:* Barra proporcional de 1024 KB con asignación dinámica y botón de compactación de huecos libres.
16. **Paginación:** División en páginas lógicas y marcos físicos, traducción de direcciones $(p, d) \to (f, d)$, tabla de páginas, caché TLB y cálculo del Tiempo de Acceso Efectivo (*EAT*).
    - *Simulador:* Descomponedor binario de direcciones, comprobador de aciertos en TLB y cálculo físico en tiempo real.
17. **Memoria virtual:** Paginación por demanda, pasos de atención al fallo de página (*Page Fault*), algoritmos de reemplazo (FIFO, LRU, Óptimo) y la célebre **Anomalía de Bélády**.
    - *Simulador:* Matriz paso a paso de fallos y aciertos ante cadenas de referencia configurables y botón de Bélády.

### MÓDULO 5: GESTIÓN DEL ALMACENAMIENTO
18. **Almacenamiento secundario:** Discos HDD (búsqueda, latencia rotacional, transferencia), memorias flash SSD (*wear leveling*, TRIM) y algoritmos de planificación del cabezal (FCFS, SSTF, SCAN, C-SCAN, LOOK).
    - *Simulador:* Gráfico de coordenadas con la trayectoria exacta del brazo mecánico y cálculo de cilindros recorridos.
19. **Sistemas de archivos:** Concepto de archivo, metadatos, árbol de directorios, enlaces duros vs simbólicos, métodos de asignación en disco (Contigua, Enlazada, FAT e Indexada).
    - *Simulador:* Cuadrícula de disco 6x6 con visualización de bloques ocupados, enlaces FAT y coste de acceso aleatorio.
20. **Implementación de sistemas de archivos:** Estructuras en disco (superbloque, inodos) y en memoria (tablas de archivos abiertos), arquitectura del Inodo UNIX (punteros directos, indirectos simples, dobles y triples) y consistencia con *Journaling*.
    - *Simulador:* Explorador dinámico de inodo con asignación de bloques según tamaño de archivo y simulación de recuperación ante cortes eléctricos.

---

## 🎨 Especificaciones de Interfaz y Diseño

- **Fondo técnico oscuro:** `#0f172a` (Slate 900)
- **Tarjetas y paneles:** `#1e293b` (Slate 800)
- **Bordes y líneas:** `#334155` (Slate 700)
- **Acento primario:** `#3b82f6` (Azul ULL)
- **Éxito / Asignado / Acierto:** `#10b981` (Verde esmeralda)
- **Fallo / Espera / Bloqueo:** `#ef4444` (Rojo alerta)
- **Atención / Interrupciones:** `#f59e0b` (Ámbar)
- **Tipografía:** *Inter* para interfaz legible y *Fira Code* para registros, direcciones y código C.
