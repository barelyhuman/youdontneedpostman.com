declare module '@usebruno/converters' {
  export function postmanToBruno(col: unknown, opts: { useWorkers: boolean }): Promise<unknown>
  export function postmanToBrunoEnvironment(env: unknown): unknown
  export function insomniaToBruno(col: unknown): Promise<unknown>
  export function openApiToBruno(spec: unknown): Promise<unknown>
}
