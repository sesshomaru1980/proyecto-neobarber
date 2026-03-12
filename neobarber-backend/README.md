<!--
README del proyecto NeoBarber API.
Incluye instrucciones de instalación/ejecución, variables de entorno y endpoints.
-->

# NeoBarber API FULL (Node.js + Express + MongoDB + JWT)

Proyecto para evidencia GA8-220501096-AA1-EV01: integración de módulos por componentes/capas.

## Módulos incluidos
1) Auth (register/login JWT)
2) Users (perfil /me)
3) Services (CRUD Admin)
4) Barbers (perfil + disponibilidad semanal)
5) Appointments (agendar, listar mis citas, cambiar estado; evita solapamiento)
6) Availability (slots del día + bloqueos de agenda del barbero)

## Arquitectura por capas (por módulo)
- routes -> controller -> service -> repository -> model (Mongoose)

## Requisitos
- Node.js 18+
- MongoDB local o Atlas

## Configuración
1) Copia `.env.example` a `.env`
2) `npm i`
3) `npm run dev`
4) Probar: `GET http://localhost:3000/health`

## Endpoints
### Health
- `GET /health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me` (Bearer)

### Services (Admin)
- `GET /api/services`
- `POST /api/services` (Admin)
- `PUT /api/services/:id` (Admin)
- `DELETE /api/services/:id` (Admin)

### Barbers
- `GET /api/barbers`
- `POST /api/barbers/upsert` (Admin/Barber)

### Availability (agenda)
- `GET /api/availability/daily-slots?barberId=<USER_ID_BARBER>&dateUtc=2026-03-01T00:00:00.000Z&slotMinutes=30`
- `POST /api/availability/block` (Admin/Barber)
- `DELETE /api/availability/block/:id` (Admin/Barber)

### Appointments (citas)
- `POST /api/appointments` (Client)
- `GET /api/appointments/me` (Bearer)
- `PUT /api/appointments/:id/status` (Bearer)

## Roles
- Admin
- Barber
- Client

## Pruebas (smoke)
`npm test`

> Para pruebas completas por módulo, se recomienda usar una base de datos de pruebas o Mongo Memory Server.
