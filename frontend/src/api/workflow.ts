import axios from 'axios'
import type { Workflow, WorkflowNode, WorkflowEdge, ExecutionLog } from '../types/workflow'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response types
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

// Workflow API
export const workflowApi = {
  /**
   * Get all workflows
   */
  async getAll(params?: { page?: number; size?: number; sort?: string }) {
    const response = await client.get<ApiResponse<PaginatedResponse<Workflow>>>('/workflow', { params })
    return response.data
  },

  /**
   * Get workflow by ID
   */
  async getById(id: number) {
    const response = await client.get<ApiResponse<Workflow>>(`/workflows/${id}`)
    return response.data
  },

  /**
   * Create a new workflow
   */
  async create(workflow: { name: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] }) {
    const response = await client.post<ApiResponse<Workflow>>('/workflows', workflow)
    return response.data
  },

  /**
   * Update an existing workflow
   */
  async update(id: number, workflow: { name?: string; nodes?: WorkflowNode[]; edges?: WorkflowEdge[] }) {
    const response = await client.put<ApiResponse<Workflow>>(`/workflows/${id}`, workflow)
    return response.data
  },

  /**
   * Delete a workflow
   */
  async delete(id: number) {
    const response = await client.delete<ApiResponse<null>>(`/workflows/${id}`)
    return response.data
  },
}

// Execution API
export const executionApi = {
  /**
   * Execute a workflow
   */
  async execute(workflowId: number, input: string) {
    const response = await client.post<ApiResponse<{ executionId: number; status: string }>>(
      `/workflows/${workflowId}/execute`,
      { input }
    )
    return response.data
  },

  /**
   * Get execution result
   */
  async getResult(executionId: number) {
    const response = await client.get<ApiResponse<ExecutionLog>>(`/executions/${executionId}`)
    return response.data
  },

  /**
   * Get execution history
   */
  async getHistory(params?: { workflowId?: number; page?: number; size?: number }) {
    const response = await client.get<ApiResponse<PaginatedResponse<ExecutionLog>>>('/executions', { params })
    return response.data
  },
}

// WebSocket for real-time execution logs
export class ExecutionWebSocket {
  private ws: WebSocket | null = null
  private executionId: number
  private onMessage: (data: ExecutionMessage) => void
  private onError: (error: Event) => void
  private onClose: () => void

  constructor(
    executionId: number,
    onMessage: (data: ExecutionMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ) {
    this.executionId = executionId
    this.onMessage = onMessage
    this.onError = onError || (() => {})
    this.onClose = onClose || (() => {})
  }

  connect() {
    const wsUrl = (import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080') + `/ws/execute?executionId=${this.executionId}`
    this.ws = new WebSocket(wsUrl)

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ExecutionMessage
        this.onMessage(data)
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    this.ws.onerror = (error) => {
      this.onError(error)
    }

    this.ws.onclose = () => {
      this.onClose()
    }
  }

  sendStart(input: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'START',
        executionId: this.executionId,
        input,
      }))
    }
  }

  close() {
    this.ws?.close()
  }
}

export interface ExecutionMessage {
  type: 'LOG' | 'OUTPUT' | 'COMPLETE' | 'ERROR' | 'START'
  executionId: number
  nodeId?: string
  nodeType?: string
  status?: 'RUNNING' | 'COMPLETED' | 'FAILED'
  message?: string
  output?: string
  audioUrl?: string
  error?: string
  timestamp: string
}

export default client
