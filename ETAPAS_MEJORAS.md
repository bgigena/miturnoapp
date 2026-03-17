# Etapas de Mejoras del Proyecto MiTurnoApp

Este documento detalla las etapas de refactorización y mejora propuestas para el proyecto, con el fin de modernizar la arquitectura y facilitar la escalabilidad.

## Etapa 1: Refactorización de Controladores y Capa de Servicios (Backend)
**Objetivo:** Limpiar los controladores de la API (Node.js/Express) para que solo se encarguen de manejar las peticiones HTTP (req, res). Toda la lógica de negocio (validaciones complejas, cálculos de fechas, llamadas a la base de datos) se moverá a una nueva capa de "Servicios".
**Tareas:**
- Crear directorio `src/services/` en el backend.
- Migrar la lógica de negocio de `appointmentController.js` a un nuevo `appointmentService.js`.
- (Opcional) Implementar un middleware de manejo de errores centralizado para evitar repetir `try/catch` y `res.status(500)` en cada controlador.

## Etapa 2: Migración a Prisma ORM (Backend)
**Objetivo:** Reemplazar las consultas SQL crudas (actualmente hechas con `mysql2`) por Prisma ORM para obtener un acceso a datos tipado, seguro y más fácil de mantener.
**Tareas:**
- Instalar e inicializar Prisma (`npm install prisma --save-dev`, `npx prisma init`).
- Hacer introspección de la base de datos actual (`npx prisma db pull`) para generar el `schema.prisma`.
- Generar el Prisma Client (`npx prisma generate`).
- Refactorizar progresivamente los Modelos o Servicios para usar el cliente de Prisma en lugar del pool de `mysql2`.

## Etapa 3: UI Framework - Tailwind CSS + PrimeNG (Frontend)
**Objetivo:** Mejorar el desarrollo de la interfaz de usuario en Angular integrando Tailwind CSS para estilos utilitarios y PrimeNG para componentes complejos (calendarios, tablas, modales).
**Tareas:**
- Instalar y configurar Tailwind CSS en el proyecto Angular (`frontend/`).
- Instalar PrimeNG y sus dependencias (`primeng`, `primeicons`).
- Configurar el tema y los estilos base en `angular.json` y `styles.css`.
- Refactorizar componentes clave (como el calendario de turnos o la agenda diaria) para utilizar los componentes de PrimeNG.
