import type mongoose from "mongoose"

declare global {
  var mongooseInstance: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}