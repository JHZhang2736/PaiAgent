import { useState } from 'react'
import type { NodeType, Workflow } from '../types/workflow'
import { workflowApi } from '../api/workflow'
import { useWorkflowStore } from '../store/workflowStore'

interface NodeItem {
  type: NodeType
  label: string
  icon: React.ReactNode
  color: string
}

const nodeItems: NodeItem[] = [
  {
    type: 'user-input',
    label: '用户输入',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'bg-blue-500',
  },
  {
    type: 'llm',
    label: 'AI对话',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-green-500',
  },
  {
    type: 'tts',
    label: '语音合成',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    color: 'bg-purple-500',
  },
  {
    type: 'end',
    label: '结束',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: 'bg-red-500',
  },
]

export default function Sidebar() {
  const [showWorkflows, setShowWorkflows] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    setNodes,
    setEdges,
    setWorkflowName,
    clearWorkflow,
  } = useWorkflowStore()

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const loadWorkflows = async () => {
    setIsLoading(true)
    try {
      const response = await workflowApi.getAll({ page: 0, size: 20 })
      if (response.success && response.data) {
        setWorkflows(response.data.content)
      }
    } catch (error) {
      console.error('Failed to load workflows:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadWorkflow = async (workflowId: number) => {
    try {
      const response = await workflowApi.getById(workflowId)
      if (response.success && response.data) {
        setNodes(response.data.nodes)
        setEdges(response.data.edges)
        setWorkflowName(response.data.name)
        setShowWorkflows(false)
      }
    } catch (error) {
      console.error('Failed to load workflow:', error)
    }
  }

  const handleNewWorkflow = () => {
    clearWorkflow()
    setShowWorkflows(false)
  }

  const handleToggleWorkflows = () => {
    if (!showWorkflows) {
      loadWorkflows()
    }
    setShowWorkflows(!showWorkflows)
  }

  return (
    <div className="w-56 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">节点面板</h2>
        <p className="text-sm text-gray-500">拖拽节点到画布</p>
      </div>

      {/* Workflow List / New */}
      <div className="p-4 border-b space-y-2">
        <button
          onClick={handleToggleWorkflows}
          className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-sm font-medium">我的工作流</span>
          </span>
          <svg className={`w-4 h-4 transition-transform ${showWorkflows ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showWorkflows && (
          <div className="space-y-1 mt-2">
            <button
              onClick={handleNewWorkflow}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              + 新建工作流
            </button>
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">加载中...</div>
            ) : workflows.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">暂无工作流</div>
            ) : (
              workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => handleLoadWorkflow(workflow.id)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg truncate"
                >
                  {workflow.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Node List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {nodeItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-white`}>
              {item.icon}
            </div>
            <span className="font-medium text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
