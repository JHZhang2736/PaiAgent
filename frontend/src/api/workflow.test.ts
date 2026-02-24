import { describe, it, expect } from 'vitest'
import { workflowApi, executionApi, ExecutionWebSocket } from './workflow'

describe('workflowApi', () => {
  it('should have getAll method', () => {
    expect(workflowApi.getAll).toBeDefined()
    expect(typeof workflowApi.getAll).toBe('function')
  })

  it('should have getById method', () => {
    expect(workflowApi.getById).toBeDefined()
    expect(typeof workflowApi.getById).toBe('function')
  })

  it('should have create method', () => {
    expect(workflowApi.create).toBeDefined()
    expect(typeof workflowApi.create).toBe('function')
  })

  it('should have update method', () => {
    expect(workflowApi.update).toBeDefined()
    expect(typeof workflowApi.update).toBe('function')
  })

  it('should have delete method', () => {
    expect(workflowApi.delete).toBeDefined()
    expect(typeof workflowApi.delete).toBe('function')
  })
})

describe('executionApi', () => {
  it('should have execute method', () => {
    expect(executionApi.execute).toBeDefined()
    expect(typeof executionApi.execute).toBe('function')
  })

  it('should have getResult method', () => {
    expect(executionApi.getResult).toBeDefined()
    expect(typeof executionApi.getResult).toBe('function')
  })

  it('should have getHistory method', () => {
    expect(executionApi.getHistory).toBeDefined()
    expect(typeof executionApi.getHistory).toBe('function')
  })
})

describe('ExecutionWebSocket', () => {
  it('should be a class', () => {
    expect(ExecutionWebSocket).toBeDefined()
  })

  it('should accept constructor parameters', () => {
    const ws = new ExecutionWebSocket(
      1,
      () => {},
      () => {},
      () => {}
    )
    expect(ws).toBeDefined()
  })
})
