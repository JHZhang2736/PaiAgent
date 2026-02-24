import { useState, useEffect, useRef } from 'react'
import { useWorkflowStore } from '../store/workflowStore'
import type { LogEntry } from '../types/workflow'

interface DebugDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function DebugDrawer({ isOpen, onClose }: DebugDrawerProps) {
  const [input, setInput] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const { nodes } = useWorkflowStore()

  useEffect(() => {
    if (isOpen) {
      setLogs([])
      setAudioUrl(null)
    }
  }, [isOpen])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const handleExecute = async () => {
    if (!input.trim() || isExecuting) return

    setIsExecuting(true)
    setLogs([])

    // Simulate execution with mock logs
    const mockLogs: LogEntry[] = [
      { nodeId: 'start', status: 'running', message: '开始执行工作流...', timestamp: new Date().toISOString() },
    ]
    setLogs([...mockLogs])

    // Simulate each node execution
    const nodeOrder = ['user-input', 'llm', 'tts', 'end']

    for (const nodeType of nodeOrder) {
      const node = nodes.find(n => n.type === nodeType)
      if (!node) continue

      await new Promise(resolve => setTimeout(resolve, 500))

      const log: LogEntry = {
        nodeId: node.id,
        status: 'completed',
        message: `节点 "${node.data.label}" 执行完成`,
        timestamp: new Date().toISOString(),
      }
      setLogs(prev => [...prev, log])
    }

    // Mock audio URL
    setAudioUrl('https://example.com/audio.mp3')

    setLogs(prev => [...prev, {
      nodeId: 'end',
      status: 'completed',
      message: '工作流执行完成',
      timestamp: new Date().toISOString(),
    }])

    setIsExecuting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">调试面板</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-b">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          输入测试文本
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入要测试的文本..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <button
          onClick={handleExecute}
          disabled={isExecuting || !input.trim()}
          className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isExecuting ? '执行中...' : '执行工作流'}
        </button>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">执行日志</h4>
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm ${
                log.status === 'running' ? 'bg-blue-50 text-blue-700' :
                log.status === 'completed' ? 'bg-green-50 text-green-700' :
                log.status === 'failed' ? 'bg-red-50 text-red-700' :
                'bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  log.status === 'running' ? 'bg-blue-500 animate-pulse' :
                  log.status === 'completed' ? 'bg-green-500' :
                  log.status === 'failed' ? 'bg-red-500' :
                  'bg-gray-400'
                }`} />
                <span>{log.message}</span>
              </div>
              {log.timestamp && (
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">生成的音频</h4>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
            您的浏览器不支持音频播放
          </audio>
        </div>
      )}
    </div>
  )
}
