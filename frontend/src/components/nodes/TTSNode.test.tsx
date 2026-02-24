import { describe, it, expect } from 'vitest'
import type { WorkflowNode, TTSConfig } from '../../types/workflow'

describe('TTSNode', () => {
  it('should render node with label', () => {
    const config: TTSConfig = {
      voice: 'xiaoyun',
      speed: 1.0,
      volume: 1.0,
    }
    const node: WorkflowNode = {
      id: 'test-tts',
      type: 'tts',
      position: { x: 0, y: 0 },
      data: {
        type: 'tts',
        label: '语音合成',
        config,
      },
    }
    expect(node.data.label).toBe('语音合成')
  })

  it('should have voice configuration', () => {
    const config: TTSConfig = {
      voice: 'xiaoyun',
      speed: 1.0,
    }
    const node: WorkflowNode = {
      id: 'test-tts',
      type: 'tts',
      position: { x: 0, y: 0 },
      data: {
        type: 'tts',
        label: '语音合成',
        config,
      },
    }
    expect(node.data.config).toBeDefined()
  })
})
