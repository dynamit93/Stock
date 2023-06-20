import React from 'react';

const PaintingTools = ({ paintingEnabled, togglePainting, selectedColor, selectColor, selectedTool, selectTool }) => {
  return (
    <div className="painting-tools">
      <input
        type="checkbox"
        id="painting-toggle"
        checked={paintingEnabled}
        onChange={togglePainting}
      />
      <label htmlFor="painting-toggle">Enable Painting</label>

      <div className="color-selection">
        <label>Color:</label>
        <input
          type="color"
          value={selectedColor}
          onChange={(event) => selectColor(event.target.value)}
        />
      </div>

      <div className="painting-tools">
        <label>Tools:</label>
        <button
          className={selectedTool === 'pencil' ? 'active' : ''}
          onClick={() => selectTool('pencil')}
        >
          Pencil
        </button>
        <button
          className={selectedTool === 'line' ? 'active' : ''}
          onClick={() => selectTool('line')}
        >
          Line
        </button>
        <button
          className={selectedTool === 'eraser' ? 'active' : ''}
          onClick={() => selectTool('eraser')}
        >
          Eraser
        </button>
      </div>
    </div>
  );
};

export default PaintingTools;
