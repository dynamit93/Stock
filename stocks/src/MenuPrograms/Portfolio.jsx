import React from 'react';
import './Portfolio.css';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [44, 55, 13, 43, 22],
      options: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="pie" width={380} />
      </div>
    );
  }
}

const Portfolio = ({
  handleAddPortfolio,
  handleExitPortfolio,
  portfolioData,
  handleSort,
  sortColumn,
  sortOrder,
  name,
  StartDatum,
  portfoliodatum,
  Yield,
}) => {
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
    <div className="portfolio-container">
      <div className="portfolio-menu">
        <h4>
          namn: {name}&nbsp;&nbsp;&nbsp;&nbsp;StartDatum: {StartDatum}&nbsp;&nbsp;&nbsp;&nbsp;Portföljdatum: {portfoliodatum}&nbsp;&nbsp;&nbsp;&nbsp;Avkastning: {Yield}%
        </h4>
        <br />
        <table className="portfolio-table">
          {/* table headers */}
        </table>
        {/* table body */}
      </div>

      <ApexChart />

      <div className="portfolio-options">
        <button onClick={handleAddPortfolio}>Add New Portfolio</button>
        <button onClick={handleExitPortfolio}>Exit</button>
      </div>
    </div>
  );
};

export default Portfolio;
