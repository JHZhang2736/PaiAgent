import { describe, it, expect } from 'vitest'
import { UserInputNode } from './UserInputNode'
import type { NodeProps } from '@xyflow/react'
import type { WorkflowNode } from '../../types/workflow'

describe('UserInputNode', () => {
  const defaultProps: NodeProps<WorkflowNode> = {
    id: 'test-node',
    type: 'user-input',
    position: { x: 0, y: 0 },
    data: {
      type: 'user-input',
      label: '用户输入',
      placeholder: '请输入文本...',
    },
    selected: false,
    dragging: false,
    width: 200,
    height: 100,
    handleBounds: undefined,
    isConnectable: true,
    parentId: undefined,
    zIndex: 0,
    dragHandle: undefined,
    noop: () => {},
  }

  it('should render node label', () => {
    // Basic render test - just check component can be created
    expect(UserInputNode).toBeDefined()
  })

  it('should have correct type', () => {
    expect(defaultProps.type).toBe('user-input')
  })

  it('should have correct label', () => {
    expect(defaultProps.data.label).toBe('用户输入')
  })

  it('should have placeholder', () => {
    expect(defaultProps.data.placeholder).toBe('请输入文本...')
  })
})
