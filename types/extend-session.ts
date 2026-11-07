declare module "express-session" {
  export interface SessionData {
    username: string | null;
    userID: number | null;
  }
}
