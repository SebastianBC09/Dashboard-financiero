# Dashboard Financiero 🚀

Dashboard Financiero es una aplicación de gestión financiera personal para el mercado colombiano. Permite visualizar balances, transacciones, solicitar préstamos y gestionar el perfil financiero con datos mock contextualizados.

## 📋 Descripción

Dashboard Financiero es una SPA desarrollada con Angular 20 y Standalone Components.
Funcionalidades clave:

- Visualización de balances y transacciones
- Solicitud y simulación de préstamos
- Gestión de perfil y notificaciones en tiempo real

## 📁 Estructura de Directorios

src/app/
core/
authentication.service.ts
financial-data.service.ts
data/
mock/
mock-data.ts
services/
mock-http.service.ts
models/
types/
user.interface.ts
financial.interface.ts
shared/
loading-spinner/
error-message/
navigation-header/
features/
authentication/
dashboard/
transactions/
loan-request/
app.component.\*

## 🎨 Principios de Diseño

1. Separación de Responsabilidades
2. Nomenclatura Descriptiva
3. TypeScript Best Practices
4. Mock Local

## 🏗️ Arquitectura

- Angular 20 con Standalone Components
- RxJS para manejo de observables
- Servicios singleton
- Persistencia en localStorage

## ⚙️ Instalación y Ejecución

1. Clonar el repositorio:
   git clone <url-del-repositorio>
   cd dashboard-financiero

2. Instalar dependencias:
   npm install

3. Ejecutar servidor de desarrollo:
   npm start o ng serve

4. Abrir http://localhost:4200/

## 📝 Scripts Disponibles

npm start (Desarrollo)
npm run build (Producción)

## 🔐 Credenciales de Prueba

Carlos Rodríguez: carlos.rodriguez@email.com
María González: maria.gonzalez@email.com
Juan Pérez: juan.perez@email.com

Contraseña para todos: password123

## 🧩 Decisiones Arquitectónicas Clave

- Separación de capas: core, data, models, shared, features
- Lazy Loading de módulos

## 💻 Tecnologías y Dependencias

En este proyecto usamos varias librerías adicionales al núcleo de Angular:

- **@fortawesome/angular-fontawesome**
  Integración de FontAwesome para iconos vectoriales en componentes Angular.
- **@fortawesome/free-solid-svg-icons**
  Conjunto oficial de iconos sólidos de FontAwesome.
- **rxjs**
  Programación reactiva: manejo de flujos de datos y eventos asíncronos.
- **tslib**
  Helpers para optimizar el código generado por TypeScript.
- **zone.js**
  Control del contexto de ejecución de tareas asíncronas en Angular.

## 🗃️ Datos Mock

Usuarios: Carlos Rodríguez, María González, Juan Pérez
Transacciones: nómina, servicios públicos, hipoteca, retiros, transferencias
Préstamos: tasas 12.5%–18.5%, vivienda/vehículo/educación

## 🔑 Autenticación y Seguridad

- Sesiones y localStorage
- Guards de rutas
- Refresh de tokens

## 🔒 Seguridad

Protección contra XSS

- Interpolación Angular ({{ }})
- Content Security Policy
- Validación de datos en formularios
- Servicio de sanitización centralizado

Prácticas Prohibidas

- Evitar innerHTML, eval, document.write, window.setTimeout con datos del usuario

Tipos de XSS Prevenidos: Reflected, Stored, DOM-Based

Testing de Seguridad: Pruebas con OWASP ZAP, Burp Suite

Checklist de Seguridad:

- CSP configurado
- Sanitización de datos
- Evitar métodos peligrosos

## 🎨 Estilos y Diseño

- SCSS Modules con @use y mixins
- Tailwind opcional
- Sin !important
- Estilos encapsulados

## 📚 Recursos Adicionales

- Angular Documentation: https://angular.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- RxJS Documentation: https://rxjs.dev/
- OWASP XSS Prevention Cheat Sheet: https://owasp.org/www-project-cheat-sheets/cheat_sheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Angular Security Guide: https://angular.io/guide/security
