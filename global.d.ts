import mongoose from "mongoose";

declare module "*.css";

declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
      }
    | undefined;
}

export {};
