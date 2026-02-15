package model

import zio.json._

case class Asset(
                  id: Int = 0,
                  name: String,
                  host: String,
                  entityType: String,
                  username: String,
                  password: String
                )

object Asset {
  implicit val decoder: JsonDecoder[Asset] =
    DeriveJsonDecoder.gen[Asset]

  implicit val encoder: JsonEncoder[Asset] =
    DeriveJsonEncoder.gen[Asset]
}
