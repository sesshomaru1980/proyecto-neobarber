/**
 * appointment.model.js
 * Modelo de citas
 */

const mongoose =
  require('mongoose');

const appointmentSchema =
  new mongoose.Schema({

    // ============================================
    // CLIENTE
    // ============================================

    clientId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'User',

      required: true
    },

    // ============================================
    // BARBERO
    // ============================================

    barberId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'User',

      required: true
    },

    // ============================================
    // SERVICIO
    // ============================================

    serviceId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'Service',

      required: false,

      default: null
    },

    // ============================================
    // FECHA INICIO
    // ============================================

    startAt: {

      type: Date,

      required: true
    },

    // ============================================
    // FECHA FIN
    // ============================================

    endAt: {

      type: Date,

      required: true
    },

    // ============================================
    // NOTAS
    // ============================================

    notes: {

      type: String,

      default: ''
    },

    // ============================================
    // BLOQUEO HORARIO
    // ============================================

    isBlocked: {

      type: Boolean,

      default: false
    },

    // ============================================
    // ESTADO
    // ============================================

    status: {

      type: String,

      enum: [

        'Pendiente',

        'Confirmada',

        'Cancelada',

        'Bloqueada'
      ],

      default:
        'Pendiente'
    }

  }, {

    timestamps: true
  });

module.exports =
  mongoose.model(
    'Appointment',
    appointmentSchema
  );