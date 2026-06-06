const adminService =
  require('./admin.service');

function getAuthUser(req) {

  return (

    req.user ||

    req.usuario ||

    req.auth ||

    req.currentUser ||

    null
  );
}

async function dashboard(
  req,
  res
) {

  try {

    const authUser =
      getAuthUser(req);

    if (
      authUser?.role !==
      'Admin'
    ) {

      return res.status(403)
        .json({

          error:
            'Acceso denegado'
        });
    }

    const data =
      await adminService.dashboard();

    return res.json(
      data
    );

  } catch (error) {

    console.error(error);

    return res.status(500)
      .json({

        error:
          'Error al cargar dashboard'
      });
  }
}

module.exports = {

  dashboard
};