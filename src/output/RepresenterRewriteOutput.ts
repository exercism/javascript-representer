import type { TSESTree } from '@typescript-eslint/typescript-estree'
import {
  AST_NODE_TYPES,
  simpleTraverse,
} from '@typescript-eslint/typescript-estree'
import type { ExecutionOptions, Output } from '../interface'
import { generate } from 'astring'
import { getProcessLogger } from '@exercism/static-analysis'
import {
  RESERVED_NAMES,
  RESERVED_NAMES_ARRAY_STATIC,
  RESERVED_NAMES_DATE_STATIC,
  RESERVED_NAMES_MATH_STATIC,
  RESERVED_NAMES_NUMBER_STATIC,
  RESERVED_NAMES_OBJECT_STATIC,
  RESERVED_NAMES_STRING_STATIC,
} from './reserved'

type Program = TSESTree.Program
type Node = TSESTree.Node

export class RepresenterRewriteOutput implements Output {
  constructor(public readonly representation: Program) {}

  public toProcessable(
    options?: Pick<ExecutionOptions, 'pretty'>
  ): Promise<{ representation: string; mapping: string }> {
    const spaces = options && options.pretty ? 2 : 0
    getProcessLogger().log(JSON.stringify(this.representation, undefined, 2))
    const normalized = normalizeRepresentation(this.representation)

    const representation = generate(normalized.representation, {})
    const mapping = JSON.stringify(normalized.mapping, undefined, spaces)

    return Promise.resolve({ representation, mapping })
  }
}

function normalizeRepresentation(representation: Readonly<Program>): {
  representation: Program
  mapping: { [k: string]: string }
} {
  const mapping: { [k: string]: string } = {}
  const skip: TSESTree.Identifier[] = []

  simpleTraverse(representation, {
    enter(node: Node) {
      switch (node.type) {
        // Exported functions and classes do not need to be normalized because
        // they are... well exported. This makes them public API.
        //
        // The AST traversal is not smart enough to detect shadowed identifiers
        // but that is okay.
        case AST_NODE_TYPES.ExportNamedDeclaration: {
          switch (node.declaration?.type) {
            case AST_NODE_TYPES.ClassDeclaration: {
              if (node.declaration.id?.type) {
                mapping[node.declaration.id.name] = node.declaration.id.name
              }
              break
            }
            case AST_NODE_TYPES.FunctionDeclaration: {
              if (node.declaration.id?.type) {
                mapping[node.declaration.id.name] = node.declaration.id.name
              }
              break
            }
            case AST_NODE_TYPES.VariableDeclaration: {
              if (
                node.declaration.type === AST_NODE_TYPES.VariableDeclaration
              ) {
                node.declaration.declarations.forEach((declaration) => {
                  if (declaration.type === AST_NODE_TYPES.VariableDeclarator) {
                    if (declaration.id.type === AST_NODE_TYPES.Identifier) {
                      mapping[declaration.id.name] = declaration.id.name
                    }
                  }
                })
              }
            }
          }
          break
        }

        // The most common Global Object static methods and properties are
        // always safe to rename. This also helps with inspecting the
        // representation visually.
        case AST_NODE_TYPES.MemberExpression: {
          if (
            node.object.type === 'Identifier' &&
            node.property.type === 'Identifier'
          ) {
            switch (node.object.name) {
              case 'Array': {
                if (RESERVED_NAMES_ARRAY_STATIC.includes(node.property.name)) {
                  skip.push(node.object)
                  skip.push(node.property)
                }
                break
              }

              case 'Date': {
                if (RESERVED_NAMES_DATE_STATIC.includes(node.property.name)) {
                  skip.push(node.object)
                  skip.push(node.property)
                }
                break
              }

              case 'Math': {
                if (RESERVED_NAMES_MATH_STATIC.includes(node.property.name)) {
                  skip.push(node.object)
                  skip.push(node.property)
                }
                break
              }
              case 'Number': {
                if (RESERVED_NAMES_NUMBER_STATIC.includes(node.property.name)) {
                  skip.push(node.object)
                  skip.push(node.property)
                }
                break
              }
              case 'Object': {
                if (RESERVED_NAMES_OBJECT_STATIC.includes(node.property.name)) {
                  skip.push(node.object)
                  skip.push(node.property)
                }
                break
              }
              case 'String': {
                if (RESERVED_NAMES_STRING_STATIC.includes(node.property.name)) {
                  skip.push(node.object)
                  skip.push(node.property)
                }
                break
              }
            }
          }
          break
        }

        case AST_NODE_TYPES.Identifier: {
          if (!RESERVED_NAMES.includes(node.name)) {
            const index = skip.indexOf(node)
            if (index === -1) {
              node.name = findOrMapIdentifier(node.name, mapping)
            } else {
              skip.splice(index, 1)
            }
          }
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
    if (mapped.startsWith('IDENTIFIER_')) {
      result[mapped] = original
    }

    return result
  }, {} as { [k: string]: string })
}
