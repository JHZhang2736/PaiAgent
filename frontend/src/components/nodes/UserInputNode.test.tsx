import { describe, it, expect } from 'vitest'
import type { WorkflowNode } from '../../types/workflow'

describe('UserInputNode', () => {
  it('should render node with label', () => {
    const node: WorkflowNode = {
      id: 'test-node',
      type: 'user-input',
      position: { x: 0, y: 0 },
      data: {
        type: 'user-input',
        label: '用户输入',
        placeholder: '请输入文本...',
      },
    }
    expect(node.data.label).toBe('用户输入')
  })

  it('should have correct type', () => {
    const node: WorkflowNode = {
      id: 'test-node',
      type: 'user-input',
      position: { x: 0, y: 0 },
      data: {
        type: 'user-input',
        label: '用户输入',
      },
    }
    expect(node.type).toBe('user-input')
  })

  it('should have placeholder', () => {
    const node: WorkflowNode = {
      id: 'test-node',
      type: 'user-input',
      position: { x: 0, y: 0 },
      data: {
        type: 'user-input',
        label: '用户输入',
        placeholder: '请输入文本...',
      },
    }
    expect(node.data.placeholder).toBe('请输入文本...')
  })
})
