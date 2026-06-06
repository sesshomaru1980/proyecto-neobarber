/**
 * appointment.service.js
 * Servicio de citas
 */

const Appointment =
  require('./appointment.model');

const User =
  require('../users/user.model');

const Service =
  require('../services/service.model');

// ============================================
// HORARIO NEGOCIO
// ============================================

const CLOSE_HOUR = 20;

// ============================================
// VALIDAR DATE
// ============================================

const toValidDate = (value) => {

  const date =
    new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
};

// ============================================
// OBTENER DURACIÓN
// ============================================

const getServiceDuration =
(service) => {

  const duration = Number(
    service?.durationMinutes
  );

  return duration > 0
    ? duration
    : 0;
};

// ============================================
// CREAR CITA
// ============================================

const create = async (
  appointmentData
) => {

  const {
    barberId,
    serviceId,
    startAt,
    clientId,
    notes
  } = appointmentData;

  if (!barberId) {
    throw new Error(
      'Barbero obligatorio'
    );
  }

  if (!serviceId) {
    throw new Error(
      'Servicio obligatorio'
    );
  }

  if (!clientId) {
    throw new Error(
      'Cliente obligatorio'
    );
  }

  const startDate =
    toValidDate(startAt);

  if (!startDate) {
    throw new Error(
      'Fecha inválida'
    );
  }

  const barber =
    await User.findOne({

      _id: barberId,

      role: 'Barber',

      isActive: true
    });

  if (!barber) {

    throw new Error(
      'Barbero no encontrado'
    );
  }

  const client =
    await User.findOne({

      _id: clientId,

      role: 'Client',

      isActive: true
    });

  if (!client) {

    throw new Error(
      'Cliente no encontrado'
    );
  }

  const service =
    await Service.findById(
      serviceId
    );

  if (!service) {

    throw new Error(
      'Servicio no encontrado'
    );
  }

  const duration =
    getServiceDuration(
      service
    );

  const endDate =
    new Date(

      startDate.getTime()

      +

      duration * 60000
    );

  // ============================================
  // VALIDAR CIERRE
  // ============================================

  const closeDate =
    new Date(startDate);

  closeDate.setHours(
    CLOSE_HOUR,
    0,
    0,
    0
  );

  if (endDate > closeDate) {

    throw new Error(

      'El servicio termina después del horario de atención'
    );
  }

  // ============================================
  // VALIDAR BLOQUEOS
  // ============================================

  const blocked =
    await Appointment.findOne({

      barberId,

      isBlocked: true,

      startAt: {

        $lt: endDate
      },

      endAt: {

        $gt: startDate
      }
    });

  if (blocked) {

    throw new Error(
      'Ese horario está bloqueado'
    );
  }

  // ============================================
  // VALIDAR SOLAPAMIENTO
  // ============================================

  const overlapping =
    await Appointment.findOne({

      barberId,

      status: {

        $in: [
          'Pendiente',
          'Confirmada'
        ]
      },

      startAt: {

        $lt: endDate
      },

      endAt: {

        $gt: startDate
      }
    });

  if (overlapping) {

    throw new Error(

      'El barbero ya tiene una cita en ese horario'
    );
  }
// ============================================
// VALIDAR CLIENTE OCUPADO
// ============================================

const clientOverlapping =
  await Appointment.findOne({

    clientId,

    status: {

      $in: [
        'Pendiente',
        'Confirmada'
      ]
    },

    startAt: {

      $lt: endDate
    },

    endAt: {

      $gt: startDate
    }
  });

if (clientOverlapping) {

  throw new Error(

    'Ya tienes una cita reservada en ese horario'
  );
}
  const appointment =
    await Appointment.create({

      barberId,

      clientId,

      serviceId,

      startAt,

      endAt: endDate,

      notes:
        notes?.trim() || '',

      status:
        'Pendiente'
    });

  return Appointment
    .findById(
      appointment._id
    )
    .populate(
      'barberId',
      'fullName email'
    )
    .populate(
      'clientId',
      'fullName email'
    )
    .populate(
      'serviceId',
      'name durationMinutes price imageUrl'
    );
};

// ============================================
// MIS CITAS
// ============================================

const findByClientId =
async (clientId) => {

  return Appointment
    .find({

      clientId,

      isBlocked: {

        $ne: true
      }
    })

    .populate(
      'barberId',
      'fullName email'
    )

    .populate(
      'serviceId',
      'name durationMinutes price imageUrl'
    )

    .sort({
      startAt: -1
    });
};

// ============================================
// AGENDA BARBERO
// ============================================

const findByBarberId =
async (barberId) => {

  return Appointment
    .find({

      barberId
    })

    .populate(
      'clientId',
      'fullName email'
    )

    .populate(
      'barberId',
      'fullName email'
    )

    .populate(
      'serviceId',
      'name durationMinutes price imageUrl'
    )

    .sort({
      startAt: -1
    });
};

// ============================================
// ADMIN
// ============================================

const findAll =
async () => {

  return Appointment
    .find()

    .populate(
      'clientId',
      'fullName email'
    )

    .populate(
      'barberId',
      'fullName email'
    )

    .populate(
      'serviceId',
      'name durationMinutes price imageUrl'
    )

    .sort({
      startAt: -1
    });
};

// ============================================
// BLOQUEAR HORARIO
// ============================================

const blockSchedule =
async (data) => {

  const {
    barberId,
    startAt,
    endAt,
    notes
  } = data;

  // ============================================
  // VALIDAR DATOS
  // ============================================

  if (!barberId) {

    throw new Error(
      'Barbero obligatorio'
    );
  }

  if (!startAt) {

    throw new Error(
      'Fecha inicial obligatoria'
    );
  }

  if (!endAt) {

    throw new Error(
      'Fecha final obligatoria'
    );
  }

  const startDate =
    new Date(startAt);

  const endDate =
    new Date(endAt);

  const now =
    new Date();

  // ============================================
  // FECHAS PASADAS
  // ============================================

  if (startDate < now) {

    throw new Error(
      'No puedes bloquear fechas pasadas'
    );
  }

  // ============================================
  // FECHA FINAL
  // ============================================

  if (endDate <= startDate) {

    throw new Error(
      'La fecha final debe ser mayor que la inicial'
    );
  }

  // ============================================
  // VALIDAR BARBERO
  // ============================================

  const barber =
    await User.findOne({

      _id: barberId,

      role: 'Barber',

      isActive: true
    });

  if (!barber) {

    throw new Error(
      'Barbero no encontrado'
    );
  }

  // ============================================
  // VALIDAR CITAS EXISTENTES
  // ============================================

  const overlappingAppointment =
    await Appointment.findOne({

      barberId,

      status: {

        $in: [
          'Pendiente',
          'Confirmada'
        ]
      },

      startAt: {
        $lt: endDate
      },

      endAt: {
        $gt: startDate
      }
    });

  if (overlappingAppointment) {

    throw new Error(

      'Existe una cita en ese horario'
    );
  }

  // ============================================
  // VALIDAR BLOQUEOS EXISTENTES
  // ============================================

  const overlappingBlock =
    await Appointment.findOne({

      barberId,

      isBlocked: true,

      startAt: {
        $lt: endDate
      },

      endAt: {
        $gt: startDate
      }
    });

  if (overlappingBlock) {

    throw new Error(

      'Ya existe un bloqueo en ese horario'
    );
  }

  // ============================================
  // CREAR BLOQUEO
  // ============================================

  const block =
    await Appointment.create({

      barberId,

      clientId:
        barberId,

      startAt:
        startDate,

      endAt:
        endDate,

      notes:
        notes ||
        'Horario bloqueado',

      status:
        'Bloqueada',

      isBlocked:
        true
    });

  return Appointment
    .findById(
      block._id
    )
    .populate(
      'barberId',
      'fullName email'
    );
};

// ============================================
// CANCELAR
// ============================================

const cancelAppointment =
async (id) => {

  return Appointment
    .findByIdAndUpdate(

      id,

      {
        status:
          'Cancelada'
      },

      {
        new: true
      }
    );
};
// ============================================
// CONFIRMAR CITA
// ============================================

const confirmAppointment =
async (id) => {

  const appointment =

    await Appointment
      .findById(id);

  if (!appointment) {

    throw new Error(
      'Cita no encontrada'
    );
  }

  if (
    appointment.status ===
    'Cancelada'
  ) {

    throw new Error(
      'No puedes confirmar una cita cancelada'
    );
  }

  if (
    appointment.isBlocked
  ) {

    throw new Error(
      'No puedes confirmar un horario bloqueado'
    );
  }

  appointment.status =
    'Confirmada';

  await appointment.save();

  return Appointment
    .findById(
      appointment._id
    )
    .populate(
      'clientId',
      'fullName email'
    )
    .populate(
      'barberId',
      'fullName email'
    )
    .populate(
      'serviceId',
      'name durationMinutes price'
    );
};
// ============================================
// EXPORTS
// ============================================

module.exports = {

  // Citas
  create,

  // Cliente
  findByClientId,

  // Barbero
  findByBarberId,

  // Administrador
  findAll,

  // Bloqueos
  blockSchedule,

  // Acciones
  cancelAppointment,

  confirmAppointment
};