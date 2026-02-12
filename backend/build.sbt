ThisBuild / scalaVersion := "2.13.14"

lazy val root = (project in file("."))
  .settings(
    name := "firstapp",
    libraryDependencies ++= Seq(
      "dev.zio" %% "zio" % "2.0.21",
      "dev.zio" %% "zio-http" % "3.0.0-RC6",
      "dev.zio" %% "zio-json" % "0.6.2",
      "org.mindrot" % "jbcrypt" % "0.4"
    )
  )
