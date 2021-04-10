import {
  Logger,
  LoggerInput,
  setProcessLogger,
} from '@exercism/static-analysis'
import type { ExecutionOptions } from '~src/interface'
import { LogOutput } from '~src/output/processor/LogOutput'

const CONTENTS = `My Fine Output`
const MAPPING = `My Fine Mapping`

const TEST_LOGGER: Logger & { log: jest.MockInstance<void, [LoggerInput]> } = {
  error: jest.fn<void, [LoggerInput]>(),
  log: jest.fn<void, [LoggerInput]>(),
  fatal: jest.fn<never, [LoggerInput, number | undefined]>(),
}

const DEFAULT_OPTIONS: ExecutionOptions = {
  debug: false,
  dry: false,
  console: true,
  pretty: true,
  exercise: '<no-exercise>',
  output: { representation: '<no-output>', mapping: '<no-output>' },
  inputDir: '<no-input>',
  outputDir: '<no-dir>',
}

describe('LogOutput', () => {
  beforeEach(() => {
    TEST_LOGGER.log.mockClear()
    setProcessLogger(TEST_LOGGER)
  })

  it('logs the output', async () => {
    await LogOutput(
      Promise.resolve({ representation: CONTENTS, mapping: MAPPING }),
      DEFAULT_OPTIONS
    )
    expect(TEST_LOGGER.log).toHaveBeenCalled()
    expect(
      TEST_LOGGER.log.mock.calls.find((l) =>
        l.find((arg) => arg.toString().includes(CONTENTS))
      )
    ).toBeDefined()
    expect(
      TEST_LOGGER.log.mock.calls.find((l) =>
        l.find((arg) => arg.toString().includes(MAPPING))
      )
    ).toBeDefined()
  })

  it("doesn't modify the output", async () => {
    const result = await LogOutput(
      Promise.resolve({ representation: CONTENTS, mapping: MAPPING }),
      DEFAULT_OPTIONS
    )
    expect(result).toStrictEqual({ representation: CONTENTS, mapping: MAPPING })
  })
})
