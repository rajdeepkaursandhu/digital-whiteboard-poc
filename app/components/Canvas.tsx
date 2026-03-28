'use client';
import { useEffect, useState, useRef } from 'react';
import ItemWidget from './ItemWidget';

export default function Canvas() {
  const [boardId, setBoardId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pen Mode States
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawColor, setDrawColor] = useState('#4f46e5');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    fetch('/api/boards')
      .then(res => res.json())
      .then(board => {
        setBoardId(board.id);
        return fetch(`/api/items?boardId=${board.id}`);
      })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(console.error);
  }, []);

  const handleAddItem = async (type: string) => {
    if (!boardId) return;
    
    let content = '';
    let extraImageContent = '';
    
    if (type === 'TEXT') content = 'New Note';
    if (type === 'QUOTE') {
      try {
        const quoteRes = await fetch('/api/quote');
        const quoteData = await quoteRes.json();
        content = quoteData.quote || 'Inspiring quote here';
        extraImageContent = quoteData.imageUrl || '';
      } catch (e) {
        content = 'Failed to load quote from BrainyQuote';
      }
    }

    const newItem = {
      boardId,
      type,
      content,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      width: 250,
      height: 200,
      zIndex: items.length + 1
    };

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    const saved = await res.json();
    setItems(prev => [...prev, saved]);
    
    if (type === 'QUOTE' && extraImageContent) {
      const companionImg = {
        boardId,
        type: 'IMAGE',
        content: extraImageContent,
        x: newItem.x + 270,
        y: newItem.y,
        width: 300,
        height: 250,
        zIndex: items.length + 2
      };
      const imgRes = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companionImg)
      });
      const savedImg = await imgRes.json();
      setItems(prev => [...prev, savedImg]);
    }
  };

  const updateItem = async (id: string, partialData: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...partialData } : item));
    await fetch('/api/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...partialData })
    });
  };

  const deleteItem = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
  };

  // Drawing Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isDrawingMode) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setCurrentPath(`M ${x} ${y}`);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingMode || !isDrawing) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath(prev => `${prev} L ${x} ${y}`);
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!isDrawingMode || !isDrawing) return;
    setIsDrawing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    if (currentPath.length > 5) {
      // Save drawing path
      const drawItem = {
        boardId,
        type: 'DRAWING',
        content: currentPath,
        color: drawColor,
        x: 0, y: 0, width: 0, height: 0, // Not used for paths
        zIndex: 0 // Draw under widgets
      };
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drawItem)
      });
      const savedDraw = await res.json();
      setItems(prev => [...prev, savedDraw]);
    }
    setCurrentPath('');
  };

  return (
    <div className="canvas-container" ref={containerRef}>
      <div className="toolbar glass" style={{ zIndex: 10000 }}>
        <button className="tb-btn" onClick={() => handleAddItem('TEXT')}>📝 Note</button>
        <button className="tb-btn" onClick={() => handleAddItem('IMAGE')}>🖼️ Image</button>
        <button className="tb-btn" onClick={() => handleAddItem('QUOTE')}>💬 Quote</button>
        <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)', margin: '0 0.5rem' }}></div>
        
        <button 
          className="tb-btn" 
          style={{ background: isDrawingMode ? 'var(--primary)' : 'white', color: isDrawingMode ? 'white' : 'inherit' }}
          onClick={() => setIsDrawingMode(!isDrawingMode)}
        >
          🖊️ Draw
        </button>
        {isDrawingMode && (
          <input 
            type="color" 
            value={drawColor} 
            onChange={e => setDrawColor(e.target.value)} 
            style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          />
        )}
      </div>

      <div 
        className="canvas-plane" 
        style={{ cursor: isDrawingMode ? 'crosshair' : 'default', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          {items.filter(i => i.type === 'DRAWING').map(item => (
            <path key={item.id} d={item.content} fill="none" stroke={item.color || '#000'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {isDrawing && (
            <path d={currentPath} fill="none" stroke={drawColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>

        {items.filter(i => i.type !== 'DRAWING').map(item => (
          <ItemWidget 
            key={item.id} 
            item={item} 
            onUpdate={(data: any) => updateItem(item.id, data)} 
            onDelete={() => deleteItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
