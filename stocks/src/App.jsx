import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Candlesticks from './Charts/Candelsticks';
import DraggableChart from './DraggableChart';
import PaintingTools from './PaintingTools';
import './App.css';

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('');
  const [exchangeOptions, setExchangeOptions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [paintingEnabled, setPaintingEnabled] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedTool, setSelectedTool] = useState('pencil');
  const exchangeButtonRef = useRef(null);
  const [isExchangeOptionsOpen, setExchangeOptionsOpen] = useState(false);
  const [isModelOptionsOpen, setModelOptionsOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5090/api/Stock')
      .then(response => response.json())
      .then(data => {
        setStockData(data);
        const exchanges = [...new Set(data.map(stock => stock.exchanges))];
        setExchangeOptions(exchanges);
        setSelectedExchange(exchanges[0] || '');
      })
      .catch(error => console.error('Error fetching stock data:', error));
  }, []);

  useEffect(() => {
    const symbolsForExchange = stockData
      .filter(stock => stock.exchanges === selectedExchange)
      .map(stock => stock.symbol);
    setSymbol(symbolsForExchange[0] || '');
  }, [selectedExchange, stockData]);

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleExchangeChange = (event) => {
    setSelectedExchange(event.target.value);
  };

  const getStockDataBySymbol = () => {
    return stockData.filter(stock => stock.symbol === symbol && stock.exchanges === selectedExchange);
  };

  const toggleExchangeOptions = () => {
    setExchangeOptionsOpen(!isExchangeOptionsOpen);
    setModelOptionsOpen(false);
  };

  const handleExchangeOptionChange = (event) => {
    setSelectedExchange(event.target.value);
    setExchangeOptionsOpen(false);
  };

  const toggleModelOptions = () => {
    setModelOptionsOpen(!isModelOptionsOpen);
    setExchangeOptionsOpen(false);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:5090/api/Stock/${symbol}/${selectedExchange}`)
      .then(response => response.json())
      .then(data => {
        setStockData(data);
      })
      .catch(error => console.error('Error fetching stock data:', error));
  };

  const generateSymbolDatalist = () => {
    const symbols = stockData
      .filter(stock => stock.exchanges === selectedExchange)
      .reduce((uniqueSymbols, stock) => {
        if (!uniqueSymbols.includes(stock.symbol)) {
          uniqueSymbols.push(stock.symbol);
        }
        return uniqueSymbols;
      }, []);

    return (
      <datalist id="symbol-options">
        {symbols.map((symbol, index) => (
          <option key={index} value={symbol} />
        ))}
      </datalist>
    );
  };

  const togglePainting = () => {
    setPaintingEnabled(!paintingEnabled);
  };

  const selectColor = (color) => {
    setSelectedColor(color);
  };

  const selectTool = (tool) => {
    setSelectedTool(tool);
  };

  return (
    <div>
      <label htmlFor="symbol">Symbol:</label>
      <div className="input-container">
        <input
          type="text"
          id="symbol"
          name="symbol"
          autoComplete="off"
          value={symbol}
          onChange={handleSymbolChange}
          list="symbol-options"
        />
        {generateSymbolDatalist()}

        <div className="exchange-dropdown" ref={exchangeButtonRef}>
          <button className="exchange-button" onClick={toggleExchangeOptions}>
            <img src="Icons/papericon.png" alt="Exchanges" />
          </button>
          {isExchangeOptionsOpen && (
            <div className="exchange-options">
              {exchangeOptions.map((exchange, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="exchange"
                    value={exchange}
                    checked={selectedExchange === exchange}
                    onChange={handleExchangeOptionChange}
                  />
                  {exchange}
                </label>
              ))}
            </div>
          )}
        </div>

        <button className="update-button" onClick={handleUpdate}>
          <img src="Icons/updateicon.png" alt="Update" />
        </button>

        <div className="models-container">
          <button className="models-button" onClick={toggleModelOptions}>
            <img src="Icons/Candelstickicon.png" alt="Candlestick" className="icon" />
          </button>
          {isModelOptionsOpen && selectedExchange && (
            <div className="model-options-container">
              <div className="model-options-box">
                <label>
                  <input
                    type="radio"
                    name="model"
                    value="Candlestick"
                    checked={selectedModel === 'Candlestick'}
                    onChange={handleModelChange}
                  />
                  Candlestick
                </label>
                <label>
                  <input
                    type="radio"
                    name="model"
                    value="Model 2"
                    checked={selectedModel === 'Model 2'}
                    onChange={handleModelChange}
                  />
                  Line Chart
                </label>
                <label>
                  <input
                    type="radio"
                    name="model"
                    value="Model 3"
                    checked={selectedModel === 'Model 3'}
                    onChange={handleModelChange}
                  />
                  Model 3
                </label>
              </div>
            </div>
          )}
        </div>

       {/*} <PaintingTools
          paintingEnabled={paintingEnabled}
          togglePainting={togglePainting}
          selectedColor={selectedColor}
          selectColor={selectColor}
          selectedTool={selectedTool}
          selectTool={selectTool}
        />*/}
      </div>

      <div>
        {selectedModel === 'Candlestick' && getStockDataBySymbol().length > 0 && (
          <DraggableChart title="Candlestick Chart">
            <Candlesticks data={getStockDataBySymbol()} />
          </DraggableChart>
        )}
        {selectedModel !== 'Candlestick' && getStockDataBySymbol().length > 0 && (
          <DraggableChart title="Line Chart">
            <LineChart width={800} height={500} data={getStockDataBySymbol()}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" name="Stock Price" stroke="#8884d8" />
            </LineChart>
          </DraggableChart>
        )}
      </div>
    </div>
  );
};

export default App;
