import { InlineInput } from '@exercism/static-analysis'
import type { Output, Representer } from '~src/interface'

type RepresenterFactory = () => Representer
type represent = (solutionContent: string) => Promise<Output>

export function makeAnalyze(RepresenterFactory: RepresenterFactory): represent {
  return async function (solutionContent: string): Promise<Output> {
    const representer = RepresenterFactory()
    const input = new InlineInput([solutionContent])

    return representer.run(input)
  }
}
