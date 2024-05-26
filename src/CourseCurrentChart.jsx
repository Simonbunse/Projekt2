import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CourseCurrentChart = ({ courseModuls, calculateAverageAttendance }) => {
    const data = courseModuls.map(modul => ({
        name: modul.modulName,
        avgAttendance: calculateAverageAttendance(modul.id)
    }));

    return (
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            style={{ marginLeft: "0px" }} // Add this style
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgAttendance" stroke="#8884d8" />
        </LineChart>
    );
};

export default CourseCurrentChart;
