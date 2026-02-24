import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

interface NodeProps {
  data: {
    label: string
  }
  selected?: boolean
}

const EndNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[150px]
        ${selected ? 'border-red-500 shadow-lg' : 'border-gray-300'}
        bg-white
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500"
      />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500">结束节点</div>
        </div>
      </div>
    </div>
  )
})

EndNode.displayName = 'EndNode'

export { EndNode }
