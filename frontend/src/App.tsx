import { ReactFlowProvider } from '@xyflow/react'
import WorkflowEditor from './components/WorkflowEditor'

function App() {
  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen bg-gray-50">
        <WorkflowEditor />
      </div>
    </ReactFlowProvider>
  )
}

export default App
