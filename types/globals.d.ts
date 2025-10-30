import { User } from "./user";

export {};

declare global {
  interface CustomJWTSession extends User {}
}
