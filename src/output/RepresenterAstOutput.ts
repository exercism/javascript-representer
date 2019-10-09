import { Program } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

export class RepresenterAstOutput implements Output {
  constructor(public readonly representation: Program) {}

  public toProcessable(options?: Pick<ExecutionOptions, 'pretty'>): Promise<string> {
    const spaces = options && options.pretty ? 2 : 0
    const output = JSON.stringify(this.representation, undefined, spaces)
    return Promise.resolve(output)
  }
}
