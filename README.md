# 💳 SubsCrypt - Gestión Inteligente de Suscripciones

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Jest](https://img.shields.io/badge/Jest-72_tests-C21325?style=for-the-badge&logo=jest)

**Plataforma full-stack para rastrear gastos en suscripciones digitales con soporte multi-moneda**

Proyecto de portafolio mostrando arquitectura moderna de Next.js 16, autenticación segura, y visualización de datos

</div>

---

## 🎯 El Problema

Estaba suscrito a muchas plataformas digitales, con el tiempo se fueron acumulando y llegó un punto en el que no sabía cuanto gastaba ni de donde se hacían los cobros, en que fecha, cuanto, etc.

Netflix en USD, Spotify en CLP, Adobe Creative Cloud, AWS, GitHub Pro... Todos cargados en diferentes tarjetas, bancos, y países. Mi app de banco mostraba cargos aislados, pero no me daban respuesta a:

- 💸 **¿Cuál es mi gasto mensual total?** (considerando diferentes monedas)
- 📅 **¿Cuándo se renovará cada servicio?** (para planificar gastos)
- 📊 **¿En qué categorías gasto más?** (streaming vs productividad)
- 💡 **¿Qué servicios podría cancelar?** (optimización de gastos)

## 🚀 La Solución Técnica

En lugar de usar hojas de cálculo o apps limitadas, **construí SubsCrypt desde cero** como un ejercicio de desarrollo full-stack, enfocándome en:

1. **Arquitectura Escalable** → Next.js 16 App Router con Server & Client Components
2. **Multi-tenancy Seguro** → Autenticación JWT + OAuth con NextAuth.js v5
3. **Conversión Multi-Moneda** → Sistema de cambio soportando 8 monedas
4. **Visualización de Datos** → Gráficos interactivos con Recharts
5. **Testing Estratégico** → 72 tests cubriendo lógica crítica (~35-40% coverage)

**Resultado:** Aplicación muy util que resuelve un problema real.

## ⚙️ Características Técnicas Implementadas

### 🔐 Sistema de Autenticación Completo
```typescript
// Dual authentication: Credentials + Google OAuth
- NextAuth.js v5 (beta) con JWT strategy
- Passwords hasheados con bcrypt (10 salt rounds)
- HTTP-only cookies (XSS protection)
- Middleware para rutas protegidas
- PrismaAdapter para persistencia de sesiones
```

**Decisión de diseño:** JWT en lugar de sessions en DB para mejor escalabilidad en entornos serverless.

### 💰 Motor de Conversión Multi-Moneda
```typescript
// Soporte para 8 monedas con conversión en tiempo real
convertCurrency(amount, 'USD', 'CLP') // → Conversión a través de USD como base
convertMultipleCurrencies([...subs], 'EUR') // → Agregar múltiples monedas
```

**Desafío resuelto:** Usuarios pueden tener Netflix en USD, Spotify en CLP y ver el total en EUR. El sistema convierte todo usando USD como moneda intermedia para evitar tasas cruzadas complejas.

**Monedas soportadas:** USD, CLP, EUR, GBP, MXN, ARS, BRL, COP

### 📊 Dashboard con Visualización de Datos
- **Gráfico circular** (Recharts PieChart) - Distribución por categorías con tooltips personalizados
- **Gráfico de líneas** (Recharts LineChart) - Tendencias de gasto de últimos 6 meses
- **Cálculos dinámicos** - Vista mensual/anual con conversión automática
- **Estado persistente** - Preferencia de moneda guardada en localStorage

**Optimización:** Server Components para data fetching, Client Components solo donde hay interactividad.

### 🎨 Interfaz de Usuario Consistente
```typescript
// Sistema de diseño custom con Tailwind CSS 4
- Dark theme (slate-950/900/800 palette)
- Componentes reutilizables: <Button variant="outline" size="lg" />
- Estados visuales claros (loading, error, empty states)
- Responsive design (mobile-first approach)
```

**Componentes creados:** Button (5 variants), Input (con validación visual), Card, Select

### 🔍 Detección Automática de Logos
```typescript
// 80+ servicios reconocidos vía simpleicons.org
findKnownLogo('Netflix') // → Returns CDN URL
// Fallback: Iniciales con gradiente si servicio desconocido
```

**Optimización:** Lazy loading de imágenes + fallback instantáneo.

### 🗂️ CRUD Completo de Suscripciones
```prisma
model Subscription {
  price       Float
  currency    String        // Multi-currency support
  cycle       BillingCycle  // WEEKLY | MONTHLY | QUARTERLY | ANNUAL
  category    Category      // 10+ categories
  status      Status        // ACTIVE | PAUSED | CANCELLED | TRIAL
  nextBilling DateTime      // Calculated billing date
}
```

**API Routes implementadas:**
- `GET /api/subscriptions` - Listar con filtros
- `POST /api/subscriptions` - Crear con validación Zod
- `GET /api/subscriptions/[id]` - Ver detalle
- `PATCH /api/subscriptions/[id]` - Actualizar parcial
- `DELETE /api/subscriptions/[id]` - Soft delete

---

## 🧪 Testing Strategy

Implementé **72 tests automatizados** con enfoque estratégico en áreas de alto riesgo:

### Cobertura por Área

| Categoría | Tests | Cobertura | Justificación |
|-----------|-------|-----------|---------------|
| **Currency Utils** | 10 | 100% | Core feature - errores aquí = datos incorrectos |
| **Formatting Utils** | 11 | 81% | UX crítico - formateo de precios y fechas |
| **Zod Validators** | 22 | 100% | Data integrity - previene corrupción de DB |
| **UI Components** | 26 | 100% | Input/Button usados en toda la app |

---

## 🛠️ Stack Tecnológico

### Core Framework
- **Next.js 16.1.6** - App Router, Server Components, Turbopack, Route Handlers
- **React 19** - Latest features con uso estratégico de Server vs Client Components
- **TypeScript 5** - Type safety completo, strict mode habilitado

### Base de Datos & ORM
- **PostgreSQL 18** - Base de datos relacional con tipos complejos
- **Prisma 7.3.0** - ORM moderno con PrismaPg adapter para mejor performance
- **Schema diseñado** - Modelos User, Subscription, Account, Session optimizados

### Autenticación
- **NextAuth.js v5.0.0-beta** - Última versión con nueva API (`auth()` function)
- **Dual providers** - Google OAuth + Credentials (email/password)
- **bcryptjs** - Hashing seguro de contraseñas

### UI & Styling
- **Tailwind CSS 4** - Utility-first styling con dark theme custom
- **Recharts** - Librería de gráficos React para data visualization
- **Lucide React** - Iconos modernos y optimizados
- **Custom Design System** - Componentes reutilizables con variants

### Validación & Testing
- **Zod** - Schema validation en cliente y servidor
- **Jest 30** - Test runner con cobertura estratégica
- **React Testing Library** - Testing enfocado en comportamiento de usuario
- **@testing-library/user-event** - Simulación realista de interacciones

### DevTools & Quality
- **ESLint** - Linting con reglas de Next.js
- **PostCSS** - CSS processing optimizado
- **TypeScript strict mode** - Máxima type safety

---

## 📁 Arquitectura del Proyecto

```
src/
├── app/                              # Next.js App Router
│   ├── (dashboard)/                  # Route group - rutas protegidas
│   │   ├── dashboard/                # Dashboard principal con gráficos
│   │   ├── subscriptions/            # CRUD UI views
│   │   │   ├── [id]/                 # Dynamic route - edit page
│   │   │   └── new/                  # Create subscription
│   │   └── settings/                 # User settings
│   ├── api/                          # Backend API Routes
│   │   ├── auth/[...nextauth]/       # NextAuth handlers
│   │   ├── dashboard/                # Analytics endpoints
│   │   │   ├── stats/                # GET stats por moneda
│   │   │   └── trends/               # GET spending trends
│   │   └── subscriptions/            # REST API
│   │       ├── route.ts              # GET all, POST create
│   │       └── [id]/route.ts         # GET, PATCH, DELETE by ID
│   ├── (auth)/                       # Auth pages group
│   │   ├── login/
│   │   └── register/
│   └── page.tsx                      # Landing page
├── components/
│   ├── ui/                           # Reusable components
│   │   ├── button.tsx                # 5 variants, 4 sizes
│   │   ├── input.tsx                 # With label & error states
│   │   ├── card.tsx                  # Container component
│   │   └── select.tsx                # Dropdown component
│   └── layout/                       # Layout components
│       ├── navbar.tsx                # Top nav with  avatar
│       └── sidebar.tsx               # Side navigation
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   ├── prisma.ts                     # Prisma client singleton
│   ├── services/                     # Business logic layer
│   │   └── subscription.service.ts   # Subscription operations
│   ├── utils/                        # Utility functions
│   │   ├── currency.ts               # Multi-currency conversion
│   │   ├── logos.ts                  # Logo detection (80+ services)
│   │   └── index.ts                  # Formatting helpers
│   └── validators/                   # Zod schemas
│       ├── auth.ts                   # Login/Register validation
│       └── subscription.ts           # Subscription validation
├── types/
│   └── next-auth.d.ts                # Type augmentation for NextAuth
├── middleware.ts                     # Route protection middleware
└── __tests__/                        # Test suite (72 tests)
    ├── components/ui/                # Component tests
    ├── lib/utils/                    # Utils tests
    └── lib/validators/               # Validation tests
```

**Decisiones de arquitectura:**
- **Server Components por defecto** - Client Components solo cuando necesario (interactividad, hooks)
- **API Routes como BFF** - Backend for Frontend pattern, lógica en `/lib/services`
- **Separation of Concerns** - Validators, services, utils separados para testabilidad
- **Type Safety End-to-End** - Tipos compartidos entre cliente y servidor

---

## 💡 Desafíos Técnicos Resueltos

### 1. **Conversión Multi-Moneda Precisa**
**Problema:** Usuarios tienen suscripciones en múltiples monedas, calcular totales es complejo.

**Solución implementada:**
```typescript
// Sistema de conversión con USD como moneda base
const totalConvertido = subscriptions.reduce((acc, sub) => {
  const inUSD = sub.amount / EXCHANGE_RATES[sub.currency];
  const inTarget = inUSD * EXCHANGE_RATES[targetCurrency];
  return acc + inTarget;
}, 0);
```

**Tests:** 10 tests cubriendo conversiones simples, cruzadas y portfolios mixtos.

### 2. **NextAuth v5 Beta con Prisma Adapter**
**Problema:** NextAuth v5 tiene API diferente a v4, documentación limitada.

**Solución implementada:**
- Usar nueva sintaxis `auth()` en lugar de `getServerSession()`
- Configurar PrismaAdapter correctamente con tipo de Pool
- Callbacks personalizados para añadir `user.id` a session

**Aprendizaje:** Early adopter challenges - leer código fuente cuando docs faltan.

### 3. **Optimización de Recharts en Server Components**
**Problema:** Recharts requiere Client Component, pero data fetching debe ser servidor.

**Solución implementada:**
```typescript
// Server Component (dashboard/page.tsx)
const DashboardPage = async () => {
  const data = await fetchStats(); // Server-side
  return <ClientDashboard initialData={data} />; // Hydrate client
}

// Client Component solo para interactividad
"use client";
const ClientDashboard = ({ initialData }) => {
  return <LineChart data={initialData} />; // Charts ejecutan en cliente
}
```

### 4. **Testing de Componentes con Dark Theme**
**Problema:** Testing Library no renderiza estilos, difícil validar variantes visuales.

**Solución implementada:**
- Testear clases CSS aplicadas en lugar de estilos computados
- Verificar lógica condicional (`variant === "destructive"` → `.bg-red-600`)
- Tests de interacción (onClick, onChange) vs tests visuales

---

## 🔐 Seguridad Implementada

- ✅ **Passwords hasheados** con bcrypt (10 salt rounds)
- ✅ **JWT tokens** con firma HMAC-SHA256 en cookies HTTP-only
- ✅ **CSRF protection** automático via NextAuth
- ✅ **SQL Injection** prevenido por Prisma (prepared statements)
- ✅ **XSS protection** via React (auto-escaping) + HTTP-only cookies
- ✅ **Validación dual** - Cliente (UX) y servidor (seguridad) con Zod
- ✅ **Middleware auth** - Rutas protegidas a nivel de Next.js
- ✅ **Environment variables** - Secrets nunca en código


---


## 👤 Sobre el Autor

**Edgardo Silva** - Full Stack Developer

**Conecta conmigo:**
- 💼 [LinkedIn](https://www.linkedin.com/in/edgardo-silva/)
- 🐙 [GitHub](https://github.com/Edgardosilva)
- 📧 [Email](edgardosilva.es@gmail.com)

---

<div align="center">

**⭐ Si encuentras útil este proyecto como referencia, considera darle una estrella ⭐**

*Construido con Next.js 16, TypeScript, PostgreSQL, y mucho ☕*

**SubsCrypt** © 2026 - Proyecto de Portafolio

</div>
