package service

import zio._
import zio.json._
import java.io.IOException
import scala.io.Source
import java.nio.file.{Files, Paths}
import model.Asset

object FileService {

  private val filePath = "src/main/resources/data/Assets.json"

  def readAssets: Task[List[Asset]] =
    ZIO.attempt {
      val source = scala.io.Source.fromFile(filePath)
      val data = source.getLines().mkString
      source.close()
      data.fromJson[List[Asset]].getOrElse(List.empty)
    }


  def writeAssets(assets: List[Asset]): Task[Unit] =
    ZIO.attempt {
      val json = assets.toJsonPretty
      java.nio.file.Files.write(
        java.nio.file.Paths.get(filePath),
        json.getBytes
      )
    }


  def getAssetById(id: Int): Task[Option[Asset]] =
    readAssets.map(_.find(_.id == id))

  def addAsset(asset: Asset): Task[Asset] =
    for {
      assets <- readAssets
      nextId =
        if (assets.isEmpty) 1 else assets.map(_.id).max + 1

      assetWithId = asset.copy(id = nextId)
      _ <- writeAssets(assets :+ assetWithId)
    } yield assetWithId



  def updateAsset(id: Int, updated: Asset): Task[Boolean] =
    for {
      assets <- readAssets
      existingOpt = assets.find(_.id == id)

      updatedAssets = existingOpt match {
        case Some(existing) =>
          assets.map { a =>
            if (a.id == id)
              updated.copy(
                id = id,
                password =
                  if (updated.password.nonEmpty)
                    updated.password
                  else
                    existing.password
              )
            else a
          }
        case None => assets
      }

      exists = existingOpt.isDefined
      _ <- if (exists) writeAssets(updatedAssets) else ZIO.unit
    } yield exists

  def deleteAsset(id: Int): Task[Boolean] =
    for {
      assets <- readAssets
      exists = assets.exists(_.id == id)
      updated = assets.filterNot(_.id == id)
      _ <- if (exists) writeAssets(updated) else ZIO.unit
    } yield exists

}
