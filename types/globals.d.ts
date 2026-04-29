import { User } from "./user";

declare module "*.css";

declare global {
  interface CustomJWTSession extends User {}
}
