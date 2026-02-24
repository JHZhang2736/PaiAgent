export { UserInputNode } from './UserInputNode'
export { LLMNode } from './LLMNode'
export { TTSNode } from './TTSNode'
export { EndNode } from './EndNode'

import { UserInputNode } from './UserInputNode'
import { LLMNode } from './LLMNode'
import { TTSNode } from './TTSNode'
import { EndNode } from './EndNode'

export const nodeTypes = {
  'user-input': UserInputNode,
  llm: LLMNode,
  tts: TTSNode,
  end: EndNode,
} as const
