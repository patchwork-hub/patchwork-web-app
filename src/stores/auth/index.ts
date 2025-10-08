import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";

export const setToken = (
  token: string,
  { isSignup }: { isSignup?: boolean }
) => {
  if (typeof window === "undefined") return;
  const cipherText = AES.encrypt(JSON.stringify(token), "token").toString();
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);
  Cookies.set("token", cipherText, { expires });
  if (isSignup) {
    Cookies.set("isSignup", "true");
  }
};

export const getToken = (): string | false => {
  if (typeof window === "undefined") return false;
  const session = Cookies.get("token");
  if (session === undefined) {
    return false;
  }
  const bytes = AES.decrypt(session, "token");
  try {
    const decryptedData = JSON.parse(bytes.toString(Utf8));
    return decryptedData;
  } catch (err) {
    console.error("Decryption error:", err);
    return false;
  }
};

export type ChangeEmailProps = {
  newAccessToken?: string;
  oldEmail: string;
  newEmail: string;
  currentPassword?: string;
}

export const setNewEmail = ({
  newAccessToken,
  oldEmail,
  newEmail,
  currentPassword
}: ChangeEmailProps) => {
  if (typeof window === "undefined") return;
   let hashedPassword: string | undefined = undefined;
  if (currentPassword) {
    const salt = bcrypt.genSaltSync(12);
    hashedPassword = bcrypt.hashSync(currentPassword, salt);
  }
   const cipherText = AES.encrypt(    
    JSON.stringify({ newAccessToken, oldEmail, newEmail, currentPassword: hashedPassword }),
    "newEmail"
  ).toString();
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);
  Cookies.set("newEmail", cipherText, { expires });
};

export const getNewEmail = (): ChangeEmailProps | false => {
  if (typeof window === "undefined") return false;
  const session = Cookies.get("newEmail");
  if (session === undefined) {
    return false;
  }
  const bytes = AES.decrypt(session, "newEmail");
  try {
    const decryptedData = JSON.parse(bytes.toString(Utf8));
    return decryptedData;
  } catch (err) {
    console.error("Decryption error:", err);
    return false;
  }
};

export const removeToken = () => {
  Cookies.remove("token");
  Cookies.remove("domain");
  Cookies.remove("newEmail");
  Cookies.remove("signup_step");
  Cookies.remove("isSignup");
};
