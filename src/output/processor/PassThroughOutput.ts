import type { OutputProcessor } from '../../interface'

export const PassThroughOutput: OutputProcessor = async (previous) => {
  return previous
}
