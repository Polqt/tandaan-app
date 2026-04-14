import { User } from "./user";

export {};

declare module "*.css";

declare global {
  interface CustomJWTSession extends User {}
}
