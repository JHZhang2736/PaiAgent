import { describe, it, expect } from 'vitest'
import type {
  NodeType,
  WorkflowNode,
  WorkflowEdge,
  Workflow,
  ExecutionLog,
  LLMConfig,
  TTSConfig,
} from './workflow'

describe('Workflow Types', () => {
  describe('NodeType', () => {
    it('should have valid node type values', () => {
      const validTypes: NodeType[] = ['user-input', 'llm', 'tts', 'end']
      validTypes.forEach(type => {
        expect(['user-input', 'llm', 'tts', 'end']).toContain(type)
      })
    })
  })

  describe('LLMConfig', () => {
    it('should validate LLM configuration', () => {
      const config: LLMConfig = {
        provider: 'openai',
        model: 'gpt-4',
        apiKey: 'test-key',
        temperature: 0.7,
      }
      expect(config.provider).toBe('openai')
      expect(config.model).toBe('gpt-4')
      expect(config.temperature).toBe(0.7)
    })

    it('should allow different LLM providers', () => {
      const providers = ['openai', 'deepseek', 'qwen'] as const
      providers.forEach(provider => {
        const config: LLMConfig = {
          provider,
          model: 'test-model',
          apiKey: 'test-key',
        }
        expect(config.provider).toBe(provider)
      })
    })
  })

  describe('TTSConfig', () => {
    it('should validate TTS configuration', () => {
      const config: TTSConfig = {
        voice: 'xiaoyun',
        speed: 1.0,
        volume: 1.0,
      }
      expect(config.voice).toBe('xiaoyun')
      expect(config.speed).toBe(1.0)
      expect(config.volume).toBe(1.0)
    })
  })

  describe('WorkflowNode', () => {
    it('should create a user-input node', () => {
      const node: WorkflowNode = {
        id: 'node-1',
        type: 'user-input',
        position: { x: 0, y: 0 },
        data: {
          label: '用户输入',
          placeholder: '请输入文本...',
        },
      }
      expect(node.id).toBe('node-1')
      expect(node.type).toBe('user-input')
      expect(node.data.label).toBe('用户输入')
    })

    it('should create an LLM node with config', () => {
      const node: WorkflowNode = {
        id: 'node-2',
        type: 'llm',
        position: { x: 100, y: 100 },
        data: {
          label: 'AI对话',
          config: {
            provider: 'openai',
            model: 'gpt-4',
            apiKey: 'test-key',
            temperature: 0.8,
          },
        },
      }
      expect(node.type).toBe('llm')
      expect(node.data.config?.provider).toBe('openai')
    })

    it('should create a TTS node', () => {
      const node: WorkflowNode = {
        id: 'node-3',
        type: 'tts',
        position: { x: 200, y: 200 },
        data: {
          label: '语音合成',
          config: {
            voice: 'xiaoyun',
            speed: 1.0,
          },
        },
      }
      expect(node.type).toBe('tts')
      expect(node.data.config?.voice).toBe('xiaoyun')
    })

    it('should create an end node', () => {
      const node: WorkflowNode = {
        id: 'node-4',
        type: 'end',
        position: { x: 300, y: 300 },
        data: {
          label: '结束',
        },
      }
      expect(node.type).toBe('end')
    })
  })

  describe('WorkflowEdge', () => {
    it('should create a valid edge', () => {
      const edge: WorkflowEdge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
      }
      expect(edge.source).toBe('node-1')
      expect(edge.target).toBe('node-2')
    })

    it('should support edge with label', () => {
      const edge: WorkflowEdge = {
        id: 'edge-2',
        source: 'node-2',
        target: 'node-3',
        label: '输出文本',
      }
      expect(edge.label).toBe('输出文本')
    })
  })

  describe('Workflow', () => {
    it('should create a complete workflow', () => {
      const workflow: Workflow = {
        id: 1,
        name: '测试工作流',
        nodes: [
          {
            id: 'node-1',
            type: 'user-input',
            position: { x: 0, y: 0 },
            data: { label: '输入' },
          },
          {
            id: 'node-2',
            type: 'llm',
            position: { x: 200, y: 0 },
            data: { label: 'AI', config: { provider: 'openai', model: 'gpt-4', apiKey: 'key' } },
          },
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2',
          },
        ],
      }
      expect(workflow.nodes).toHaveLength(2)
      expect(workflow.edges).toHaveLength(1)
    })
  })

  describe('ExecutionLog', () => {
    it('should validate execution log', () => {
      const log: ExecutionLog = {
        id: 1,
        workflowId: 1,
        input: '测试输入',
        output: '测试输出',
        status: 'success',
        logs: [
          { nodeId: 'node-1', status: 'completed', message: '节点1完成' },
          { nodeId: 'node-2', status: 'completed', message: '节点2完成' },
        ],
      }
      expect(log.status).toBe('success')
      expect(log.logs).toHaveLength(2)
    })
  })
})
