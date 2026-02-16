import zio._
import zio.http.Header.{AccessControlAllowOrigin, Origin}
import zio.http.Middleware.{CorsConfig, cors}
import zio.http._
import routes.AssetRoutes

object MainApp extends ZIOAppDefault {

  private val config: CorsConfig =
    CorsConfig(
      allowedOrigin = {
        case origin if origin == Origin.parse("http://localhost:5173").toOption.get =>
          Some(AccessControlAllowOrigin.Specific(origin))
        case _ => None
      },
    )

  override def run =
    Server.serve((AssetRoutes.routes @@ cors(config)).toHttpApp)
      .provide(Server.defaultWithPort(8080))
}
