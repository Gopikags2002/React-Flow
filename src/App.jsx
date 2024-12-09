import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'react-flow-renderer';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'node 1' } },
  { id: '2', position: { x: 400, y: 100 }, data: { label: 'node 2' } },
  { id: '3', position: { x: 700, y: 100 }, data: { label: 'node 3' } },
  { id: '4', position: { x: 1000, y: 200 }, data: { label: 'node 4' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

const dropdownOptions = ['HTML', 'CSS', 'JS', 'React'];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState('');
  const [popupPosition, setPopupPosition] = useState();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodeClick = (event, node) => {
    const boundingRect = event.target.getBoundingClientRect();
    setSelectedNode(node);
    setInputValue(''); //  input field is empty when popup opens
    setDropdownValue('');
    setPopupPosition({ x: boundingRect.x + boundingRect.width / 2, y: boundingRect.y });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode?.id
            ? { ...node, data: { label: e.target.value } }
            : node
        )
      );
      handleClosePopup();
    }
  };

  const handleDropdownChange = (e) => {
    const newValue = e.target.value;
    setDropdownValue(newValue);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode?.id
          ? { ...node, data: { label: newValue } }
          : node
      )
    );
    handleClosePopup();
  };

  const handleClosePopup = () => {
    setSelectedNode(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>React Flow</h1>
      {selectedNode && (
        <div
          style={{
            position: 'absolute',
            top: popupPosition.y + 120,
            left: popupPosition.x - 150,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            boxShadow: '2px 2px 10px black',
            textAlign: 'center',
            zIndex: 100,
          }}
        >
          <h3>Settings</h3>
          <div style={{ margin: '10px 0px' }}>
            <label>Enter value</label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyPress}
              style={{
                marginLeft: '10px',
                padding: '5px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <h5>Or</h5>
          <div style={{ margin: '10px 0' }}>
            <label>Select value</label>
            <select
              value={dropdownValue}
              onChange={handleDropdownChange}
              style={{
                marginLeft: '10px',
                padding: '5px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select...</option>
              {dropdownOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClosePopup}
            style={{
              marginTop: '10px',
              padding: '10px',
              width: '100%',
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Close
          </button>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
}
