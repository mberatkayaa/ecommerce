import jwt from "jsonwebtoken";

export interface jwtPayload {
  email: string;
  _id: string;
  iat: number;
  exp: number;
}

export function getToken(email: string, _id: string) {
  const token = jwt.sign({ email, _id }, process.env.AUTH_SECRET!, {
    expiresIn: "30 days",
  });
  return token;
}

export function decodeToken(token: string) {
  let decoded: jwtPayload | null;
  decoded = jwt.decode(token) as jwtPayload;
  console.log(decoded);
  if (decoded && decoded.exp) {
    const expiration = decoded.exp * 1000 - new Date().getTime();
    if (expiration <= 0) {
      decoded = null;
    }
  }
  return decoded;
}

export function verifyToken(token: string) {
  let result = false;
  try {
    const verifyResult = jwt.verify(token, process.env.AUTH_SECRET!);
    if (verifyResult) result = true;
  } catch (err) {
    console.log(err);
  }
  return result;
}
