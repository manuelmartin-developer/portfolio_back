import { encode, decode } from "jwt-simple";

export const generateToken = (code: number, email: string, role: string) => {
  const payload = {
    code,
    email,
    role
  };
  const token = encode(payload, process.env.JWT_KEY || "");
  return token;
};

export const decodeToken = (token: string) => {
  const decoded = decode(token, process.env.JWT_KEY || "");
  return decoded;
};
