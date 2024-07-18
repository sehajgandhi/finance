import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const res = await axios.get('/api/stocks');
                setStocks(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStocks();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <ul>
                {stocks.map(stock => (
                    <li key={stock._id}>
                        <span>{stock.symbol}</span> - <span>{stock.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
