'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PortfolioDashboard() {
  const [trades, setTrades] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [user, setUser] = useState();
  const [userStocks, setUserStocks] = useState([]);
  const [newTrade, setNewTrade] = useState({ userId:'3755ddfc-aac7-4d86-ac54-9d3cd7f24449',stockId: '', type: 'BUY', quantity: 0, price: 0 });

  const fetchData = async () => {
    try {
      const [stocksRes, tradesRes, portfolioRes, userStocksRes] = await Promise.all([
        axios.get("http://localhost:5000/stocks"),
        axios.get("http://localhost:5000/trades"),
        axios.get(`http://localhost:5000/trades/${user?.[0]?.id}`),
        axios.get(`http://localhost:5000/stocks/user/${user?.[0]?.id}`),
      ]);

      setStocks(stocksRes.data);
      setTrades(tradesRes.data);
      setPortfolio(portfolioRes.data);
      setUserStocks(userStocksRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
    const _user = await axios.get(`http://localhost:5000/users`)
    setUser(_user.data)
    }
    fetchData()
    }, []);

  const addTrade = async () => {
    await axios.post('http://localhost:5000/trades', newTrade);
    fetchData()
  };

  const handleStockChange = (e) => {
    const selectedStock = stocks.find(stock => stock.id === e.target.value);
    if (selectedStock) {
      setNewTrade({
        ...newTrade,
        stockId: selectedStock.id,
        price: selectedStock.price,
      });
    }else{
      setNewTrade({
        ...newTrade,
        stockId: '',
        price: '', 
      });
    }
  }

  const handleBuySell = (e) => {
    const selectedType = e.target.value;
    let selectedStock = null;
  
    if (selectedType === "SELL") {
      selectedStock = userStocks.find(stock => stock.stockId === newTrade.stockId);
      
      if (!selectedStock) {
        alert("You cannot sell a stock you don't own.");
        return;
      }
    }

  
    setNewTrade(prevTrade => ({
      ...prevTrade,
      type: selectedType,
      // stockId: selectedStock ? selectedStock.id : prevTrade.stockId
    }));
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Stock Portfolio</h2>
        <div className="mb-4 flex gap-2">
          <select onChange={handleStockChange} className="border p-2">
            <option value="">Select Stock</option>
            {stocks.map(stock => <option key={stock.id} value={stock.id}>{stock.symbol}</option>)}
          </select>
          <select onChange={handleBuySell} className="border p-2">
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input type="number" placeholder="Quantity" onChange={(e) => setNewTrade({ ...newTrade, quantity: Number(e.target.value) })} className="border p-2" />
          <input type="number" placeholder="Price" value={newTrade.price} readOnly onChange={(e) => setNewTrade({ ...newTrade, price: Number(e.target.value) })} className="border p-2" />
          <button onClick={addTrade} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Trade</button>
        </div>
        <div className="w-full">
  {/* Summary Section */}
  <div className="flex justify-between bg-gray-100 p-4 rounded-md shadow">
    <h2 className="text-lg font-semibold">Total Investment: ${portfolio?.totalInvestment}</h2>
    <h2 className={`text-lg font-semibold ${portfolio?.totalProfit < 0 ? 'text-red-500' : 'text-green-500'}`}>
      Total Profit: ${portfolio?.totalProfit}
    </h2>
  </div>

  {/* Portfolio Table */}
  <table className="w-full mt-4 border">
    <thead>
      <tr className="bg-gray-200">
        <th className="p-2">Stock</th>
        <th className="p-2">Quantity</th>
        <th className="p-2">Total Investment</th>
        <th className="p-2">Profit/Loss</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(portfolio?.portfolio || {}).map(([symbol, port]) => (
        <tr key={symbol}>
          <td className="p-2">{symbol}</td>
          <td className="p-2">{port.quantity}</td>
          <td className="p-2">${port.investment.toFixed(2)}</td>
          <td className={`p-2 font-semibold ${port.profit < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ${port.profit.toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
}