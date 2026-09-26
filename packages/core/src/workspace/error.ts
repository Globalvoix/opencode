import { Schema } from "effect"

export class Error extends Schema.TaggedError<Error>()("WorkspaceDriver.Error", {
  message: Schema.optional(Schema.String),
  cause: Schema.optional(Schema.Defect()),
}) {}

export class ProviderNotFound extends Schema.TaggedError<ProviderNotFound>()("WorkspaceDriver.ProviderNotFound", {
  provider: Schema.String,
}) {}

export * as WorkspaceDriverError from "./error.js"
