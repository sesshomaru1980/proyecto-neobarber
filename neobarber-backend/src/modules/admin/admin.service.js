const User =
  require('../users/user.model');

const Service =
  require('../services/service.model');

const Appointment =
  require('../appointments/appointment.model');

const dashboard =
async () => {

  const clients =
    await User.countDocuments({

      role: 'Client'
    });

  const barbers =
    await User.countDocuments({

      role: 'Barber'
    });

  const services =
    await Service.countDocuments({

      isActive: true
    });

  const appointments =
    await Appointment.countDocuments({

      isBlocked: false
    });

  const pendingAppointments =
    await Appointment.countDocuments({

      status: 'Pendiente',

      isBlocked: false
    });

  const confirmedAppointmentsCount =
    await Appointment.countDocuments({

      status: 'Confirmada',

      isBlocked: false
    });

  const cancelledAppointments =
    await Appointment.countDocuments({

      status: 'Cancelada',

      isBlocked: false
    });

  const blockedAppointments =
    await Appointment.countDocuments({

      isBlocked: true
    });

  const confirmedAppointments =
    await Appointment
      .find({

        status: 'Confirmada',

        isBlocked: false
      })
      .populate(
        'serviceId',
        'price'
      );

  let income = 0;

  confirmedAppointments
    .forEach(a => {

      income +=
        a?.serviceId?.price || 0;
    });

  const latestAppointments =
    await Appointment
      .find()
      .populate(
        'clientId',
        'fullName'
      )
      .populate(
        'barberId',
        'fullName'
      )
      .populate(
        'serviceId',
        'name price'
      )
      .sort({
        createdAt: -1
      })
      .limit(5);

  return {

    clients,

    barbers,

    services,

    appointments,

    pendingAppointments,

    confirmedAppointments:
      confirmedAppointmentsCount,

    cancelledAppointments,

    blockedAppointments,

    income,

    latestAppointments
  };
};

module.exports = {

  dashboard
};