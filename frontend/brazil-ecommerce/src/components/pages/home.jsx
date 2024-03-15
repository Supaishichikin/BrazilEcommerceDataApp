import React, { useState, useEffect } from 'react';
import ReactEchartsCore from 'echarts-for-react';

export default function Home() {
    const [revenueData, setRevenueData] = useState([]);
    const [purchaseTimestampData, setPurchaseTimestampData] = useState({});

    const option = {
          title: {
            text: 'Revenue by State'
          },
          xAxis: {
            type: 'category',
            data: revenueData.map(item => item.state)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: revenueData.map(item => item.revenue),
            type: 'bar'
          }]
    };


    useEffect(() => {

        fetch('http://localhost:5000/api/revenue-by-state').then(response => response.json())
        .then((data) => {
            setRevenueData(data.map(item => {
                return {
                    state: item.customer_state,
                    revenue: item.payment_value
                };
            }))
            }
        )
        .catch(error => console.error('Error fetching revenue data:', error));

        fetch('http://localhost:5000/api/purchase-timestamp')
            .then(response => response.json())
            .then(data => {
                setPurchaseTimestampData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const renderCharts = () => {
        const { purchase_timestamp_monthly, counts_by_year, counts_by_month_str, counts_by_weekday } = purchaseTimestampData;

        // Line chart for all over purchase timestamp
        const monthlyData = purchase_timestamp_monthly.map(item => [item.count_month, item.order_approved_at]);
        const monthlyOption = {
            title: {
                text: 'Number of Orders by Month'
            },
            xAxis: {
                type: 'category',
                data: monthlyData.map(item => item[0])
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: monthlyData.map(item => item[1]),
                type: 'line'
            }]
        };

        // Bar chart for orders purchased through years
        const yearlyData = counts_by_year.map(item => [item.order_purchase_timestamp, item.count_year]);
        const yearlyOption = {
            title: {
                text: 'Number of Orders by Year'
            },
            xAxis: {
                type: 'category',
                data: yearlyData.map(item => item[0])
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yearlyData.map(item => item[1]),
                type: 'bar'
            }]
        };

        // Bar chart for orders purchased through months
        const monthlyStrData = counts_by_month_str.map(item => [item.order_purchase_timestamp, item.count_month_str]);
        const monthlyStrOption = {
            title: {
                text: 'Number of Orders by Month'
            },
            xAxis: {
                type: 'category',
                data: monthlyStrData.map(item => item[0])
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: monthlyStrData.map(item => item[1]),
                type: 'bar'
            }]
        };

        // Bar chart for orders purchased through weekdays
        const weekdayData = counts_by_weekday.map(item => [item.weekdays, item.count_weekday]);
        const weekdayOption = {
            title: {
                text: 'Number of Orders by Weekday'
            },
            xAxis: {
                type: 'category',
                data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: weekdayData.map(item => item[1]),
                type: 'bar'
            }]
        };

        return (
            <div>
                <ReactEchartsCore option={monthlyOption} />
                <ReactEchartsCore option={yearlyOption} />
                <ReactEchartsCore option={monthlyStrOption} />
                <ReactEchartsCore option={weekdayOption} />
            </div>
        );
    };

    return (
        <div>
        <h1>Home</h1>
        <ReactEchartsCore
            key={JSON.stringify(option)}
            option={option}
            style={{ width: '100%', height: '400px' }}
            />

        {Object.keys(purchaseTimestampData).length > 0 && renderCharts()}
        </div>
    );
}