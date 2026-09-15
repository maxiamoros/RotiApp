# 🍗 RotiApp

**"Simplifica tu rotisería, optimiza tu negocio"**

RotiApp es una solución tecnológica integral diseñada específicamente para optimizar la gestión diaria de rotiserías y pizzerías de tamaño pequeño o mediano. Centraliza la recepción de pedidos, la gestión de inventario, la preparación en cocina y la comunicación con el cliente, optimizando tiempos de respuesta y reduciendo errores.

## 📋 Acerca del Proyecto

**RotiApp** es un trabajo práctico desarrollado como caso de estudio en la **Tecnicatura Superior en Desarrollo de Software** del **I.E.S. 9-012 Instituto de Educación Superior San Rafael en Informática**.

- **Carrera:** Tecnicatura Superior en Desarrollo de Software / Análisis y Modelado de Software y Prácticas Profesionalizantes II
- **Integrantes:** Amoros, Andreoni, Vargas, Ramos y Torres
- **Profesores:** Ricardo Arroyo y Adrián Martínez
- **Fecha de Inicio:** 18/08/2026
- **Institución:** I.E.S. 9-012

## 🎯 Objetivo General

Diseñar e implementar una solución informática integral, modular y parametrizable para la gestión operativa y comercial de rotiserías. El sistema centraliza la recepción de pedidos, la gestión de inventario, la preparación en cocina y la comunicación con el cliente, optimizando significativamente los tiempos de respuesta y reduciendo el margen de error humano.

## ✨ Funcionalidades Principales

### Para el Vendedor / Cajero
- 📝 **Registro de Pedidos:** Toma de pedidos especificando productos, cantidades y observaciones
- 👥 **Gestión de Clientes:** Registro de datos básicos y consulta de histórico
- 🛵 **Modalidades de Entrega:** Presencial, retiro en local o delivery
- 💳 **Registro de Pagos:** Manejo de múltiples medios de pago (efectivo, transferencia, débito/crédito)
- 📊 **Consulta de Estado:** Visualización en tiempo real del estado de cada pedido

### Para el Cocinero / Personal de Cocina
- 🍳 **Tablero de Cocina:** Visualización de pedidos pendientes con prioridad
- ⏱️ **Control de Estados:** Actualización de estado (En preparación → Listo → Entregado)
- 📋 **Detalles del Pedido:** Visualización de productos, cantidades y observaciones especiales
- ⚠️ **Alertas de Insumos:** Notificaciones de faltantes durante la preparación

### Para el Gerente / Administrador
- 📦 **Gestión de Productos:** Agregar, modificar, desactivar y actualizar precios
- 🏷️ **Gestión de Categorías:** Clasificación y organización de productos
- 👤 **Gestión de Usuarios:** Creación de cuentas y asignación de roles/permisos
- 📊 **Reportes y Estadísticas:** Análisis de ventas, rotación de productos y decisiones estratégicas
- 🤖 **Módulo de IA:** Recomendaciones de producción, alertas de stock y sugerencias de promociones

### Para el Cliente
- 🛒 **Realización de Pedidos:** Interfaz web intuitiva
- 👁️ **Seguimiento en Tiempo Real:** Consulta del estado de su pedido
- 📞 **Comunicación Directa:** Obtención de horarios de entrega y atención personalizada

## 🧠 Módulo de Inteligencia Artificial

El módulo de IA actúa como asistente predictivo y operativo que apoya la toma de decisiones del Gerente y Personal de Cocina.

### Funcionalidades del Módulo IA:

1. **Predicción de Demanda:** Analiza históricos de ventas (días de la semana, clima, fechas especiales) para recomendar cantidades de producción previa

2. **Estimación Dinámica de Tiempos:** Calcula el tiempo estimado de preparación y entrega evaluando la carga actual de trabajo en cocina

3. **Alertas Preventivas de Stock:** Detecta patrones de consumo e informa necesidad de reponer antes de quiebres de inventario

4. **Recomendador de Promociones:** Sugiere combos y promociones basadas en baja rotación e insumos próximos a vencer

## 🧰 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** | Interfaz de usuario moderna y componentes reutilizables |
| **TypeScript** | Lenguaje principal con tipado fuerte |
| **Vite 6** | Bundler y servidor de desarrollo ultrarrápido |
| **Google Gemini API** | Motor de Inteligencia Artificial integrado |
| **Base de Datos Relacional** | Persistencia e integridad de transacciones |

## 👥 Actores y Roles del Sistema

### Gerente / Administrador
- Gestión general del negocio y sistema
- Supervisión de pedidos y operaciones
- Análisis de reportes e información estratégica

### Vendedor / Cajero
- Atención al cliente
- Registro de pedidos y pagos
- Consulta de estado de pedidos

### Cocinero
- Visualización de pedidos pendientes
- Actualización de estado de preparación
- Reporte de insumos faltantes

### Cliente
- Realización de pedidos
- Consulta de estado
- Recepción del pedido

### Otros Actores
- **Proveedor:** Abastecimiento de insumos
- **Contador:** Consulta de información económica y reportes
- **Repartidor/Cadete:** Entregas a domicilio

## 📋 Requerimientos Funcionales Principales

| Código | Requerimiento | Prioridad |
|---|---|---|
| RF01 | Registrar Cliente | Obligatorio |
| RF02 | Venta Ocasional | Obligatorio |
| RF03 | Gestionar Productos | Obligatorio |
| RF04 | Registrar Pedido | Obligatorio |
| RF05 | Consultar Estado de Pedidos | Obligatorio |
| RF06 | Control de Cocina | Obligatorio |
| RF07 | Gestión de Usuarios | Obligatorio |
| RF08 | Gestión de Categorías | Secundario |
| RF09 | Gestión de Precios | Obligatorio |
| RF10 | Registro de Pagos | Obligatorio |
| RF11 | Consulta de Historial | Secundario |
| RF12 | Cancelación de Pedidos | Obligatorio |
| RF13 | Gestión de Insumos | Obligatorio |
| RF14 | Generación de Reportes | Secundario |
| RF15 | Autenticar Usuario | Obligatorio |
| RF16 | Verificación de Stock | Obligatorio |

## ⚙️ Requerimientos No Funcionales

| Código | Requerimiento | Descripción |
|---|---|---|
| **RNF01** | Usabilidad | Interfaz táctil, amigable e intuitiva. Registrar un pedido en menos de 3 pasos/clics |
| **RNF02** | Disponibilidad | Uptime mínimo del 99,5% durante horarios comerciales |
| **RNF03** | Tiempo de Respuesta | Sincronización de datos entre atención y cocina en menos de 2 segundos |
| **RNF04** | Seguridad y Roles | Autenticación con control de acceso por roles (Admin, Vendedor, Cocinero) |
| **RNF05** | Portabilidad | Acceso web adaptativo (responsive) para desktop, notebooks y tablets |
| **RNF06** | Persistencia | Almacenamiento en base de datos relacional con garantía de integridad de datos |

## 🚀 Instalación y Uso

### 🔧 Requisitos Previos

Antes de comenzar, asegurate de tener instalado:

- **Node.js v18 o superior** → [Descargar desde nodejs.org](https://nodejs.org)
  - Para verificar: `node -v`
- **npm** (incluido con Node.js)
  - Para verificar: `npm -v`
- **Git** → [Descargar desde git-scm.com](https://git-scm.com)
  - Para verificar: `git --version`
- **API Key de Google Gemini (gratuita)** → [Obtener en aistudio.google.com](https://aistudio.google.com)

### 📥 Pasos de Instalación

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/maxiamoros/RotiApp.git
cd RotiApp
```

#### 2. Instalar Dependencias

```bash
npm install
```

#### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

⚠️ **Importante:** 
- Reemplaza `tu_api_key_aqui` con tu clave real de Google Gemini
- Este archivo NO se sube a GitHub (está en `.gitignore` por seguridad)

#### 4. Iniciar la Aplicación

```bash
npm run dev
```

#### 5. Acceder en el Navegador

Abre tu navegador y accede a:

```
http://localhost:3000
```

¡Listo! La aplicación debería estar corriendo. 🎉

## 📦 Comandos Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo con recarga automática |
| `npm run build` | Genera versión optimizada para producción (carpeta `dist/`) |
| `npm run preview` | Previsualiza localmente la versión de producción |

## 🗂️ Estructura del Proyecto

```
RotiApp/
├── components/          # Componentes reutilizables de la interfaz
│   ├── PedidoForm/      # Formulario de registro de pedidos
│   ├── CocinaBoard/     # Tablero de control para cocina
│   ├── ProductManager/  # Gestión de productos
│   └── ...
├── context/             # Manejo global del estado (Context API)
│   ├── AuthContext.tsx
│   ├── PedidosContext.tsx
│   └── ...
├── services/            # Lógica de negocio y APIs
│   ├── pedidosService.ts
│   ├── productosService.ts
│   ├── geminiService.ts # Integración con IA
│   └── ...
├── types.ts             # Tipos TypeScript compartidos
├── App.tsx              # Componente principal
├── index.tsx            # Punto de entrada
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # Configuración de TypeScript
├── package.json         # Dependencias y scripts
├── .env                 # Variables de entorno (NO subir a GitHub)
└── README.md            # Este archivo
```

## 📊 Casos de Uso Principales

### CU01: Registrar Pedido

**Actores:** Vendedor, Cliente  
**Propósito:** Registrar un nuevo pedido especificando productos, cantidades, modalidad de entrega y medio de pago

**Flujo Principal:**
1. Vendedor selecciona "Nuevo Pedido"
2. Identifica al cliente o selecciona "Venta Ocasional"
3. Agrega productos y cantidades
4. Especifica observaciones (ej. "sin cebolla")
5. Selecciona modalidad: Presencial, Retiro o Delivery
6. Si es Delivery, ingresa domicilio y calcula envío
7. Indica si es inmediato o programado
8. Sistema calcula total
9. Registra forma de pago (efectivo, transferencia, débito/crédito)
10. Confirma y genera comprobante
11. Envía comanda a tablero de cocina

### CU02: Actualizar Estado de Pedido

**Actores:** Cocinero, Vendedor, Repartidor  
**Propósito:** Registrar el avance del ciclo de vida del pedido

**Estados Posibles:**
- Registrado
- En preparación
- Listo para entregar/retirar
- En entrega
- Entregado/Retirado
- Cancelado

## ❓ Problemas Comunes y Soluciones

### La app no abre en el navegador
- Verificá que `npm run dev` haya terminado sin errores
- Accede a `http://localhost:3000` (no otro puerto)

### Error relacionado con la API Key
- Verificá que el archivo `.env` exista en la raíz del proyecto
- Asegurate de que la clave esté copiada correctamente sin espacios extra
- Comprobá que tu API Key de Gemini esté activa en [aistudio.google.com](https://aistudio.google.com)

### Error al ejecutar `npm install`
- Verificá tu versión de Node.js: `node -v` (debe ser v18 o superior)
- Si persiste el error, ejecutá:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Producto sin stock
- El sistema advierte sobre disponibilidad
- Se ofrece una alternativa o se cancela el ítem
- Se actualiza automáticamente en el tablero de cocina

### Domicilio fuera de cobertura
- El sistema notifica sobre el área de cobertura
- Se ofrece opción de retiro en el local

## 🎯 Alcance del Proyecto

### ✅ Dentro del Alcance
- Registro y trazabilidad de pedidos multicanal
- Monitoreo de estados de producción y entregas
- Gestión de inventario básico (descuento por venta)
- Motor de Inteligencia Artificial Asistencial
- Control de cocina y actualización de estados
- Gestión de usuarios y permisos

### 🔄 Fases Futuras (Fuera del Alcance Actual)
- Liquidación automática de sueldos y cargas sociales
- Integración contable/fiscal directa con AFIP
- Seguimiento por GPS en tiempo real de repartidores
- Cobro automatizado mediante pasarelas internacionales

## 🏗️ Arquitectura

RotiApp está diseñado bajo una arquitectura **multi-tenancy** parametrizable, permitiendo que cualquier rotisería configure:
- Horarios de atención
- Productos y familias de menú
- Lista de precios
- Áreas de cobertura con costos de delivery
- Usuarios con diferentes permisos
- Medios de pago disponibles

## 📅 Cronograma de Desarrollo

| Sprint | Actividad | Responsable |
|---|---|---|
| S1 | Análisis de problemática y actores | Joaco |
| S2 | Requerimientos funcionales y no funcionales | Joaco |
| S3 | Propuesta mejoradora + módulo de IA | Jere |
| S4 | Casos de Uso + Diagrama UML | Jere |
| S5 | Modelo conceptual + Diagrama de Clases | Juli |
| S6 | DFD Nivel 0 | Juli |
| S7 | Diagrama de Actividades + proceso de negocio | Valen |
| S8 | Integración, revisión, pruebas y entrega | Valen |
| S9 | Implementación del sistema | Maxi |
| S10 | Pruebas y correcciones de funcionamiento | Maxi |

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Documentación

Para acceder a la documentación completa del proyecto con análisis detallado, diagramas UML, casos de uso y especificaciones técnicas, consultá el informe oficial del proyecto.

## 📞 Soporte

¿Preguntas o sugerencias? 

- Abrí un [issue en GitHub](https://github.com/maxiamoros/RotiApp/issues)
- Contactá al equipo de desarrollo

## 📜 Licencia

Este proyecto es un trabajo académico. Consultá con el equipo de desarrollo sobre los términos de uso.

---

**Desarrollado con ❤️ por el equipo de RotiApp**

*Tecnicatura Superior en Desarrollo de Software - I.E.S. 9-012*

**Integrantes:** Amoros, Andreoni, Vargas, Ramos y Torres  
**Supervisores:** Ricardo Arroyo y Adrián Martínez
