import { AstParser, Input } from '@exercism/static-analysis'
import type { Output, Representer } from '../interface'
import { RepresenterRewriteOutput } from '../output/RepresenterRewriteOutput'

export class RepresenterImpl implements Representer {
  public async run(input: Input): Promise<Output> {
    const [{ program }] = await AstParser.REPRESENTER.parse(input)
    return new RepresenterRewriteOutput(program)
  }
}
