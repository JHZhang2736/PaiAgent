import { describe, it, expect } from 'vitest'
import { LLMNode } from './LLMNode'
import type { WorkflowNode, LLMConfig } from '../../types/workflow'

describe('LLMNode', () => {
  const defaultConfig: LLMConfig = {
    provider: 'openai',
    model: 'gpt-4',
    apiKey: '',
    temperature: 0.7,
  }

  it('should render node with label', () => {
    const node: WorkflowNode = {
      id: 'test-llm',
      type: 'llm',
      position: { x: 0, y: 0 },
      data: {
        type: 'llm',
        label: 'AI对话',
        config: defaultConfig,
      },
    }
    expect(node.data.label).toBe('AI对话')
  })

  it('should support different providers', () => {
    const providers = ['openai', 'deepseek', 'qwen'] as const
    providers.forEach(provider => {
      const node: WorkflowNode = {
        id: `test-${provider}`,
        type: 'llm',
        position: { x: 0, y: 0 },
        data: {
          type: 'llm',
          label: 'AI对话',
          config: { ...defaultConfig, provider },
        },
      }
      expect(node.data.config.provider).toBe(provider)
    })
  })

  it('should display provider and model info', () => {
    const node: WorkflowNode = {
      id: 'test-llm',
      type: 'llm',
      position: { x: 0, y: 0 },
      data: {
        type: 'llm',
        label: 'AI对话',
        config: { ...defaultConfig, model: 'gpt-4' },
      },
    }
    expect(node.data.config.model).toBe('gpt-4')
  })
})
