import path from 'path';

import { RepresenterImpl } from '~src/representer/RepresenterImpl'
import { DirectoryInput } from '~src/input/DirectoryInput';
import { FileOutput } from '~src/output/processor/FileOutput';
import { Bootstrap } from '~src/utils/bootstrap';
import { readDir } from '~src/utils/fs';

function slashscape(a: string): string {
  return a.replace("\"", "\\\"")
}

// The bootstrap call uses the arguments passed to the process to figure out
// which exercise to target, where the input lives (directory input) and what
// execution options to set.
//
// batch -c two-fer ~/fixtures
//
// For example, if arguments are passed directly, the above will run the two-fer
// exercise representer for all the folders inside the two-fer fixture folder, 
// with console log output turned on
//
const { exercise, options, logger } = Bootstrap.call()

const representer = new RepresenterImpl()
const FIXTURES_ROOT = path.join(options.inputDir || path.join(__dirname, '..', 'test', 'fixtures'), exercise.slug)

/**
 * Pad the input `value` to `length` using the `padc` pad character
 *
 * @param {(string | number | bigint)} value
 * @param {number} [length=20]
 * @param {string} [padc=' ']
 * @returns {string} the padded string
 */
function pad(value: string | number | bigint, length: number = 20, padc: string = ' '): string {
  const pad = Array(length).fill(padc).join('')
  return (pad + value).slice(-length)
}

const DEFAULT_LINE_DATA =  {
  count: 0,
  comments: {
    unique: [] as string[],
    uniqueTemplates: [] as string[]
  },
  runtimes: {
    total: BigInt(0),
    average: BigInt(0),
    median: BigInt(0)
  }
}

logger.log(`=> start batch runner for ${exercise.slug}`)

readDir(FIXTURES_ROOT)
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  .then(async (fixtureDirs) => Promise.all(fixtureDirs.map(async (fixtureDir) => {
    try {
      const inputDir     = path.join(FIXTURES_ROOT, fixtureDir)
      const input        = new DirectoryInput(inputDir, exercise.slug)

      const fixtureStamp = process.hrtime.bigint()
      const analysis     = await representer.run(input)
      const runtime      = process.hrtime.bigint() - fixtureStamp

      const fixture      = fixtureDir

      const processable = analysis.toProcessable(options)

      if (options.dry) {
        await processable
      } else {
        await FileOutput(processable, { ...options, inputDir, output: './representation.txt' })
      }

      return { result: analysis, runtime, fixture }
    } catch (_ignore) {
      return undefined
    }
  }))
  )
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  .then((results) => results.filter(Boolean) as readonly { result: Output; runtime: bigint; fixture: string }[])
  .then(async (results) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const outputs = await Promise.all(results.map((r) => r.result.toProcessable(options)))

    process.stdout.write('\n\n')
    process.stdout.write(`
${outputs.map((output) => `INSERT INTO fixtures (track_slug, exercise_slug, representation, status, comments_data) VALUES ("javascript", "two-fer", "${slashscape(output)}", "refer", "{}"`).join("\n")}
    `)
  })
