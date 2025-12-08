# MiTurnoApp

MiTurnoApp es una aplicación de agendamiento de citas construida con Angular. Está diseñada para facilitar la gestión de servicios y horarios tanto para proveedores como para clientes.

## ✨ Características Principales

El proyecto se estructura en torno a dos roles de usuario principales:

- **Proveedor**: Gestiona sus servicios, horarios de atención y visualiza las citas agendadas.
- **Cliente**: Visualiza los servicios de un proveedor y agenda citas (funcionalidad futura).

La funcionalidad actual para el rol de **Proveedor** incluye:
- **Panel de Control**: Una vista central que muestra:
  - **Agenda Diaria**: Visualización de las citas del día.
  - **Gestión de Servicios**: Permite crear y administrar los servicios ofrecidos.
  - **Gestión de Horarios**: Permite definir los horarios de atención.
  - **Link de Reserva**: Genera un enlace para que los clientes puedan reservar.

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 20.x o superior)
- [Angular CLI](https://angular.io/cli)

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```
2.  Navega al directorio del proyecto:
    ```bash
    cd miturnoapp
    ```
3.  Instala las dependencias:
    ```bash
    npm install
    ```

### Ejecución

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`.

### Pruebas

Para ejecutar las pruebas unitarias, utiliza:

```bash
npm test
```

## ⚠️ Nota sobre Autenticación

Actualmente, el sistema de autenticación está **simulado**. La aplicación inicia por defecto con el rol de **'proveedor'** para facilitar el desarrollo y la demostración de las funcionalidades existentes.

El servicio `AuthService` en `src/app/service/auth/auth.ts` contiene la lógica de autenticación simulada que puedes modificar para probar otros flujos.