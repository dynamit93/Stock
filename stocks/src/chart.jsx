import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CandlestickChart from './Charts/Candelsticks';
const MyChart = ({ data }) => {
  return (
    <div>
      <LineChart width={60} height={400} data={data}>
         <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" /> 
        
      </LineChart>
      {/* <CandlestickChart /> */}
    </div>
      /* {symbol && selectedExchange && (
        <LineChart width={800} height={500} data={getStockDataBySymbol()}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" name="Stock Price" stroke="#8884d8" />
        </LineChart>
        
      )} */   
            
  );
};

export default MyChart;