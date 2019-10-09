import { AstParser } from "~src/AstParser"
import { RepresenterAstOutput } from "~src/output/RepresenterAstOutput"

import { Node } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree"
import { traverse } from 'eslint/lib/shared/traverser'
import { visitorKeys } from '@typescript-eslint/parser/dist/visitor-keys'

const DEFAULT_PARSER = new AstParser({ comment: false, loc: false, tokens: false, range: false }, 1)

export class RepresenterImpl implements Representer {
  public async run(input: Input): Promise<Output> {
    const [{ program }] = await DEFAULT_PARSER.parse(input)

    delete program.comments
    delete program.tokens
    delete program.loc
    delete program.range

    traverse(
      program, {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        enter(node: Node) {
          delete node.loc
          delete node.range
        },

        // Use typescript visitor keys (otherwise type annotations are not removed)
        visitorKeys
      }
    )

    return new RepresenterAstOutput(program)
  }
}