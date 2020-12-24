import { AstParser } from '~src/AstParser'
import { RepresenterAstOutput } from '~src/output/RepresenterAstOutput'

import type { TSESTree } from '@typescript-eslint/typescript-estree'
import { simpleTraverse } from '@typescript-eslint/typescript-estree'

type Node = TSESTree.Node

const DEFAULT_PARSER = new AstParser(
  { comment: false, loc: false, tokens: false, range: false },
  1
)

export class RepresenterImpl implements Representer {
  public async run(input: Input): Promise<Output> {
    const [{ program }] = await DEFAULT_PARSER.parse(input)

    delete program.comments
    delete program.tokens
    // delete program.loc
    // delete program.range

    simpleTraverse(program, {
      enter(_: Node) {
        // delete node.loc
        // delete node.range
      },
    })

    return new RepresenterAstOutput(program)
  }
}
