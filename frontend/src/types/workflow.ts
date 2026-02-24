// Node type definitions
export type NodeType = 'user-input' | 'llm' | 'tts' | 'end'

// LLM provider types
export type LLMProvider = 'openai' | 'deepseek' | 'qwen'

// LLM configuration
export interface LLMConfig {
  provider: LLMProvider
  model: string
  apiKey: string
  temperature?: number
  maxTokens?: number
}

// TTS configuration
export interface TTSConfig {
  voice: string
  speed?: number
  volume?: number
}

// Workflow node data (flexible type for React Flow)
export interface WorkflowNodeData {
  type: NodeType
  label: string
  placeholder?: string
  config?: LLMConfig | TTSConfig
  [key: string]: unknown
}

// Workflow node
export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: WorkflowNodeData
  selected?: boolean
}

// Workflow edge
export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

// Workflow definition
export interface Workflow {
  id: number
  name: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt?: string
  updatedAt?: string
}

// Execution log entry
export interface LogEntry {
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  message: string
  timestamp?: string
}

// Execution log
export interface ExecutionLog {
  id: number
  workflowId: number
  input: string
  output?: string
  audioUrl?: string
  status: 'pending' | 'running' | 'success' | 'failed'
  logs: LogEntry[]
  createdAt?: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
