import zio._
import zio.http._
import routes.UserRoutes

object MainApp extends ZIOAppDefault {

  override def run =
    Server.serve(UserRoutes.routes.toHttpApp)

      .provide(Server.defaultWithPort(8080))
}
