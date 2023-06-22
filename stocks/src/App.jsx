import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Candlesticks from './Charts/Candelsticks';
import DraggableChart from './DraggableChart';
import PaintingTools from './PaintingTools';
import './App.css';

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('');
  const [exchangeOptions, setExchangeOptions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [paintingEnabled, setPaintingEnabled] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedTool, setSelectedTool] = useState('pencil');
  const exchangeButtonRef = useRef(null);
  const [isPortfolioOpen, setPortfolioOpen] = useState(false);
  const [isExchangeOptionsOpen, setExchangeOptionsOpen] = useState(false);
  const [isModelOptionsOpen, setModelOptionsOpen] = useState(false);
  const [isNewPortfolioOpen, setNewPortfolioOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState([
    {
      object: 'Object 1',
      amount: 10,
      last: 100,
      marketValue: 1000,
      purchasePrice: 50,
      acquisitionValue: 500,
      returnPercentage: 100,
      portfolioPercentage: '10%',
      goal: 'Goal 1',
      stop: 'Stop 1',
    },
    {
      object: 'Object 2',
      amount: 5,
      last: 200,
      marketValue: 1000,
      purchasePrice: 100,
      acquisitionValue: 500,
      returnPercentage: 100,
      portfolioPercentage: '10%',
      goal: 'Goal 2',
      stop: 'Stop 2',
    },
  ]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const name = 'John Doe';
  const StartDatum = '2023-06-01';
  const portfoliodatum = '2023-06-15';
  const Yield = 10;


  


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

  const handleSymbolChange = event => {
    setSymbol(event.target.value);
  };

  const handleExchangeChange = event => {
    setSelectedExchange(event.target.value);
  };

  const getStockDataBySymbol = () => {
    return stockData.filter(stock => stock.symbol === symbol && stock.exchanges === selectedExchange);
  };

  const toggleExchangeOptions = () => {
    setExchangeOptionsOpen(!isExchangeOptionsOpen);
    setModelOptionsOpen(false);
  };

  const handlePortfolio = () => {
    setPortfolioOpen(!isPortfolioOpen);
    setModelOptionsOpen(false);
  };

  const handleExchangeOptionChange = event => {
    setSelectedExchange(event.target.value);
    setExchangeOptionsOpen(false);
  };

  const toggleModelOptions = () => {
    setModelOptionsOpen(!isModelOptionsOpen);
    setExchangeOptionsOpen(false);
  };

  const handleModelChange = event => {
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

  const selectColor = color => {
    setSelectedColor(color);
  };

  const selectTool = tool => {
    setSelectedTool(tool);
  };

  const handleAddPortfolio = () => {
    setNewPortfolioOpen(true);
  };

  const handleExitPortfolio = () => {
    setPortfolioOpen(false);
    setModelOptionsOpen(false);
  };

  const handleExitNewPortfolio = () => {
    setNewPortfolioOpen(false);
  };

  const handleSort = column => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const ContextMenu = ({ items, xPos, yPos, onClose }) => {
    const handleItemClick = (action) => {
      action();
      onClose();
    };


    return (
      <ul className="context-menu" style={{ top: yPos, left: xPos }}>
        {items.map((item, index) => (
          <li key={index} onClick={() => handleItemClick(item.action)}>
            {item.icon && <span className="menu-icon">{item.icon}</span>}
            <span className="menu-label">{item.label}</span>
          </li>
        ))}
      </ul>
    );
  };
  const sortedData = [...portfolioData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (sortOrder === 'asc') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
    }
    return 0;
  });

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
        <button className="Portfolio-button" onClick={handlePortfolio}>
          <img src="Icons/Portfolio2.png" alt="Portfolio" />
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
      </div>

      {isPortfolioOpen && (
        <div className="portfolio-container">
          <div className="portfolio-menu">

          <h4>
        namn: {name}&nbsp;&nbsp;&nbsp;&nbsp;StartDatum: {StartDatum}&nbsp;&nbsp;&nbsp;&nbsp;Portföljdatum: {portfoliodatum}&nbsp;&nbsp;&nbsp;&nbsp;Avkastning: {Yield}%
      </h4>
            <br></br>
            <table className="portfolio-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('object')}>Object</th>
                  <th onClick={() => handleSort('amount')}>Antal</th>
                  <th onClick={() => handleSort('last')}>Senast</th>
                  <th onClick={() => handleSort('marketValue')}>Marknadsvärde</th>
                  <th onClick={() => handleSort('purchasePrice')}>Köpkurs</th>
                  <th onClick={() => handleSort('acquisitionValue')}>Anskaffningsvärde</th>
                  <th onClick={() => handleSort('returnPercentage')}>Avkastning%</th>
                  <th onClick={() => handleSort('portfolioPercentage')}>% av Portfölj</th>
                  <th onClick={() => handleSort('goal')}>Mål</th>
                  <th onClick={() => handleSort('stop')}>Stopp</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.object}</td>
                    <td>{item.amount}</td>
                    <td>{item.last}</td>
                    <td>{item.marketValue}</td>
                    <td>{item.purchasePrice}</td>
                    <td>{item.acquisitionValue}</td>
                    <td>{item.returnPercentage}</td>
                    <td>{item.portfolioPercentage}</td>
                    <td>{item.goal}</td>
                    <td>{item.stop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="portfolio-options">
              <button onClick={handleAddPortfolio}>Add New Portfolio</button>
              <button onClick={handleExitPortfolio}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {isNewPortfolioOpen && (
        <div className="popup-outer">
          <div className="popup-inner">
            <div className="portfolio-inputs">
              <label htmlFor="new-portfolio-name">PortföljNamn:</label>
              <br />
              <input type="text" id="new-portfolio-name" />
              <br />
              <label htmlFor="new-start-date">StartDatum:</label>
              <br />
              <input type="date" id="new-start-date" />
              <br />
              <label htmlFor="new-average-method">Likavida medel:</label>
              <br />
              <input type="text" id="new-average-method" />
              <br />
              <label htmlFor="new-object-list">Namn på objektlista där portföljen sparas:</label>
              <br />
              <input type="text" id="new-object-list" />
            </div>
            <div className="portfolio-options">
              <button>Add</button>
              <button onClick={handleExitNewPortfolio}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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
