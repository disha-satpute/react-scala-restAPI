package service

import zio._
import zio.json._
import java.io.IOException
import scala.io.Source
import java.nio.file.{Files, Paths}
import model.User

object FileService {

  private val filePath = "src/main/resources/data/users.json"

  def readUsers: Task[List[User]] =
    ZIO.attempt {
      val source = Source.fromFile(filePath)
      val data   = source.getLines().mkString
      source.close()
      data.fromJson[List[User]].getOrElse(List.empty)
    }

  def writeUsers(users: List[User]): Task[Unit] =
    ZIO.attempt {
      val json = users.toJson
      Files.write(Paths.get(filePath), json.getBytes)
    }

  def getUserById(id: Int): Task[Option[User]] =
    readUsers.map(_.find(_.id == id))

  def addUser(user: User): Task[Unit] =
    for {
      users <- readUsers
      _     <- writeUsers(users :+ user)
    } yield ()

  def updateUser(id: Int, updated: User): Task[Boolean] =
    for {
      users <- readUsers
      updatedList = users.map(u => if (u.id == id) updated else u)
      exists = users.exists(_.id == id)
      _ <- if (exists) writeUsers(updatedList)
      else ZIO.unit
    } yield exists

  def deleteUser(id: Int): Task[Boolean] =
    for {
      users <- readUsers
      filtered = users.filterNot(_.id == id)
      exists = users.size != filtered.size
      _ <- if (exists) writeUsers(filtered)
      else ZIO.unit
    } yield exists
}
