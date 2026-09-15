# 🛒 GestorMarket

**"Simplifica la caja, el stock y la vida"**

GestorMarket es una solución tecnológica integral en formato de plataforma web, diseñada específicamente para optimizar la gestión diaria de supermercados y comercios de tamaño pequeño o mediano.

## 📄 Documentación del Proyecto

Para conocer en profundidad la propuesta, funcionalidades, diseño e implementación de GestorMarket, podés acceder al informe oficial del sistema:

📃 [Ver informe completo del proyecto]

## ✨ Funcionalidades Principales

- **Control de Stock Inteligente**: Alertas automáticas por faltantes o productos próximos a vencer.
- **Punto de Venta (POS)**: Registro de ventas en tiempo real de manera ágil.
- **Gestión de Productos**: Administración de categorías, precios y proveedores.
- **Reportes y Estadísticas**: Informes exportables a PDF sobre ingresos y egresos.

## 🧰 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| React 19 | Interfaz de usuario |
| TypeScript | Lenguaje principal |
| Vite 6 | Bundler y servidor de desarrollo |
| Google Gemini API | Inteligencia artificial integrada |

## ⚙️ Instalación y Uso

### 🔧 Requisitos previos

Antes de comenzar, asegurate de tener instalado lo siguiente en tu computadora:

- **Node.js v18 o superior** → [Descargalo desde nodejs.org](https://nodejs.org)
  - Para verificar si ya lo tenés: `node -v`
- **npm** (viene incluido con Node.js)
  - Para verificar: `npm -v`
- **Git** → [Descargalo desde git-scm.com](https://git-scm.com)
  - Para verificar: `git --version`
- **Una API Key de Google Gemini (gratuita)** → [Obtené la tuya en aistudio.google.com](https://aistudio.google.com)

### 📥 Pasos de instalación

#### 1. Clonar el repositorio

Abrí una terminal y ejecutá:

```bash
git clone https://github.com/maxiamoros/RotiApp.git
```

#### 2. Entrar a la carpeta del proyecto

```bash
cd RotiApp
```

#### 3. Instalar las dependencias

Este comando descarga todas las librerías necesarias automáticamente:

```bash
npm install
```

#### 4. Configurar las variables de entorno

Creá un archivo llamado `.env` en la raíz del proyecto (en la misma carpeta donde está el `package.json`) con el siguiente contenido:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

⚠️ **Importante**: Reemplazá `tu_api_key_aqui` con tu clave real de Google Gemini.
Este archivo no se sube a GitHub por seguridad (está incluido en el `.gitignore`).

#### 5. Iniciar la aplicación

```bash
npm run dev
```

#### 6. Abrir en el navegador

Una vez iniciado, abrí tu navegador y visitá:

```
http://localhost:3000
```

¡Listo! La aplicación debería estar corriendo correctamente. 🎉

## 📦 Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión optimizada para producción (carpeta `dist/`) |
| `npm run preview` | Previsualiza localmente la versión de producción |

## 🗂️ Estructura del Proyecto

```
RotiApp/
├── components/          # Componentes reutilizables de la interfaz
├── context/             # Manejo global del estado (Context API)
├── services/            # Lógica de negocio y comunicación con APIs
├── App.tsx              # Componente principal de la aplicación
├── index.tsx            # Punto de entrada de la app
├── types.ts             # Tipos TypeScript compartidos
├── index.html           # HTML base
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # Configuración de TypeScript
├── package.json         # Dependencias y scripts
└── .env                 # Variables de entorno (crear manualmente, NO subir a GitHub)
```

## ❓ Problemas comunes

### La app no abre en el navegador

- Verificá que el comando `npm run dev` haya terminado sin errores.
- Asegurate de entrar a `http://localhost:3000` y no a otro puerto.

### Error relacionado con la API Key

- Verificá que el archivo `.env` exista en la raíz del proyecto.
- Asegurate de que la clave esté correctamente copiada sin espacios extra.
- Comprobá que tu API Key de Gemini esté activa en [aistudio.google.com](https://aistudio.google.com).

### Error al ejecutar `npm install`

- Verificá tu versión de Node.js con `node -v` (debe ser v18 o superior).
- Si el error persiste, intentá eliminar la carpeta `node_modules` y el archivo `package-lock.json`, y volvé a ejecutar `npm install`.

---

**Hecho con ❤️ por el equipo de GestorMarket**
