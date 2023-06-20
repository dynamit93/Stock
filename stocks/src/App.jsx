import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Candlesticks from './Charts/Candelsticks';
import './App.css';

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('');
  const [exchangeOptions, setExchangeOptions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
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

        <button className="models-button" onClick={toggleModelOptions}>
  <img src="Icons/Candelstickicon.png" alt="Candlestick" className="icon" />
  {isModelOptionsOpen && selectedExchange && (
    <div className="model-options-container">
      <div className="model-options-box">
        <label>
          <input
            type="radio"
            name="model"
            value="Model 1"
            checked={selectedModel === 'Model 1'}
            onChange={handleModelChange}
          />
          Model 1
        </label>
        <label>
          <input
            type="radio"
            name="model"
            value="Model 2"
            checked={selectedModel === 'Model 2'}
            onChange={handleModelChange}
          />
          Model 2
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
</button>


        {isModelOptionsOpen && selectedExchange && (
          <div className="model-options-container">
            <div className="model-options-box">
              <label>
                <input
                  type="radio"
                  name="model"
                  value="Model 1"
                  checked={selectedModel === 'Model 1'}
                  onChange={handleModelChange}
                />
                Model 1
              </label>
              <label>
                <input
                  type="radio"
                  name="model"
                  value="Model 2"
                  checked={selectedModel === 'Model 2'}
                  onChange={handleModelChange}
                />
                Model 2
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
      <div>
        {selectedModel && getStockDataBySymbol().length > 0 && (
          <LineChart width={800} height={500} data={getStockDataBySymbol()}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={selectedModel.toLowerCase()} name={selectedModel} stroke="green" />
          </LineChart>
        )}
        {!selectedModel && getStockDataBySymbol().length > 0 && (
          <Candlesticks data={getStockDataBySymbol()} />
        )}
      </div>
      {symbol && selectedExchange && !selectedModel && (
        <LineChart width={800} height={500} data={getStockDataBySymbol()}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" name="Stock Price" stroke="#8884d8" />
        </LineChart>
      )}
    </div>
  );
};

export default App;
