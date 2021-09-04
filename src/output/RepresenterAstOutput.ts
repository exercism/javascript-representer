import type { TSESTree } from '@typescript-eslint/typescript-estree'
import {
  AST_NODE_TYPES,
  simpleTraverse,
} from '@typescript-eslint/typescript-estree'
import type { ExecutionOptions, Output } from '../interface'

type Program = TSESTree.Program
type Node = TSESTree.Node

export class RepresenterAstOutput implements Output {
  constructor(public readonly representation: Program) {}

  public toProcessable(
    options?: Pick<ExecutionOptions, 'pretty'>
  ): Promise<{ representation: string; mapping: string }> {
    const spaces = options && options.pretty ? 2 : 0

    const normalized = normalizeRepresentation(this.representation)
    const representation = JSON.stringify(
      normalized.representation,
      undefined,
      spaces
    )
    const mapping = JSON.stringify(normalized.mapping, undefined, spaces)

    return Promise.resolve({ representation, mapping })
  }
}

function normalizeRepresentation(representation: Readonly<Program>): {
  representation: Program
  mapping: { [k: string]: string }
} {
  const mapping: { [k: string]: string } = {}

  simpleTraverse(representation, {
    enter(node: Node) {
      switch (node.type) {
        case AST_NODE_TYPES.Identifier: {
          node.name = findOrMapIdentifier(node.name, mapping)
        }
      }
    },
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

function inverseMapping(mapping: { [k: string]: string }): {
  [k: string]: string
} {
  return Object.keys(mapping).reduce((result, original) => {
    const mapped = mapping[original]
    result[mapped] = original
    return result
  }, {} as { [k: string]: string })
}
