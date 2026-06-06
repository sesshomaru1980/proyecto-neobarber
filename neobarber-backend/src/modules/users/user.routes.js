const express =
  require('express');

const router =
  express.Router();

const User =
  require('./user.model');

// ============================================
// OBTENER BARBEROS
// ============================================

router.get(
  '/barbers',

  async (req, res) => {

    try {

      const barbers =
        await User.find({

          role: 'Barber'
        });

      res.json(barbers);

    } catch (error) {

      res.status(500).json({

        error:
          'Error obteniendo barberos'
      });
    }
  }
);

module.exports = router;