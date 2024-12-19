export type { ByProjectKeyRequestBuilder as ApiRoot } from "@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder";
export type { ByProjectKeyRequestBuilder as ImportApiRoot } from "@commercetools/importapi-sdk/dist/declarations/src/generated/client/by-project-key-request-builder";

export interface Response {
    statusCode: number;
    message: string;
    data?: any;
}
