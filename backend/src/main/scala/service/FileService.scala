package service

import zio._
import zio.json._
import model.Asset

import java.nio.file.{Files, Paths}

object FileService {

  private val filePath = "src/main/resources/data/Assets.json"

  // ---------- READ ----------
  def readAssets: Task[List[Asset]] =
    ZIO.attempt {
      val path = Paths.get(filePath)

      if (!Files.exists(path)) {
        List.empty
      } else {
        val data = Files.readString(path)
        data.fromJson[List[Asset]].getOrElse(List.empty)
      }
    }


  // ---------- WRITE (PRETTY JSON) ----------
  def writeAssets(assets: List[Asset]): Task[Unit] =
    ZIO.attempt {
      val json = assets.toJsonPretty
      Files.write(Paths.get(filePath), json.getBytes)
    }


  // ---------- GET BY ID ----------
  def getAssetById(id: Int): Task[Option[Asset]] =
    readAssets.map(_.find(_.id == id))

  // ---------- GET BY NAME (NEW) ----------
  def getAssetsByName(name: String): Task[List[Asset]] =
    readAssets.map(_.filter(_.name == name))

  // ---------- ADD ASSET (AUTO ID) ----------
  def addAsset(asset: Asset): Task[Asset] =
    for {
      assets <- readAssets
      nextId =
        if (assets.isEmpty) 1 else assets.map(_.id).max + 1

      assetWithId = asset.copy(id = nextId)
      _ <- writeAssets(assets :+ assetWithId)
    } yield assetWithId

  // ---------- OVERWRITE BY NAME (NEW) ----------
  def overwriteAssetByName(asset: Asset): Task[Unit] =
    for {
      assets <- readAssets
      filtered = assets.filterNot(_.name == asset.name)
      _ <- writeAssets(filtered :+ asset)
    } yield ()

  // ---------- UPDATE BY ID ----------
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

  // ---------- DELETE ----------
  def deleteAsset(id: Int): Task[Boolean] =
    for {
      assets <- readAssets
      exists = assets.exists(_.id == id)
      updated = assets.filterNot(_.id == id)
      _ <- if (exists) writeAssets(updated) else ZIO.unit
    } yield exists
}