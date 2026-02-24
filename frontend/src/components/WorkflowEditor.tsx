import { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflowStore } from '../store/workflowStore'
import { nodeTypes } from './nodes'
import Sidebar from './Sidebar'
import DebugDrawer from './DebugDrawer'

export default function WorkflowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [isDebugDrawerOpen, setIsDebugDrawerOpen] = useState(false)

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    workflowName,
    setWorkflowName,
  } = useWorkflowStore()

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow') as 'user-input' | 'llm' | 'tts' | 'end'

      if (!type || !reactFlowInstance || !reactFlowWrapper.current) {
        return
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      addNode(type, position)
    },
    [reactFlowInstance, addNode]
  )

  const handleSave = useCallback(() => {
    const workflow = {
      name: workflowName,
      nodes,
      edges,
    }
    console.log('Save workflow:', workflow)
    // TODO: Call API to save workflow
  }, [workflowName, nodes, edges])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 bg-white border-b px-4 flex items-center justify-between">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-lg font-medium border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            placeholder="输入工作流名称"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setIsDebugDrawerOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              调试
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              保存
            </button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'user-input':
                    return '#3b82f6'
                  case 'llm':
                    return '#22c55e'
                  case 'tts':
                    return '#a855f7'
                  case 'end':
                    return '#ef4444'
                  default:
                    return '#9ca3af'
                }
              }}
            />
          </ReactFlow>
        </div>
      </div>

      {/* Debug Drawer */}
      <DebugDrawer
        isOpen={isDebugDrawerOpen}
        onClose={() => setIsDebugDrawerOpen(false)}
      />
    </div>
  )
}
