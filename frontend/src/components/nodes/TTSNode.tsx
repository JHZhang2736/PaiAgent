import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNode } from '../../types/workflow'

const voiceLabels: Record<string, string> = {
  xiaoyun: '小云',
  xiaogang: '小刚',
  xiaoxian: '小仙',
  ruoxi: '若熙',
}

const TTSNode = memo(({ data, selected }: NodeProps<WorkflowNode>) => {
  const config = data.config
  const voice = config?.voice || 'xiaoyun'

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[180px]
        ${selected ? 'border-purple-500 shadow-lg' : 'border-gray-300'}
        bg-white
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500"
      />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500">
            声音: {voiceLabels[voice] || voice}
          </div>
        </div>
      </div>
    </div>
  )
})

TTSNode.displayName = 'TTSNode'

export { TTSNode }
