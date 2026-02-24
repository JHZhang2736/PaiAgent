import { useEffect, useState } from 'react'
import { useWorkflowStore } from '../store/workflowStore'
import type { LLMConfig, TTSConfig, LLMProvider } from '../types/workflow'

const LLM_PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'qwen', label: '通义千问' },
]

const LLM_MODELS: Record<LLMProvider, string[]> = {
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  deepseek: ['deepseek-chat'],
  qwen: ['qwen-max', 'qwen-turbo', 'qwen-plus'],
}

const TTS_VOICES = [
  { value: 'xiaoyun', label: '小云' },
  { value: 'xiaogang', label: '小刚' },
  { value: 'xiaoxiao', label: '小晓' },
  { value: 'xiaoyi', label: '小艺' },
]

export default function NodeConfigPanel() {
  const { nodes, selectedNodeId, updateNodeData, setSelectedNodeId } = useWorkflowStore()
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  const [localLabel, setLocalLabel] = useState('')
  const [localPlaceholder, setLocalPlaceholder] = useState('')
  const [localProvider, setLocalProvider] = useState<LLMProvider>('openai')
  const [localModel, setLocalModel] = useState('')
  const [localApiKey, setLocalApiKey] = useState('')
  const [localTemperature, setLocalTemperature] = useState(0.7)
  const [localVoice, setLocalVoice] = useState('xiaoyun')
  const [localSpeed, setLocalSpeed] = useState(1.0)
  const [localVolume, setLocalVolume] = useState(1.0)

  useEffect(() => {
    if (selectedNode) {
      setLocalLabel(selectedNode.data.label || '')
      setLocalPlaceholder(selectedNode.data.placeholder || '')

      const config = selectedNode.data.config
      if (selectedNode.type === 'llm' && config) {
        const llmConfig = config as LLMConfig
        setLocalProvider(llmConfig.provider || 'openai')
        setLocalModel(llmConfig.model || 'gpt-4')
        setLocalApiKey(llmConfig.apiKey || '')
        setLocalTemperature(llmConfig.temperature ?? 0.7)
      } else if (selectedNode.type === 'tts' && config) {
        const ttsConfig = config as TTSConfig
        setLocalVoice(ttsConfig.voice || 'xiaoyun')
        setLocalSpeed(ttsConfig.speed ?? 1.0)
        setLocalVolume(ttsConfig.volume ?? 1.0)
      }
    }
  }, [selectedNode])

  const handleSave = () => {
    if (!selectedNode) return

    const updates: Record<string, unknown> = {
      label: localLabel,
    }

    if (selectedNode.type === 'user-input') {
      updates.placeholder = localPlaceholder
    } else if (selectedNode.type === 'llm') {
      updates.config = {
        provider: localProvider,
        model: localModel,
        apiKey: localApiKey,
        temperature: localTemperature,
      }
    } else if (selectedNode.type === 'tts') {
      updates.config = {
        voice: localVoice,
        speed: localSpeed,
        volume: localVolume,
      }
    }

    updateNodeData(selectedNode.id, updates)
  }

  const handleDelete = () => {
    if (!selectedNode) return
    useWorkflowStore.getState().removeNode(selectedNode.id)
    setSelectedNodeId(null)
  }

  if (!selectedNode) return null

  return (
    <div className="fixed left-16 top-0 bottom-0 w-80 bg-white shadow-lg border-r flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">节点配置</h3>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Node Type Badge */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
          {selectedNode.type === 'user-input' && '用户输入'}
          {selectedNode.type === 'llm' && 'AI对话'}
          {selectedNode.type === 'tts' && '语音合成'}
          {selectedNode.type === 'end' && '结束'}
        </span>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Common: Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            节点名称
          </label>
          <input
            type="text"
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User Input: Placeholder */}
        {selectedNode.type === 'user-input' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              占位符
            </label>
            <input
              type="text"
              value={localPlaceholder}
              onChange={(e) => setLocalPlaceholder(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* LLM: Provider */}
        {selectedNode.type === 'llm' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型提供商
              </label>
              <select
                value={localProvider}
                onChange={(e) => {
                  const provider = e.target.value as LLMProvider
                  setLocalProvider(provider)
                  setLocalModel(LLM_MODELS[provider][0])
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LLM_PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型
              </label>
              <select
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LLM_MODELS[localProvider].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="请输入API Key"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {localTemperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localTemperature}
                onChange={(e) => setLocalTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>精确</span>
                <span>平衡</span>
                <span>创意</span>
              </div>
            </div>
          </>
        )}

        {/* TTS: Voice */}
        {selectedNode.type === 'tts' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                声音
              </label>
              <select
                value={localVoice}
                onChange={(e) => setLocalVoice(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TTS_VOICES.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                语速: {localSpeed}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={localSpeed}
                onChange={(e) => setLocalSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>慢</span>
                <span>正常</span>
                <span>快</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                音量: {localVolume}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localVolume}
                onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        <button
          onClick={handleSave}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          保存配置
        </button>
        <button
          onClick={handleDelete}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          删除节点
        </button>
      </div>
    </div>
  )
}
