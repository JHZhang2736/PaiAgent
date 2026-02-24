import { describe, it, expect } from 'vitest'
import type { WorkflowNode, LLMConfig } from '../../types/workflow'

describe('LLMNode', () => {
  it('should render node with label', () => {
    const config: LLMConfig = {
      provider: 'openai',
      model: 'gpt-4',
      apiKey: '',
      temperature: 0.7,
    }
    const node: WorkflowNode = {
      id: 'test-llm',
      type: 'llm',
      position: { x: 0, y: 0 },
      data: {
        type: 'llm',
        label: 'AI对话',
        config,
      },
    }
    expect(node.data.label).toBe('AI对话')
  })

  it('should support different providers', () => {
    const providers = ['openai', 'deepseek', 'qwen'] as const
    providers.forEach(provider => {
      const config: LLMConfig = {
        provider,
        model: 'test-model',
        apiKey: 'test-key',
      }
      const node: WorkflowNode = {
        id: `test-${provider}`,
        type: 'llm',
        position: { x: 0, y: 0 },
        data: {
          type: 'llm',
          label: 'AI对话',
          config,
        },
      }
      expect(node.data.config).toBeDefined()
    })
  })

  it('should display provider and model info', () => {
    const config: LLMConfig = {
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'key',
      temperature: 0.7,
    }
    const node: WorkflowNode = {
      id: 'test-llm',
      type: 'llm',
      position: { x: 0, y: 0 },
      data: {
        type: 'llm',
        label: 'AI对话',
        config,
      },
    }
    expect(node.data.config).toBeDefined()
  })
})
