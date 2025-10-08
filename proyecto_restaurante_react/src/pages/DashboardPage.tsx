/**
 * Página del Dashboard Administrativo
 * Solo accesible para usuarios con rol de admin
 */
function DashboardPage() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Dashboard Administrativo</h1>
          <div className="alert alert-info">
            <h5>Próximamente</h5>
            <p className="mb-0">
              Esta sección está en desarrollo. Aquí podrás gestionar productos, 
              ver estadísticas y administrar el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

