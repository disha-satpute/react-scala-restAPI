package model

import zio.json._

case class User(
                 id: Int = 0,// default value
                 url : String,
                 username: String,
                 password: String
               )


object User {
  implicit val decoder: JsonDecoder[User] = DeriveJsonDecoder.gen[User]
  implicit val encoder: JsonEncoder[User] = DeriveJsonEncoder.gen[User]
}
