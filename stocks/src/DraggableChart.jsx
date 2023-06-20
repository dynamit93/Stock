import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { debounce } from 'lodash';
import 'react-resizable/css/styles.css';
import './DraggableChart.css';

const DraggableChart = ({ title, children }) => {
  const [isMinimized, setMinimized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const handleToggleMinimize = () => {
    setMinimized(!isMinimized);
  };

  const handleResize = debounce((event, { size }) => {
    setDimensions({ width: size.width, height: size.height });
  }, 200);

  useEffect(() => {
    const handleWindowResize = () => {
      setDimensions({
        width: window.innerWidth * 0.8, // Set initial width as 80% of window width
        height: window.innerHeight * 0.8, // Set initial height as 80% of window height
      });
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <Draggable handle=".chart-header">
      <ResizableBox
        width={dimensions.width}
        height={dimensions.height}
        minConstraints={[200, 200]}
        maxConstraints={[Infinity, Infinity]}
        className={`draggable-chart ${isMinimized ? 'minimized' : ''}`}
        onResize={handleResize}
        resizeHandles={['e', 's', 'se']} // Enable resizing in the east, south, and southeast directions
        style={isMinimized ? { width: '150px', height: '30px' } : {}}
      >
        <div className="chart-header">
          <h3>{title}</h3>
          <button className="minimize-button" onClick={handleToggleMinimize}>
            {isMinimized ? '+' : '-'}
          </button>
        </div>
        {!isMinimized && <div className="chart-content">{children}</div>}
      </ResizableBox>
    </Draggable>
  );
};

export default DraggableChart;
