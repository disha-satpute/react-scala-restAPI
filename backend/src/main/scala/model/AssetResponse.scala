package model

import zio.json._

case class AssetResponse(
                          id: Int,
                          name: String,
                          host: String,
                          entityType: String,
                          username: String
                        )

object AssetResponse {
  implicit val encoder: JsonEncoder[AssetResponse] =
    DeriveJsonEncoder.gen[AssetResponse]
}
