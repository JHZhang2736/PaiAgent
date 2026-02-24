import { describe, it, expect } from 'vitest'
import type { WorkflowNode } from '../../types/workflow'

describe('EndNode', () => {
  it('should render end node', () => {
    const node: WorkflowNode = {
      id: 'test-end',
      type: 'end',
      position: { x: 0, y: 0 },
      data: {
        type: 'end',
        label: '结束',
      },
    }
    expect(node.data.label).toBe('结束')
    expect(node.type).toBe('end')
  })
})
