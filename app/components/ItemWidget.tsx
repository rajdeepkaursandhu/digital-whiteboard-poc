'use client';
import { useState, useRef, useEffect } from 'react';

export default function ItemWidget({ item, onUpdate, onDelete }: any) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const [pos, setPos] = useState({ x: item.x || 100, y: item.y || 100 });
  const [size, setSize] = useState({ w: item.width || 250, h: item.height || 200 });
  const [color, setColor] = useState(item.color || (item.type === 'TEXT' ? '#fef08a' : 'rgba(255, 255, 255, 0.9)'));
  
  // Image states
  const [imgUrl, setImgUrl] = useState(item.content || '');
  const [isEditingImg, setIsEditingImg] = useState(!item.content);

  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0, x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startSize.current = { w: size.w, h: size.h, x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      if (isDragging) {
        setPos({ x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y });
      } else if (isResizing) {
        const newW = Math.max(150, startSize.current.w + (e.clientX - startSize.current.x));
        const newH = Math.max(150, startSize.current.h + (e.clientY - startSize.current.y));
        setSize({ w: newW, h: newH });
      }
    };

    const handleGlobalUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate({ x: pos.x, y: pos.y });
      }
      if (isResizing) {
        setIsResizing(false);
        onUpdate({ width: size.w, height: size.h });
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
    };
  }, [isDragging, isResizing, pos, size, onUpdate]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    onUpdate({ color: e.target.value });
  };

  const saveImage = () => {
    setIsEditingImg(false);
    onUpdate({ content: imgUrl });
  };

  let contentBlock;
  switch (item.type) {
    case 'TEXT':
      contentBlock = (
        <div className="widget-content note">
          <textarea 
            defaultValue={item.content} 
            className="note-input" 
            onBlur={(e) => onUpdate({ content: e.target.value })}
          />
        </div>
      );
      break;
    case 'IMAGE':
      contentBlock = (
        <div className="widget-content pic" style={{ position: 'relative' }}>
          {isEditingImg ? (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, background: '#f4f4f5' }}>
              <input 
                type="text" 
                value={imgUrl} 
                onChange={(e) => setImgUrl(e.target.value)} 
                placeholder="Paste Image URL..." 
                style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
              />
              <button 
                onClick={saveImage}
                style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
              >Save</button>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src={imgUrl} alt="board-img" className="img-fill" />
              <button 
                onClick={() => setIsEditingImg(true)}
                style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '12px' }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      );
      break;
    case 'QUOTE':
      contentBlock = <div className="widget-content quote"><p>"{item.content}"</p></div>;
      break;
    default:
      contentBlock = <div className="widget-content">{item.content}</div>;
  }

  return (
    <div 
      className={`widget-wrapper ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: size.w,
        height: size.h,
        zIndex: item.zIndex || 1,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: color
      }}
    >
      <div className="widget-header" onMouseDown={handleDragStart}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>::</span>
          <input 
             type="color" 
             title="Change Color"
             value={color.startsWith('#') ? color : '#ffffff'} 
             onChange={handleColorChange} 
             style={{ width: '20px', height: '20px', padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
          />
        </div>
        <button className="del-btn" onMouseDown={(e) => { e.stopPropagation(); onDelete(); }}>x</button>
      </div>
      
      {contentBlock}

      {/* Resize Handle */}
      <div 
        onMouseDown={handleResizeStart}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20px',
          height: '20px',
          cursor: 'se-resize',
          zIndex: 10
        }}
      >
        <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', fill: 'rgba(0,0,0,0.3)' }}>
          <polygon points="24,24 24,12 12,24" />
        </svg>
      </div>
    </div>
  );
}
