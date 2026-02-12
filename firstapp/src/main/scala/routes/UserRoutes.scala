package routes

import zio._
import zio.http._
import zio.json._
import model.User
import model.User._
import service.FileService

object UserRoutes {

  val routes: Routes[Any, Nothing] =
    Routes(

      // GET ALL USERS
      Method.GET / "users" ->
        handler {
          FileService.readUsers
            .map(users => Response.json(users.toJson))
            .catchAll(_ => ZIO.succeed(Response.status(Status.InternalServerError)))
        },

      // GET USER BY ID
      Method.GET / "users" / int("id") ->
        handler { (id: Int, _: Request) =>
          FileService.getUserById(id)
            .map {
              case Some(user) => Response.json(user.toJson)
              case None       => Response.status(Status.NotFound)
            }
            .catchAll(_ => ZIO.succeed(Response.status(Status.InternalServerError)))
        },

      // POST CREATE USER
      Method.POST / "users" ->
        handler { (req: Request) =>
          (for {
            body <- req.body.asString
            user <- ZIO
              .fromEither(body.fromJson[User])
              .mapError(_ => new RuntimeException("Invalid JSON"))
            _    <- FileService.addUser(user)
          } yield Response.text("User Created"))
            .catchAll(_ => ZIO.succeed(Response.status(Status.BadRequest)))
        }
    )
}
