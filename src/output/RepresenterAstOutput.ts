import {
  Program,
  Node,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree'
import { traverse } from 'eslint/lib/shared/traverser'
import { visitorKeys } from '@typescript-eslint/parser/dist/visitor-keys'
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree'

export class RepresenterAstOutput implements Output {
  constructor(public readonly representation: Program) {}

  public toProcessable(
    options?: Pick<ExecutionOptions, 'pretty'>
  ): Promise<{ representation: string; mapping: string }> {
    const spaces = options && options.pretty ? 2 : 0

    const normalised = normaliseRepresentation(this.representation)
    const representation = JSON.stringify(
      normalised.representation,
      undefined,
      spaces
    )
    const mapping = JSON.stringify(normalised.mapping, undefined, spaces)

    return Promise.resolve({ representation, mapping })
  }
}

function normaliseRepresentation(
  representation: Readonly<Program>
): { representation: Program; mapping: { [k: string]: string } } {
  const mapping: { [k: string]: string } = {}

  traverse(representation, {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    enter(node: Node) {
      switch (node.type) {
        case AST_NODE_TYPES.Identifier: {
          node.name = findOrMapIdentifier(node.name, mapping)
        }
      }
    },

    visitorKeys,
  })

  return {
    representation: representation,
    mapping: inverseMapping(mapping),
  }
}

function findOrMapIdentifier(
  name: string,
  mapping: { [k: string]: string }
): string {
  if (mapping[name]) {
    return mapping[name]
  }

  mapping[name] = `IDENTIFIER_${Object.keys(mapping).length}`
  return mapping[name]
}

function inverseMapping(mapping: {
  [k: string]: string
}): { [k: string]: string } {
  return Object.keys(mapping).reduce(
    (result, original) => {
      const mapped = mapping[original]
      result[mapped] = original
      return result
    },
    {} as { [k: string]: string }
  )
}
