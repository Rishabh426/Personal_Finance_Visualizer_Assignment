import type mongoose from "mongoose"

declare global {
  var mongooseInstance: {
    conn: typeof mongoose | any
    promise: Promise<typeof mongoose> | null
  }
}
