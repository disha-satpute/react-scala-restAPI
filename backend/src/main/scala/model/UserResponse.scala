package model

import zio.json._

case class UserResponse(
                         id: Int,
                         url: String,
                         username: String
                       )

object UserResponse {
  implicit val encoder: JsonEncoder[UserResponse] =
    DeriveJsonEncoder.gen[UserResponse]
}
