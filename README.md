# 💳 SubsCrypt - Gestión Inteligente de Suscripciones

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Plataforma completa para gestionar todas tus suscripciones digitales en un solo lugar**

[Demo](#) • [Características](#-características) • [Instalación](#-instalación) • [Tecnologías](#-tecnologías)

</div>

---

## 🤔 ¿Por qué se creó este proyecto?

Como muchos, me encontré con un problema común: **no tenía forma de ver cuánto realmente estaba gastando en plataformas digitales**. Netflix, Spotify, Adobe, servicios de cloud, gaming... todos esparcidos en diferentes servicios, bancos y plataformas de pago.

Los extractos bancarios mostraban cargos aislados, pero no me daban una **visión completa** de:
- ¿Cuánto gasto al mes en suscripciones?
- ¿Qué servicios realmente uso?
- ¿Cuándo se renovarán?
- ¿Cuáles podría cancelar para ahorrar?

En lugar de conformarme con hojas de cálculo o apps limitadas, **decidí solucionar este problema yo mismo** y construir una plataforma que:
- ✅ Centralice todas mis suscripciones
- ✅ Me muestre visualizaciones claras de mis gastos
- ✅ Me alerte de próximos pagos
- ✅ Me ayude a tomar decisiones financieras informadas

El resultado es **SubsCrypt**: una solución completa que no solo resuelve mi problema, sino que puede ayudar a cualquiera que enfrente el mismo desafío.

## 📖 Descripción

SubsCrypt es una aplicación web moderna diseñada para ayudarte a rastrear, analizar y administrar todas tus suscripciones digitales. Con soporte multi-moneda, visualizaciones interactivas y detección automática de logos, mantén el control total de tus gastos recurrentes.

## ✨ Características

### 🔐 Autenticación Dual
- **Login con credenciales** (email/contraseña con bcrypt)
- **Google OAuth** integrado
- Sesiones JWT seguras con cookies HTTP-only
- Middleware de protección de rutas

### 💰 Multi-Moneda
- Soporte para **8 monedas**: USD, CLP, EUR, GBP, MXN, ARS, BRL, COP
- Conversión automática en tiempo real
- Selector de moneda persistente en dashboard

### 📊 Dashboard Interactivo
- **Gráfico circular** de distribución por categorías (Recharts)
- **Gráfico de líneas** con tendencias de gasto (últimos 6 meses)
- Estadísticas en tiempo real: total mensual, anual, próximos pagos
- Vista por categoría con pills compactas
- Selector mensual/anual

### 🎨 Interfaz Moderna
- **Dark theme** completo y consistente
- Palette slate-950/900/800 con acentos indigo
- Tooltips con contraste mejorado
- Componentes reutilizables (Button, Input, Card, Select)
- Diseño responsive

### 🔍 Detección Automática de Logos
- **80+ servicios reconocidos** automáticamente
- Integración con simpleicons.org CDN
- Preview en tiempo real al crear/editar suscripciones
- Fallback con icono genérico

### 🗂️ Gestión Completa
- CRUD de suscripciones (Crear, Leer, Actualizar, Eliminar)
- **10+ categorías**: Streaming, Cloud, Gaming, Fitness, etc.
- Estados: Activo, Pausado, Cancelado, Prueba
- Ciclos: Mensual, Anual, Trimestral, Semanal
- Notas personalizadas
- Selector de color por suscripción

### 👤 Experiencia de Usuario
- Avatar dropdown con perfil y logout
- Navbar responsive con sidebar
- Mensajes de confirmación
- Validación con Zod en cliente y servidor
- Navegación protegida

## 🛠️ Tecnologías

### Frontend
- **Next.js 16.1.6** - App Router con Turbopack
- **React 19** - Server & Client Components
- **TypeScript 5** - Type safety completo
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Visualizaciones de datos
- **Lucide React** - Iconografía moderna

### Backend
- **Next.js API Routes** - Serverless functions
- **PostgreSQL 18** - Base de datos relacional
- **Prisma 7.3.0** - ORM con PrismaPg adapter
- **NextAuth.js v5** - Autenticación y sesiones
- **bcryptjs** - Hashing de contraseñas
- **Zod** - Validación de schemas

### DevOps & Tools
- **ESLint** - Linting
- **PostCSS** - CSS processing
- **Git** - Control de versiones

## 📁 Estructura del Proyecto

```
SubsCrypt/
├── prisma/
│   └── schema.prisma          # Modelos de base de datos
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Rutas protegidas
│   │   │   ├── dashboard/     # Dashboard principal
│   │   │   ├── subscriptions/ # CRUD suscripciones
│   │   │   └── settings/      # Configuración de usuario
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Endpoints de autenticación
│   │   │   ├── dashboard/     # Stats y trends
│   │   │   └── subscriptions/ # CRUD API
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de registro
│   │   ├── layout.tsx         # Layout raíz
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── layout/            # Navbar, Sidebar
│   │   ├── ui/                # Button, Input, Card, Select
│   │   └── providers.tsx      # SessionProvider
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helpers
│   │   └── validators/        # Zod schemas
│   ├── types/
│   │   └── next-auth.d.ts     # Type extensions
│   └── middleware.ts          # Route protection
├── .env                       # Variables de entorno
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencias

```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ y npm/pnpm/yarn
- PostgreSQL 14+ instalado y ejecutándose
- Cuenta de Google Cloud (para OAuth)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Edgardosilva/SubsCrypt.git
cd SubsCrypt
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/subscrypt?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-generado-con-openssl"  # Genera con: openssl rand -base64 32

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
```

4. **Configurar Google OAuth** (Opcional)

Si deseas usar login con Google:
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Crea un nuevo proyecto
- Habilita Google+ API
- Crea credenciales OAuth 2.0
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

5. **Generar el cliente Prisma**
```bash
npx prisma generate
```

6. **Ejecutar migraciones**
```bash
npx prisma migrate dev --name init
```

7. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

8. **Abrir en el navegador**

Visita [http://localhost:3000](http://localhost:3000)

## 📊 Esquema de Base de Datos

```prisma
User {
  id, name, email, password, image
  subscriptions[]
}

Subscription {
  id, userId, name, description, price, 
  currency, category, cycle, status, 
  color, logoUrl, nextBillingDate, notes
}

Account, Session, VerificationToken (NextAuth)
```

## 📜 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (Turbopack)
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Ejecutar ESLint
npx prisma studio    # Abrir Prisma Studio (GUI de DB)
npx prisma migrate   # Crear nueva migración
npx prisma db push   # Sincronizar schema sin migración
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con **bcrypt** (salt rounds: 10)
- ✅ JWT tokens con firma HMAC-SHA256
- ✅ Cookies HTTP-only (no accesibles desde JS)
- ✅ CSRF protection automático (NextAuth)
- ✅ Validación de inputs con Zod (cliente + servidor)
- ✅ SQL injection protection (Prisma ORM)
- ✅ Middleware de autenticación en todas las rutas protegidas

## 🚀 Despliegue a Producción

### Vercel (Recomendado)

1. **Push a GitHub**
```bash
git push origin main
```

2. **Importar en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa el repositorio
   - Configura variables de entorno

3. **Base de datos**
   - Usa [Supabase](https://supabase.com) (PostgreSQL gratis)
   - O [Neon](https://neon.tech) (serverless PostgreSQL)
   - Actualiza `DATABASE_URL` en Vercel

4. **Ejecutar migraciones**
```bash
npx prisma migrate deploy
```

### Variables de Entorno Necesarias en Producción

```
DATABASE_URL
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID (opcional)
GOOGLE_CLIENT_SECRET (opcional)
```

## 🎯 Roadmap Futuro

- [ ] Sistema de presupuestos por categoría
- [ ] Notificaciones por email (Resend/Nodemailer)
- [ ] Exportar datos (CSV/PDF)
- [ ] Proyección de gastos futuros
- [ ] Calendario visual de pagos
- [ ] Tests (Jest + React Testing Library)
- [ ] Webhooks para recordatorios
- [ ] Análisis de ahorro potencial
- [ ] Suscripciones compartidas con división de costos
- [ ] App móvil (React Native)

## 🤝 Contribuir

Este es un proyecto personal de portafolio, pero las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: Nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - siéntete libre de usar este proyecto como referencia.

## 👤 Autor

**Edgardo Silva**
- GitHub: [@Edgardosilva](https://github.com/Edgardosilva)
- LinkedIn: [Edgardo Silva](https://www.linkedin.com/in/edgardo-silva/)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

Construido con 💙 usando Next.js 16 y TypeScript

</div>
