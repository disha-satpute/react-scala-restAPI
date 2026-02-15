package routes

import zio._
import zio.http._
import zio.json._
import model.{Asset, AssetResponse}
import model.Asset._
import model.AssetResponse._
import service.FileService
import utils.PasswordUtils

object AssetRoutes {

  val routes: Routes[Any, Nothing] =
    Routes(

      // GET ALL ASSETS
      Method.GET / "assets" ->
        handler {
          FileService.readAssets
            .map { assets =>
              val resp =
                assets.map(a =>
                  AssetResponse(
                    a.id, a.name, a.host, a.entityType, a.username
                  )
                ).toJson

              Response(
                status = Status.Ok,
                body = Body.fromString(resp),
                headers = Headers(Header.ContentType(MediaType.application.json))
              )
            }
            .catchAll { _ =>
              ZIO.succeed(
                Response(
                  status = Status.InternalServerError,
                  body = Body.fromString("Internal Server Error")
                )
              )
            }
        },

      // GET ASSET BY ID
      Method.GET / "assets" / int("id") ->
        handler { (id: Int, _: Request) =>
          FileService.getAssetById(id)
            .map {
              case Some(a) =>
                Response(
                  status = Status.Ok,
                  body = Body.fromString(
                    AssetResponse(
                      a.id, a.name, a.host, a.entityType, a.username
                    ).toJson
                  ),
                  headers = Headers(Header.ContentType(MediaType.application.json))
                )

              case None =>
                Response(
                  status = Status.NotFound,
                  body = Body.fromString("Asset not found")
                )
            }
            .catchAll { _ =>
              ZIO.succeed(
                Response(
                  status = Status.InternalServerError,
                  body = Body.fromString("Internal Server Error")
                )
              )
            }
        },

      // ADD ASSET
      Method.POST / "assets" ->
        handler { (req: Request) =>
          (for {
            body  <- req.body.asString
            asset <- ZIO.fromEither(body.fromJson[Asset])
            hashed =
              asset.copy(
                password = PasswordUtils.hashPassword(asset.password)
              )
            saved <- FileService.addAsset(hashed)
          } yield
            Response(
              status = Status.Created,
              body = Body.fromString(
                AssetResponse(
                  saved.id,
                  saved.name,
                  saved.host,
                  saved.entityType,
                  saved.username
                ).toJson
              ),
              headers = Headers(Header.ContentType(MediaType.application.json))
            )
            ).catchAll { _ =>
            ZIO.succeed(
              Response(
                status = Status.BadRequest,
                body = Body.fromString("Invalid request")
              )
            )
          }
        },

      // UPDATE ASSET (password optional)
      Method.PUT / "assets" / int("id") ->
        handler { (id: Int, req: Request) =>
          (for {
            body  <- req.body.asString
            asset <- ZIO.fromEither(body.fromJson[Asset])

            prepared =
              asset.copy(
                password =
                  if (asset.password.nonEmpty)
                    PasswordUtils.hashPassword(asset.password)
                  else ""
              )

            updated <- FileService.updateAsset(id, prepared)
          } yield
            if (updated)
              Response(
                status = Status.Ok,
                body = Body.fromString("Asset updated successfully")
              )
            else
              Response(
                status = Status.NotFound,
                body = Body.fromString("Asset not found")
              )
            ).catchAll { _ =>
            ZIO.succeed(
              Response(
                status = Status.BadRequest,
                body = Body.fromString("Invalid request")
              )
            )
          }
        },

      // DELETE ASSET
      Method.DELETE / "assets" / int("id") ->
        handler { (id: Int, _: Request) =>
          FileService.deleteAsset(id)
            .map {
              case true =>
                Response(
                  status = Status.Ok,
                  body = Body.fromString("Asset deleted successfully")
                )
              case false =>
                Response(
                  status = Status.NotFound,
                  body = Body.fromString("Asset not found")
                )
            }
            .catchAll { _ =>
              ZIO.succeed(
                Response(
                  status = Status.InternalServerError,
                  body = Body.fromString("Internal Server Error")
                )
              )
            }
        }
    )
}
