import { spawnSync } from 'child_process'
import { lstat, mkdtempSync, readFileSync, unlink } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'

import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree'

const root = resolve(__dirname, '..')
const fixtures = resolve(__dirname, 'fixtures')
const bin = resolve(root, 'bin')
const run = resolve(bin, 'run.sh')

describe('javascript-representer', () => {
  describe('capable of running this test suite', () => {
    test('it has bash', () => {
      const spawned = spawnSync('which', ['bash'], { stdio: 'pipe' })
      expect(spawned.status).toBe(0)
    })
  })

  describe('passing solution', () => {
    const representationPath = join(
      fixtures,
      'two-fer',
      'pass',
      'representation.txt'
    )
    const mappingPath = join(fixtures, 'two-fer', 'pass', 'mapping.json')

    afterEach(() => {
      unlink(representationPath, () => {
        /* noop */
      })

      unlink(mappingPath, () => {
        /* noop */
      })
    })

    test('can represent', () => {
      const spawned = spawnSync(
        'bash',
        [run, 'two-fer', join(fixtures, 'two-fer', 'pass')],
        {
          stdio: 'pipe',
          cwd: root,
        }
      )

      if (spawned.stderr?.length) {
        console.warn('Did not expect anything logged to stderr.')
        console.warn(spawned.stderr.toString())
      }

      expect(spawned.status).toBe(0)
    })

    test('generates a representation.txt', () => {
      spawnSync('bash', [run, 'two-fer', join(fixtures, 'two-fer', 'pass')], {
        stdio: 'pipe',
        cwd: root,
      })

      return new Promise((resolve, reject) => {
        lstat(representationPath, (err, _) => {
          expect(err).toBeNull()

          const result = JSON.parse(readFileSync(representationPath).toString())

          expect(result.type).toBe(AST_NODE_TYPES.Program)
          expect(result.body).not.toBeUndefined()
          expect(result.sourceType).toBe('module')

          if (err) {
            reject(err)
          } else {
            resolve('')
          }
        })
      })
    })

    test('generates a mapping.json', () => {
      spawnSync('bash', [run, 'two-fer', join(fixtures, 'two-fer', 'pass')], {
        stdio: 'pipe',
        cwd: root,
      })

      return new Promise((resolve, reject) => {
        lstat(mappingPath, (err, _) => {
          expect(err).toBeNull()

          const tokens = ['twoFer', 'name']
          const result = JSON.parse(readFileSync(mappingPath).toString())

          expect(typeof result).toBe('object')
          expect(result).not.toBeNull()

          const actualTokens = Object.values(result)

          tokens.forEach((identifier) => {
            expect(actualTokens).toContain(identifier)
          })

          if (err) {
            reject(err)
          } else {
            resolve('')
          }
        })
      })
    })

    test('generates a representation.txt at the correct location', () => {
      const outputDir = mkdtempSync(join(tmpdir(), 'foo-'))

      spawnSync(
        'bash',
        [run, 'clock', join(fixtures, 'clock', 'pass'), outputDir],
        {
          stdio: 'pipe',
          cwd: root,
        }
      )

      return new Promise((resolve, reject) => {
        lstat(join(outputDir, 'representation.txt'), (err, _) => {
          expect(err).toBeNull()

          if (err) {
            reject(err)
          } else {
            resolve('')
          }
        })
      })
    })

    test('generates a mapping.json at the correct location', () => {
      const outputDir = mkdtempSync(join(tmpdir(), 'foo-'))

      spawnSync(
        'bash',
        [run, 'clock', join(fixtures, 'clock', 'pass'), outputDir],
        {
          stdio: 'pipe',
          cwd: root,
        }
      )

      return new Promise((resolve, reject) => {
        lstat(join(outputDir, 'mapping.json'), (err, _) => {
          expect(err).toBeNull()

          if (err) {
            reject(err)
          } else {
            resolve('')
          }
        })
      })
    })
  })

  describe('failing solution (tests)', () => {
    const representationPath = join(
      fixtures,
      'two-fer',
      'fail',
      'representation.txt'
    )
    const mappingPath = join(fixtures, 'two-fer', 'fail', 'mapping.json')

    afterEach(() => {
      unlink(representationPath, () => {
        /* noop */
      })

      unlink(mappingPath, () => {
        /* noop */
      })
    })

    test('can represent', () => {
      const spawned = spawnSync(
        'bash',
        [run, 'two-fer', join(fixtures, 'two-fer', 'fail')],
        {
          stdio: 'pipe',
          cwd: root,
        }
      )

      // Even when the tests fail, the status should be 0
      expect(spawned.status).toBe(0)
    })

    test('generates a representation.txt', () => {
      spawnSync('bash', [run, 'two-fer', join(fixtures, 'two-fer', 'fail')], {
        stdio: 'pipe',
        cwd: root,
      })

      return new Promise((resolve, reject) => {
        lstat(representationPath, (err, _) => {
          expect(err).toBeNull()

          const result = JSON.parse(readFileSync(representationPath).toString())
          expect(result.type).toBe(AST_NODE_TYPES.Program)
          expect(result.body).not.toBeUndefined()
          expect(result.sourceType).toBe('module')

          if (err) {
            reject(err)
          } else {
            resolve('')
          }
        })
      })
    })

    test('generates a mapping.json', () => {
      spawnSync('bash', [run, 'two-fer', join(fixtures, 'two-fer', 'fail')], {
        stdio: 'pipe',
        cwd: root,
      })

      return new Promise((resolve, reject) => {
        lstat(mappingPath, (err, _) => {
          expect(err).toBeNull()

          const tokens = ['twoFer', 'console', 'debug', 'log', 'n']
          const result = JSON.parse(readFileSync(mappingPath).toString())

          expect(typeof result).toBe('object')
          expect(result).not.toBeNull()

          const actualTokens = Object.values(result)

          tokens.forEach((identifier) => {
            expect(actualTokens).toContain(identifier)
          })

          if (err) {
            reject(err)
          } else {
            resolve('')
          }
        })
      })
    })
  })

  describe('error solution (syntax)', () => {
    test('cannot represent', () => {
      const spawned = spawnSync(
        'bash',
        [run, 'two-fer', join(fixtures, 'two-fer', 'error', 'syntax')],
        {
          stdio: 'pipe',
          cwd: root,
        }
      )

      expect(spawned.status).not.toBe(0)
    })

    test('does not generate a representation.txt', () => {
      spawnSync(
        'bash',
        [run, 'two-fer', join(fixtures, 'two-fer', 'error', 'syntax')],
        {
          stdio: 'pipe',
          cwd: root,
        }
      )

      return new Promise((resolve, reject) => {
        const resultPath = join(
          fixtures,
          'two-fer',
          'error',
          'syntax',
          'representation.txt'
        )

        lstat(resultPath, (err, _) => {
          expect(err).not.toBeNull()

          if (err) {
            resolve('')
          } else {
            reject('Expected file to not exist, but it does')
          }
        })
      })
    })
  })
})
