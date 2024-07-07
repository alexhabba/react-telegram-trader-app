import './App.css';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
    const [orderBook, setOrderBook] = useState({});
    const wsRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://api.bybit.com/v5/market/orderbook?category=spot&symbol=WLDUSDT&limit=500'
                );
                let result = response.data.result;
                result.a.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
                setOrderBook(result);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        // Запускаем первый запрос
        fetchData();

        // Запускаем setInterval для регулярных запросов
        const intervalId = setInterval(fetchData, 3000); // Обновляем каждые 3 секунд

        // Очистка setInterval при размонтировании компонента
        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="order-book">
            <h3>Стакан Цен (BTCUSDT)</h3>
            <table className="order-book-table">
                <thead>
                <tr>
                    <th className="price-header">Цена</th>
                    <th className="amount-header">Количество</th>
                </tr>
                </thead>
                <tbody>
                {orderBook.a?.map((level) => (
                    <tr key={level[0]} className="ask">
                        <td className="price">{level[0]}</td>
                        <td className="amount">{level[1]}</td>
                    </tr>
                ))}
                {orderBook.b?.map((level) => (
                    <tr key={level[0]} className="bid">
                        <td className="price">{level[0]}</td>
                        <td className="amount">{level[1]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;













// const App = () => {
//     const [instruments, setInstruments] = useState([]);
//     const [selectedInstrument, setSelectedInstrument] = useState(null);
//     const [orderBook, setOrderBook] = useState({});
//     const [trades, setTrades] = useState({});
//     const wsRef = useRef(null);
//
//     useEffect(() => {
//         // Подключение к вебсокету Bybit
//         const connectWebSocket = () => {
//             // const ws = new WebSocket('wss://stream.bybit.com/v5/public/realtime');
//             const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear');
//
//             ws.onopen = () => {
//                 console.log('Соединение установлено');
//                 ws.send(
//                     JSON.stringify({
//                         op: 'subscribe',
//                         args: ['orderbook.50.BTCUSDT', 'orderbook.50.NOTUSDT'],
//                     })
//                 );
//             };
//
//             // ws.onmessage = (event) => {
//             //     const data = JSON.parse(event.data);
//             //     if (data.topic.includes('instrument_info')) {
//             //         setInstruments(data.data);
//             //     } else if (data.topic.includes('orderBook_L2')) {
//             //         setOrderBook((prev) => ({ ...prev, [data.data.symbol]: data.data }));
//             //     } else if (data.topic.includes('trading_records')) {
//             //         setTrades((prev) => ({ ...prev, [data.data.symbol]: data.data }));
//             //     }
//             // };
//             ws.onmessage = (event) => {
//                 // console.log("fgdejrgnhtrneghsdfghibg")
//
//                 const data = JSON.parse(event.data);
//                 console.log(data)
//                 if (data.topic && data.topic.includes('instrument_info')) {
//                     // ...
//                 } else if (data.topic && data.topic.includes('orderbook.50.NOTUSDT')) {
//                     console.log(data.topic)
//                             setOrderBook((prev) => ({ ...prev, [data.data.symbol]: data.data }));
//                 } else if (data.topic && data.topic.includes('trading_records')) {
//                     // ...
//                 } else {
//                     // console.error('Неверный формат данных:', data);
//                 }
//             };
//
//             ws.onclose = () => {
//                 console.log('Соединение закрыто');
//             };
//
//             wsRef.current = ws;
//         };
//
//         connectWebSocket();
//
//         return () => {
//             // Закрытие вебсокета при размонтировании компонента
//             if (wsRef.current) {
//                 wsRef.current.close();
//             }
//         };
//     }, []);
//
//     const handleInstrumentClick = (symbol) => {
//         setSelectedInstrument(symbol);
//     };
//
//     return (
//         <div className="App">
//             <h1>Bybit Инструменты</h1>
//
//             <button onClick={() => setInstruments([])}>Обновить инструменты</button>
//
//             <div className="instrument-list">
//                 {instruments.map((instrument) => (
//                     <div
//                         key={instrument.symbol}
//                         onClick={() => handleInstrumentClick(instrument.symbol)}
//                     >
//                         {instrument.symbol}
//                     </div>
//                 ))}
//             </div>
//
//             {selectedInstrument && (
//                 <div className="instrument-details">
//                     <h2>{selectedInstrument}</h2>
//                     <div className="order-book">
//                         <h3>Стакан Цен</h3>
//                         <table>
//                             <thead>
//                             <tr>
//                                 <th>Цена</th>
//                                 <th>Количество</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {orderBook[selectedInstrument]?.map((level) => (
//                                 <tr key={level.price}>
//                                     <td>{level.price}</td>
//                                     <td>{level.size}</td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                     <div className="trades">
//                         <h3>Лента Ордеров</h3>
//                         <ul>
//                             {trades[selectedInstrument]?.map((trade) => (
//                                 <li key={trade.tradeId}>
//                                     {trade.side} {trade.size} @ {trade.price}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default App;