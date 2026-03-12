# 💈 NeoBarber

Sistema web para la gestión de una barbería que permite administrar servicios, barberos y citas de clientes.  
El proyecto fue desarrollado como parte del proceso de formación del **SENA** para la evidencia:

**GA8-220501096-AA1-EV02 – Módulos Integrados**

---

# 📌 Descripción del proyecto

NeoBarber es una aplicación web que permite a los clientes agendar citas en una barbería, mientras que los barberos y administradores pueden gestionar servicios, disponibilidad y citas programadas.

El sistema cuenta con diferentes roles de usuario:

- **Administrador**
- **Barbero**
- **Cliente**

Cada rol tiene permisos específicos dentro de la plataforma.

---

# 🚀 Tecnologías utilizadas

## Frontend
- Angular
- TypeScript
- HTML
- CSS

## Backend
- Node.js
- Express.js
- JWT (Autenticación)

## Base de datos
- MongoDB
- Mongoose

## Control de versiones
- Git
- GitHub

---

# 🏗 Arquitectura del sistema

El sistema implementa una arquitectura **cliente-servidor**.
# 💈 NeoBarber

Sistema web para la gestión de una barbería que permite administrar servicios, barberos y citas de clientes.  
El proyecto fue desarrollado como parte del proceso de formación del **SENA** para la evidencia:

**GA8-220501096-AA1-EV02 – Módulos Integrados**

---

# 📌 Descripción del proyecto

NeoBarber es una aplicación web que permite a los clientes agendar citas en una barbería, mientras que los barberos y administradores pueden gestionar servicios, disponibilidad y citas programadas.

El sistema cuenta con diferentes roles de usuario:

- **Administrador**
- **Barbero**
- **Cliente**

Cada rol tiene permisos específicos dentro de la plataforma.

---

# 🚀 Tecnologías utilizadas

## Frontend
- Angular
- TypeScript
- HTML
- CSS

## Backend
- Node.js
- Express.js
- JWT (Autenticación)

## Base de datos
- MongoDB
- Mongoose

## Control de versiones
- Git
- GitHub

---

# 🏗 Arquitectura del sistema

El sistema implementa una arquitectura **cliente-servidor**.
Usuarios
│
▼
Frontend (Angular)
│
▼
API REST (Node.js + Express)
│
▼
MongoDB


---

# 🗄 Modelo de base de datos

El sistema utiliza las siguientes colecciones principales:

- `users`
- `services`
- `barberprofiles`
- `appointments`
- `timeblocks`

Estas permiten gestionar usuarios, servicios, disponibilidad de barberos y citas.

---

# 👥 Roles del sistema

## Administrador
Puede:

- Crear y administrar barberos
- Crear, editar y eliminar servicios
- Activar o desactivar barberos
- Visualizar citas del sistema

## Barbero
Puede:

- Ver las citas asignadas
- Gestionar su disponibilidad

## Cliente
Puede:

- Registrarse en el sistema
- Iniciar sesión
- Agendar citas
- Ver sus citas programadas

---

# 🔐 Credenciales de prueba

Para facilitar la evaluación del sistema se configuraron usuarios de prueba.

### Administrador

---

# 🗄 Modelo de base de datos

El sistema utiliza las siguientes colecciones principales:

- `users`
- `services`
- `barberprofiles`
- `appointments`
- `timeblocks`

Estas permiten gestionar usuarios, servicios, disponibilidad de barberos y citas.

---

# 👥 Roles del sistema

## Administrador
Puede:

- Crear y administrar barberos
- Crear, editar y eliminar servicios
- Activar o desactivar barberos
- Visualizar citas del sistema

## Barbero
Puede:

- Ver las citas asignadas
- Gestionar su disponibilidad

## Cliente
Puede:

- Registrarse en el sistema
- Iniciar sesión
- Agendar citas
- Ver sus citas programadas

---

# 🔐 Credenciales de prueba

Para facilitar la evaluación del sistema se configuraron usuarios de prueba.

### Administrador
Correo: admin@neo.com

Contraseña: 123456


---

# ⚙️ Instalación del proyecto

## 1️⃣ Clonar el repositorio

```bash
git clone  https://github.com/sesshomaru1980/proyecto-neobarber.git

Backend

Ir a la carpeta del backend:

cd neobarber-backend

Instalar dependencias:

npm install

Ejecutar el servidor:

npm run dev

El backend se ejecutará en:

http://localhost:3000
3️⃣ Frontend

Ir a la carpeta del frontend:

cd neobarber-frontend

Instalar dependencias:

npm install

Ejecutar la aplicación:

ng serve

El frontend se ejecutará en:

http://localhost:4200
📡 Endpoints principales del backend
Método	Endpoint	Descripción
GET	/api/services	Obtener servicios
POST	/api/services	Crear servicio
PUT	/api/services/:id	Actualizar servicio
DELETE	/api/services/:id	Eliminar servicio
GET	/api/barbers	Listar barberos
POST	/api/appointments	Crear cita
🧪 Pruebas realizadas

Se realizaron pruebas funcionales para verificar:

Registro de usuarios

Inicio de sesión

Creación de servicios

Creación de barberos

Agendamiento de citas

Visualización de citas

Las pruebas confirmaron el correcto funcionamiento de los módulos integrados del sistema.

📚 Documentación

La documentación del proyecto incluye:

Diagramas de arquitectura

Diagrama de base de datos

Manual técnico

Evidencia de pruebas del sistema

👨‍💻 Autor

Proyecto desarrollado por:

Pedro Pablo Prado Rivas
ficha: 3070207
Programa de formación : Análisis y desarrollo de software.

📄 Licencia

Este proyecto fue desarrollado con fines académicos como parte del proceso de formación del SENA.
