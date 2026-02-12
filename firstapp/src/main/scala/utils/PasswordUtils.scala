package utils

import org.mindrot.jbcrypt.BCrypt

object PasswordUtils {

  def hashPassword(password: String): String =
    BCrypt.hashpw(password, BCrypt.gensalt())

  def verifyPassword(password: String, hashed: String): Boolean =
    BCrypt.checkpw(password, hashed)
}
