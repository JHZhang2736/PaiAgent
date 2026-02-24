import { describe, it, expect, beforeEach } from 'vitest'
import { useWorkflowStore, initializeWorkflow } from './workflowStore'
import type { WorkflowNode, WorkflowEdge, NodeType, LLMConfig, TTSConfig } from '../types/workflow'

describe('WorkflowStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useWorkflowStore.getState()
    store.clearWorkflow()
  })

  describe('initializeWorkflow', () => {
    it('should initialize with empty nodes and edges', () => {
      initializeWorkflow()

      const { nodes, edges } = useWorkflowStore.getState()
      expect(nodes).toHaveLength(0)
      expect(edges).toHaveLength(0)
    })
  })

  describe('addNode', () => {
    it('should add a user-input node', () => {
      const { addNode } = useWorkflowStore.getState()

      addNode('user-input', { x: 100, y: 100 })

      const { nodes } = useWorkflowStore.getState()
      expect(nodes).toHaveLength(1)
      expect(nodes[0].type).toBe('user-input')
      expect(nodes[0].data.label).toBe('用户输入')
    })

    it('should add an LLM node', () => {
      const { addNode } = useWorkflowStore.getState()

      addNode('llm', { x: 200, y: 200 })

      const { nodes } = useWorkflowStore.getState()
      expect(nodes).toHaveLength(1)
      expect(nodes[0].type).toBe('llm')
      expect(nodes[0].data.label).toBe('AI对话')
      expect(nodes[0].data.config).toBeDefined()
    })

    it('should add a TTS node', () => {
      const { addNode } = useWorkflowStore.getState()

      addNode('tts', { x: 300, y: 300 })

      const { nodes } = useWorkflowStore.getState()
      expect(nodes).toHaveLength(1)
      expect(nodes[0].type).toBe('tts')
      expect(nodes[0].data.label).toBe('语音合成')
    })

    it('should add an end node', () => {
      const { addNode } = useWorkflowStore.getState()

      addNode('end', { x: 400, y: 400 })

      const { nodes } = useWorkflowStore.getState()
      expect(nodes).toHaveLength(1)
      expect(nodes[0].type).toBe('end')
      expect(nodes[0].data.label).toBe('结束')
    })

    it('should generate unique node IDs', () => {
      const { addNode } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      addNode('llm', { x: 100, y: 100 })
      addNode('tts', { x: 200, y: 200 })

      const { nodes } = useWorkflowStore.getState()
      const ids = nodes.map(n => n.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(nodes.length)
    })
  })

  describe('removeNode', () => {
    it('should remove a node by id', () => {
      const { addNode, removeNode } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      const { nodes } = useWorkflowStore.getState()
      const nodeId = nodes[0].id

      removeNode(nodeId)

      expect(useWorkflowStore.getState().nodes).toHaveLength(0)
    })

    it('should also remove connected edges when removing node', () => {
      const { addNode, addEdge, removeNode } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      addNode('llm', { x: 200, y: 200 })
      const { nodes, edges } = useWorkflowStore.getState()

      addEdge(nodes[0].id, nodes[1].id)
      removeNode(nodes[0].id)

      const remainingEdges = useWorkflowStore.getState().edges
      expect(remainingEdges).toHaveLength(0)
    })
  })

  describe('updateNodeData', () => {
    it('should update node label', () => {
      const { addNode, updateNodeData } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      const { nodes } = useWorkflowStore.getState()
      const nodeId = nodes[0].id

      updateNodeData(nodeId, { label: '新标签' })

      expect(useWorkflowStore.getState().nodes[0].data.label).toBe('新标签')
    })

    it('should update LLM config', () => {
      const { addNode, updateNodeData } = useWorkflowStore.getState()

      addNode('llm', { x: 0, y: 0 })
      const { nodes } = useWorkflowStore.getState()
      const nodeId = nodes[0].id

      const newConfig: LLMConfig = {
        provider: 'deepseek',
        model: 'deepseek-chat',
        apiKey: 'new-key',
        temperature: 0.5,
      }
      updateNodeData(nodeId, { config: newConfig })

      const updatedNode = useWorkflowStore.getState().nodes[0]
      expect(updatedNode.data.config).toEqual(newConfig)
    })
  })

  describe('addEdge', () => {
    it('should add an edge between two nodes', () => {
      const { addNode, addEdge } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      addNode('llm', { x: 200, y: 200 })
      const { nodes } = useWorkflowStore.getState()

      addEdge(nodes[0].id, nodes[1].id)

      const { edges } = useWorkflowStore.getState()
      expect(edges).toHaveLength(1)
      expect(edges[0].source).toBe(nodes[0].id)
      expect(edges[0].target).toBe(nodes[1].id)
    })

    it('should not allow duplicate edges', () => {
      const { addNode, addEdge } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      addNode('llm', { x: 200, y: 200 })
      const { nodes } = useWorkflowStore.getState()

      addEdge(nodes[0].id, nodes[1].id)
      addEdge(nodes[0].id, nodes[1].id)

      const { edges } = useWorkflowStore.getState()
      expect(edges).toHaveLength(1)
    })
  })

  describe('removeEdge', () => {
    it('should remove an edge', () => {
      const { addNode, addEdge, removeEdge } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      addNode('llm', { x: 200, y: 200 })
      const { nodes, edges } = useWorkflowStore.getState()

      addEdge(nodes[0].id, nodes[1].id)
      const edgeId = useWorkflowStore.getState().edges[0].id

      removeEdge(edgeId)

      expect(useWorkflowStore.getState().edges).toHaveLength(0)
    })
  })

  describe('clearWorkflow', () => {
    it('should clear all nodes and edges', () => {
      const { addNode, addEdge, clearWorkflow } = useWorkflowStore.getState()

      addNode('user-input', { x: 0, y: 0 })
      addNode('llm', { x: 200, y: 200 })
      const { nodes } = useWorkflowStore.getState()
      addEdge(nodes[0].id, nodes[1].id)

      clearWorkflow()

      const state = useWorkflowStore.getState()
      expect(state.nodes).toHaveLength(0)
      expect(state.edges).toHaveLength(0)
    })
  })

  describe('workflowName', () => {
    it('should set and get workflow name', () => {
      const { setWorkflowName, workflowName } = useWorkflowStore.getState()

      setWorkflowName('我的工作流')

      expect(useWorkflowStore.getState().workflowName).toBe('我的工作流')
    })
  })
})
