import React from 'react';

const Portfolio = ({
  data,
  sortColumn,
  sortOrder,
  handleAddPortfolio,
  handleExitPortfolio,
  handleSort
}) => {
  return (
    <div className="portfolio-container">
      <div className="portfolio-menu">
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
            {data.map((item, index) => (
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
  );
};

export default Portfolio;
