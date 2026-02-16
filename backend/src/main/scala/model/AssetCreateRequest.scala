package model

import zio.json._

case class AssetCreateRequest(
                               name: String,
                               host: String,
                               entityType: String,
                               username: String,
                               password: String,
                               action: Option[String] // "new" | "overwrite"
                             )

object AssetCreateRequest {
  implicit val decoder: JsonDecoder[AssetCreateRequest] =
    DeriveJsonDecoder.gen
}
