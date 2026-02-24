import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNode } from '../../types/workflow'

const UserInputNode = memo(({ data, selected }: NodeProps<WorkflowNode>) => {
  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[180px]
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'}
        bg-white
      `}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500">用户输入节点</div>
        </div>
      </div>
    </div>
  )
})

UserInputNode.displayName = 'UserInputNode'

export { UserInputNode }
