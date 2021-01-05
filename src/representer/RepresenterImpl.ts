import { AstParser } from '@exercism/static-analysis/dist/AstParser'
import { Input } from '@exercism/static-analysis/dist/input/Input'

import type { Output, Representer } from '../interface'
import { RepresenterAstOutput } from '../output/RepresenterAstOutput'

export class RepresenterImpl implements Representer {
  public async run(input: Input): Promise<Output> {
    const [{ program }] = await AstParser.REPRESENTER.parse(input)
    return new RepresenterAstOutput(program)
  }
}
