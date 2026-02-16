package routes

import zio._
import zio.http._
import zio.json._

import model.{Asset, AssetResponse, AssetCreateRequest}
import model.Asset._
import model.AssetResponse._
import service.FileService
import utils.PasswordUtils

object AssetRoutes {

  val routes: Routes[Any, Nothing] =
    Routes(

      // ---------------- GET ALL ASSETS ----------------
      Method.GET / "assets" ->
        handler {
          FileService.readAssets
            .map { assets =>
              Response(
                status = Status.Ok,
                body = Body.fromString(
                  assets.map(a =>
                    AssetResponse(
                      a.id, a.name, a.host, a.entityType, a.username
                    )
                  ).toJson
                ),
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

      // ---------------- GET ASSET BY ID ----------------
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
            .catchAll(_ =>
              ZIO.succeed(
                Response(
                  status = Status.InternalServerError,
                  body = Body.fromString("Internal Server Error")
                )
              )
            )
        },

      // ---------------- ADD ASSET (DUPLICATE-AWARE) ----------------
      Method.POST / "assets" ->
        handler { (req: Request) =>
          (for {
            body <- req.body.asString
            input <- ZIO.fromEither(body.fromJson[AssetCreateRequest])

            existing <- FileService.getAssetsByName(input.name)

            response <-
              if (existing.isEmpty) {
                FileService.addAsset(
                  Asset(
                    name = input.name,
                    host = input.host,
                    entityType = input.entityType,
                    username = input.username,
                    password = PasswordUtils.hashPassword(input.password)
                  )
                ).map { saved =>
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
                }
              }
              else {
                input.action match {

                  case None =>
                    ZIO.succeed(
                      Response(
                        status = Status.Conflict,
                        body = Body.fromString("Duplicate name found")
                      )
                    )

                  case Some("new") =>
                    FileService.addAsset(
                      Asset(
                        name = input.name,
                        host = input.host,
                        entityType = input.entityType,
                        username = input.username,
                        password = PasswordUtils.hashPassword(input.password)
                      )
                    ).map(_ =>
                      Response(
                        status = Status.Created,
                        body = Body.fromString("New asset created")
                      )
                    )

                  case Some("overwrite") =>
                    input.overwriteId match {

                      case Some(targetId) =>
                        val updatedAsset =
                          Asset(
                            id = targetId,
                            name = input.name,
                            host = input.host,
                            entityType = input.entityType,
                            username = input.username,
                            password = PasswordUtils.hashPassword(input.password)
                          )

                        FileService.updateAsset(targetId, updatedAsset).map {
                          case true =>
                            Response(
                              status = Status.Ok,
                              body = Body.fromString(s"Asset $targetId overwritten successfully")
                            )

                          case false =>
                            Response(
                              status = Status.NotFound,
                              body = Body.fromString("Target asset not found")
                            )
                        }

                      case None =>
                        ZIO.succeed(
                          Response(
                            status = Status.BadRequest,
                            body = Body.fromString("overwriteId is required for overwrite")
                          )
                        )
                    }


                  case _ =>
                    ZIO.succeed(
                      Response(
                        status = Status.BadRequest,
                        body = Body.fromString("Invalid action")
                      )
                    )
                }
              }

          } yield response
            ).catchAll(_ =>
            ZIO.succeed(
              Response(
                status = Status.BadRequest,
                body = Body.fromString("Invalid request")
              )
            )
          )
        },

      // ---------------- UPDATE ASSET ----------------
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
            ).catchAll(_ =>
            ZIO.succeed(
              Response(
                status = Status.BadRequest,
                body = Body.fromString("Invalid request")
              )
            )
          )
        },

      // ---------------- DELETE ASSET ----------------
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
