// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const PieChart = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow'], // Labels for the pie chart
        datasets: [
            {
                label: 'My Pie Chart',
                data: [300, 50, 100], // Data for the pie chart
                backgroundColor: ['#FF0000', '#0000FF', '#FFFF00'], // Colors for each section
                borderColor: ['#FF0000', '#0000FF', '#FFFF00'], // Border colors for each section
                borderWidth: 1, // Border width
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div className="piechart">
            <h2>Sharped Element Pie Chart</h2>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
