import React, { Component } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';

class CandlestickChart extends Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.chart = null;

    this.state = {
      series: [],
      options: {
        chart: {
          type: 'candlestick',
          height: 350,
          id: 'candlestick-chart'
        },
        title: {
          text: 'Candlestick Chart',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      }
    };
  }

  componentDidMount() {
    this.fetchChartData();
  }

  fetchChartData = async () => {
    try {
      const response = await axios.post('http://localhost:5090/api/Stock/Search', {
        symbol: 'AAPL',
        exchanges: ['NYSE']
      });

      const chartData = response.data.map(data => ({
        x: new Date(data.date).getTime(),
        y: [data.open, data.high, data.low, data.close]
      }));

      this.setState({ series: [{ data: chartData }] }, this.renderChart);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  renderChart = () => {
    if (!this.chart) {
      this.chart = new ApexCharts(this.chartRef.current, {
        ...this.state.options,
        series: this.state.series
      });
      this.chart.render();
    } else {
      this.chart.updateSeries(this.state.series);
    }
  };

  render() {
    return <div ref={this.chartRef} id="chart" />;
  }
}

export default CandlestickChart;