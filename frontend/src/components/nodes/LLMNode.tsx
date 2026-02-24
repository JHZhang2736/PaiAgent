import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNode } from '../../types/workflow'

const providerLabels: Record<string, string> = {
  openai: 'OpenAI',
  deepseek: 'DeepSeek',
  qwen: '通义千问',
}

const LLMNode = memo(({ data, selected }: NodeProps<WorkflowNode>) => {
  const config = data.config
  const provider = config?.provider || 'openai'
  const model = config?.model || ''

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[200px]
        ${selected ? 'border-green-500 shadow-lg' : 'border-gray-300'}
        bg-white
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500">
            {providerLabels[provider]} {model && `- ${model}`}
          </div>
        </div>
      </div>
    </div>
  )
})

LLMNode.displayName = 'LLMNode'

export { LLMNode }
