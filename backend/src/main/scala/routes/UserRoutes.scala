package routes

import utils.PasswordUtils
import model.{User, UserResponse}
import model.User._
import model.UserResponse._
import service.FileService

import zio._
import zio.http._
import zio.json._

object UserRoutes {

  val routes: Routes[Any, Nothing] =
    Routes(

      // GET ALL USERS
      Method.GET / "users" ->
        handler {
          FileService.readUsers
            .map { users =>
              val safeUsers =
                users.map(u => UserResponse(u.id, u.username,u.url)).toJson

              Response(
                status = Status.Ok,
                body = Body.fromString(safeUsers),
                headers = Headers(Header.ContentType(MediaType.application.json))
              )
            }
            .catchAll(_ =>
              ZIO.succeed(
                Response(
                  status = Status.InternalServerError,
                  body = Body.fromString("Internal Server Error")
                )
              )
            )
        },

      // GET USER BY ID
      Method.GET / "users" / int("id") ->
        handler { (id: Int, _: Request) =>
          FileService.getUserById(id)
            .map {
              case Some(user) =>
                Response(
                  status = Status.Ok,
                  body = Body.fromString(
                    UserResponse(user.id, user.username,user.url).toJson
                  ),
                  headers = Headers(Header.ContentType(MediaType.application.json))
                )

              case None =>
                Response(
                  status = Status.NotFound,
                  body = Body.fromString("User not found")
                )
            }
            .catchAll(_ =>
              ZIO.succeed(
                Response(
                  status = Status.InternalServerError,
                  body = Body.fromString("Internal Server Error")
                )
              )
            )
        },

      // POST CREATE USER
      Method.POST / "users" ->
        handler { (req: Request) =>
          (for {
            body <- req.body.asString

            user <- ZIO
              .fromEither(body.fromJson[User])
              .mapError(_ => new RuntimeException("Invalid JSON"))

            hashedUser = user.copy(
              password = PasswordUtils.hashPassword(user.password)
            )

            result <- FileService.addUser(hashedUser)

          } yield
            result match {

              case Right(savedUser) =>
                Response(
                  status = Status.Created,
                  body = Body.fromString(
                    UserResponse(savedUser.id, savedUser.username,savedUser.url).toJson
                  ),
                  headers = Headers(Header.ContentType(MediaType.application.json))
                )

              case Left(errorMessage) =>
                Response(
                  status = Status.Conflict,
                  body = Body.fromString(errorMessage)
                )
            }

            ).catchAll(_ =>
            ZIO.succeed(
              Response(
                status = Status.BadRequest,
                body = Body.fromString("Invalid request")
              )
            )
          )
        }
      ,
      // UPDATE USER
      Method.PUT / "users" / int("id") ->
        handler { (id: Int, req: Request) =>
          (for {
            body <- req.body.asString

            user <- ZIO
              .fromEither(body.fromJson[User])
              .mapError(_ => new RuntimeException("Invalid JSON"))

            hashedUser = user.copy(
              password = PasswordUtils.hashPassword(user.password),
              id = id
            )

            updated <- FileService.updateUser(id, hashedUser)

          } yield
            if (updated)
              Response(
                status = Status.Ok,
                body = Body.fromString("User updated successfully")
              )
            else
              Response(
                status = Status.NotFound,
                body = Body.fromString("User not found")
              )

            ).catchAll(_ =>
            ZIO.succeed(
              Response(
                status = Status.BadRequest,
                body = Body.fromString("Invalid request")
              )
            )
          )
        },
      // DELETE USER
      Method.DELETE / "users" / int("id") ->
        handler { (id: Int, _: Request) =>
          FileService.deleteUser(id)
            .map {
              case true =>
                Response(
                  status = Status.Ok,
                  body = Body.fromString("User deleted successfully")
                )

              case false =>
                Response(
                  status = Status.NotFound,
                  body = Body.fromString("User not found")
                )
            }
            .catchAll(_ =>
              ZIO.succeed(
                Response(
                  status = Status.InternalServerError,
                  body = Body.fromString("Internal Server Error")
                )
              )
            )
        }

    )
}
