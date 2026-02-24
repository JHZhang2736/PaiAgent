import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange, type Connection } from '@xyflow/react'
import type { WorkflowNode, WorkflowEdge, NodeType, LLMConfig, TTSConfig } from '../types/workflow'

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  workflowName: string
  selectedNodeId: string | null

  // Actions
  initializeWorkflow: () => void
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (type: NodeType, position: { x: number; y: number }) => void
  removeNode: (nodeId: string) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode['data']>) => void
  addEdge: (source: string, target: string, label?: string) => void
  removeEdge: (edgeId: string) => void
  clearWorkflow: () => void
  setWorkflowName: (name: string) => void
  setSelectedNodeId: (nodeId: string | null) => void
}

// Generate unique ID
let nodeIdCounter = 1
const generateNodeId = (type: NodeType) => `${type}-${nodeIdCounter++}`

// Default configurations for each node type
const getDefaultNodeData = (type: NodeType): WorkflowNode['data'] => {
  switch (type) {
    case 'user-input':
      return { label: '用户输入', placeholder: '请输入文本...' }
    case 'llm':
      return {
        label: 'AI对话',
        config: {
          provider: 'openai',
          model: 'gpt-4',
          apiKey: '',
          temperature: 0.7,
        } as LLMConfig,
      }
    case 'tts':
      return {
        label: '语音合成',
        config: {
          voice: 'xiaoyun',
          speed: 1.0,
          volume: 1.0,
        } as TTSConfig,
      }
    case 'end':
      return { label: '结束' }
    default:
      return { label: '节点' }
  }
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  workflowName: '未命名工作流',
  selectedNodeId: null,

  initializeWorkflow: () => {
    nodeIdCounter = 1
    set({
      nodes: [],
      edges: [],
      workflowName: '未命名工作流',
      selectedNodeId: null,
    })
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    })
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as WorkflowEdge[],
    })
  },

  onConnect: (connection) => {
    if (!connection.source || !connection.target) return

    const existingEdge = get().edges.find(
      (e) => e.source === connection.source && e.target === connection.target
    )
    if (existingEdge) return

    const newEdge: WorkflowEdge = {
      id: `edge-${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
    }
    set({ edges: [...get().edges, newEdge] })
  },

  addNode: (type, position) => {
    const newNode: WorkflowNode = {
      id: generateNodeId(type),
      type,
      position,
      data: getDefaultNodeData(type),
    }
    set({ nodes: [...get().nodes, newNode] })
  },

  removeNode: (nodeId) => {
    const { nodes, edges } = get()
    set({
      nodes: nodes.filter((n) => n.id !== nodeId),
      edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })
    if (get().selectedNodeId === nodeId) {
      set({ selectedNodeId: null })
    }
  },

  updateNodeData: (nodeId, data) => {
    const { nodes } = get()
    set({
      nodes: nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })
  },

  addEdge: (source, target, label) => {
    const existingEdge = get().edges.find(
      (e) => e.source === source && e.target === target
    )
    if (existingEdge) return

    const newEdge: WorkflowEdge = {
      id: `edge-${source}-${target}`,
      source,
      target,
      label,
    }
    set({ edges: [...get().edges, newEdge] })
  },

  removeEdge: (edgeId) => {
    set({ edges: get().edges.filter((e) => e.id !== edgeId) })
  },

  clearWorkflow: () => {
    nodeIdCounter = 1
    set({ nodes: [], edges: [], workflowName: '未命名工作流', selectedNodeId: null })
  },

  setWorkflowName: (name) => set({ workflowName: name }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
}))

// Re-export for convenience
export const initializeWorkflow = () => useWorkflowStore.getState().initializeWorkflow()
