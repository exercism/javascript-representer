import fs from 'fs'
import path from 'path'
import type { ExecutionOptions } from '~src/interface'
import { FileOutput } from '~src/output/processor/FileOutput'

// jest.mock('fs')

const mockedFs = (fs as unknown) as MockedFs

function mockFiles(files: { [path: string]: string }): void {
  mockedFs.__setMockFiles(files)
}

function getWrittenFiles(): { [dir: string]: { [file: string]: string } } {
  return mockedFs.__getWrittenFiles()
}

const CONTENTS = `My Fine Output`
const MAPPING = `My mapping`

const DEFAULT_OPTIONS: Omit<
  ExecutionOptions,
  'outputDir' | 'inputDir' | 'output'
> = {
  debug: false,
  dry: false,
  console: false,
  exercise: '<no-exercise>',
  pretty: true,
}

// TODO: Mock seems broken, so skip this for now
describe.skip('FileOutput', () => {
  describe('when the output path is writable', () => {
    const OUT_OPTIONS: ExecutionOptions = {
      inputDir: '/path/to/input',
      outputDir: '/path/to/output',
      output: { representation: 'representation.out', mapping: 'mapping.json' },
      ...DEFAULT_OPTIONS,
    }

    beforeEach(() => {
      mockFiles({})
    })

    it("doesn't modify the previous stream", async () => {
      const processed = await FileOutput(
        Promise.resolve({
          representation: CONTENTS,
          mapping: MAPPING,
        }),
        OUT_OPTIONS
      )
      expect(processed).toStrictEqual({
        representation: CONTENTS,
        mapping: MAPPING,
      })
    })

    it('writes the processable stream to disk', async () => {
      await FileOutput(
        Promise.resolve({
          representation: CONTENTS,
          mapping: MAPPING,
        }),
        OUT_OPTIONS
      )
      const files = getWrittenFiles()
      expect(files).toMatchObject({
        [path.normalize(OUT_OPTIONS.outputDir)]: {
          [OUT_OPTIONS.output.representation]: CONTENTS,
          [OUT_OPTIONS.output.mapping]: MAPPING,
        },
      })
    })
  })

  describe('when the output path is not writable', () => {
    const OUT_OPTIONS: ExecutionOptions = {
      ...DEFAULT_OPTIONS,
      inputDir: '/path/to/input',
      outputDir: '/path/to/output',
      output: { representation: 'representation.out', mapping: 'mapping.json' },
    }

    beforeEach(() => {
      mockFiles({
        [path.join(
          OUT_OPTIONS.outputDir,
          OUT_OPTIONS.output.representation
        )]: 'Already Written',
      })
    })

    it('bubbles the unwritable error', async () => {
      return expect(
        FileOutput(
          Promise.resolve({ representation: CONTENTS, mapping: MAPPING }),
          OUT_OPTIONS
        )
      ).rejects.toMatchObject({
        errno: 47,
        code: 'EEXIST',
      })
    })
  })

  describe('when the output is absolute', () => {
    const OUT_OPTIONS: ExecutionOptions = {
      ...DEFAULT_OPTIONS,
      inputDir: '/not',
      outputDir: '/not',
      output: {
        representation: '/path/to/output/representation.out',
        mapping: 'mapping.json',
      },
    }

    beforeEach(() => {
      mockFiles({})
    })

    it('uses the output path only', async () => {
      await FileOutput(
        Promise.resolve({ representation: CONTENTS, mapping: MAPPING }),
        OUT_OPTIONS
      )
      const files = getWrittenFiles()

      const outFile = path.normalize(
        path.basename(OUT_OPTIONS.output.representation)
      )

      // Written at output
      expect(files).toMatchObject({
        [path.normalize(path.dirname(OUT_OPTIONS.output.representation))]: {
          [outFile]: CONTENTS,
        },
      })

      // Not written at not/path/to/output
      expect(files).not.toMatchObject({
        [path.normalize(OUT_OPTIONS.inputDir)]: {
          [outFile]: CONTENTS,
          [OUT_OPTIONS.output.mapping]: MAPPING,
        },
      })

      // Not written at combination of the two
      expect(files).not.toMatchObject({
        [path.normalize(
          path.join(
            OUT_OPTIONS.inputDir,
            path.dirname(OUT_OPTIONS.output.representation)
          )
        )]: {
          [outFile]: CONTENTS,
          [OUT_OPTIONS.output.mapping]: MAPPING,
        },
      })
    })
  })

  describe('when the output is relative', () => {
    const OUT_OPTIONS: ExecutionOptions = {
      ...DEFAULT_OPTIONS,
      inputDir: '/path/to/input',
      outputDir: '/path/to/output',
      output: { representation: 'representation.out', mapping: 'mapping.json' },
    }

    beforeEach(() => {
      mockFiles({})
    })

    it('uses the input dir to write the output file', async () => {
      await FileOutput(
        Promise.resolve({ representation: CONTENTS, mapping: MAPPING }),
        OUT_OPTIONS
      )
      const files = getWrittenFiles()

      // Written at input dir
      expect(files).toMatchObject({
        [path.normalize(OUT_OPTIONS.outputDir)]: {
          [OUT_OPTIONS.output.representation]: CONTENTS,
          [OUT_OPTIONS.output.mapping]: MAPPING,
        },
      })
    })
  })
})
