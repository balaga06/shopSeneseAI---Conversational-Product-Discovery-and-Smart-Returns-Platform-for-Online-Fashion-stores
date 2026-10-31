import bcrypt
import getpass

password = getpass.getpass("Enter new password: ")

password_bytes = password.encode("utf-8")

hashed_password = bcrypt.hashpw(
    password_bytes,
    bcrypt.gensalt()
)

print("\nBCRYPT HASH:")
print(hashed_password.decode("utf-8"))