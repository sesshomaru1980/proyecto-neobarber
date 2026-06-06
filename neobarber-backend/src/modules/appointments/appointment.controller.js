/**
 * appointment.controller.js
 */

const appointmentService =
  require('./appointment.service');

// ============================================
// OBTENER USUARIO AUTH
// ============================================

function getAuthUser(req) {

  return (

    req.user ||

    req.usuario ||

    req.auth ||

    req.currentUser ||

    null
  );
}

// ============================================
// OBTENER ID
// ============================================

function getUserId(user) {

  if (!user) return null;

  return (

    user._id ||

    user.id ||

    user.userId ||

    user.sub ||

    null
  );
}

// ============================================
// OBTENER ROL
// ============================================

function getUserRole(user) {

  if (!user) return null;

  return (

    user.role ||

    user.rol ||

    null
  );
}

// ============================================
// CREAR CITA
// ============================================

async function create(
  req,
  res
) {

  try {

    // ============================================
    // USUARIO AUTH
    // ============================================

    const authUser =
      getAuthUser(req);

    // ============================================
    // CLIENT ID
    // ============================================

    const clientId =
      getUserId(authUser);

    // ============================================
    // VALIDAR LOGIN
    // ============================================

    if (!clientId) {

      return res.status(401).json({

        error:
          'Usuario no autenticado'
      });
    }

    // ============================================
    // CREAR
    // ============================================

    const appointment =

      await appointmentService.create({

        ...req.body,

        clientId
      });

    return res.status(201).json(
      appointment
    );

  } catch (error) {

    console.error(error);

    return res.status(400).json({

      error:
        error.message
    });
  }
}

// ============================================
// BLOQUEAR HORARIO
// ============================================

async function blockSchedule(
  req,
  res
) {

  try {

    const authUser =
      getAuthUser(req);

    const role =
      getUserRole(authUser);

    async function blockSchedule(
  req,
  res
) {

  try {

    const authUser =
      getAuthUser(req);

    const role =
      getUserRole(authUser);

    const userId =
      getUserId(authUser);

    // ============================================
    // SOLO ADMIN O BARBERO
    // ============================================

    if (

      role !== 'Admin'

      &&

      role !== 'Barber'

    ) {

      return res.status(403).json({

        error:
          'No tienes permisos para bloquear horarios'
      });
    }

    // ============================================
    // BARBERO SOLO SU AGENDA
    // ============================================

    if (

      role === 'Barber'

      &&

      req.body.barberId !== userId

    ) {

      return res.status(403).json({

        error:
          'Solo puedes bloquear tu propia agenda'
      });
    }

    const blocked =

      await appointmentService
        .blockSchedule(
          req.body
        );

    return res.status(201).json(
      blocked
    );

  } catch (error) {

    console.error(error);

    return res.status(400).json({

      error:
        error.message
    });
  }
}
    const blocked =

      await appointmentService
        .blockSchedule(
          req.body
        );

    return res.status(201).json(
      blocked
    );

  } catch (error) {

    console.error(error);

    return res.status(400).json({

      error:
        error.message
    });
  }
}

// ============================================
// MIS CITAS
// ============================================

async function myAppointments(
  req,
  res
) {

  try {

    const authUser =
      getAuthUser(req);

    const clientId =
      getUserId(authUser);

    if (!clientId) {

      return res.status(401).json({

        error:
          'Usuario no autenticado'
      });
    }

    const appointments =

      await appointmentService
        .findByClientId(
          clientId
        );

    return res.json(
      appointments
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      error:
        'No se pudieron cargar las citas'
    });
  }
}

// ============================================
// PANEL BARBERO
// ============================================

async function barberAgenda(
  req,
  res
) {

  try {

    const authUser =
      getAuthUser(req);

    const userId =
      getUserId(authUser);

    const role =
      getUserRole(authUser);

    let appointments = [];

    // ============================================
    // ADMIN
    // ============================================

    if (role === 'Admin') {

      appointments =

        await appointmentService
          .findAll();
    }

    // ============================================
    // BARBERO
    // ============================================

    else {

      appointments =

        await appointmentService
          .findByBarberId(
            userId
          );
    }

    return res.json(
      appointments
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      error:
        'No se pudo cargar la agenda'
    });
  }
}

// ============================================
// CANCELAR
// ============================================

async function cancelAppointment(
  req,
  res
) {

  try {

    const updated =

      await appointmentService
        .cancelAppointment(
          req.params.id
        );

    return res.json(
      updated
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      error:
        'No se pudo cancelar la cita'
    });
  }
}
// ============================================
// CONFIRMAR CITA
// ============================================

async function confirmAppointment(
  req,
  res
) {

  try {

    console.log(
      'CONFIRMANDO ID:',
      req.params.id
    );

    const updated =

      await appointmentService
        .confirmAppointment(
          req.params.id
        );

    return res.json(
      updated
    );

  } catch (error) {

    console.error(
      'ERROR CONFIRMAR:',
      error
    );

    return res.status(400)
      .json({

        error:
          error.message
      });
  }
}
// ============================================
// EXPORTAR
// ============================================

module.exports = {

  create,

  blockSchedule,

  myAppointments,

  barberAgenda,

  cancelAppointment,

  confirmAppointment
};