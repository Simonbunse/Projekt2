import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import CourseCurrentChart from "./CourseCurrentChart";

const CourseCurrent = () => {
    const navigate = useNavigate(); // Using useNavigate instead of useHistory
    const { id } = useParams();
    const [courseCurrent, setCourseCurrent] = useState(null);
    const [courseModuls, setCourseModuls] = useState([]);
    const [courseAttendance, setCourseAttendance] = useState([]);
    const [numberOfStudents, setNumberOfStudents] = useState("");
    const [overallAverageAttendance, setOverallAverageAttendance] = useState(0); 

    useEffect(() => {
        fetchCourseCurrent();
    }, [id]);

    useEffect(() => {
        if (courseCurrent) {
            fetchCourseModuls();
            fetchStudentInfo(courseCurrent.courseName);
        }
    }, [courseCurrent]);

    useEffect(() => {
        if (courseModuls.length > 0) {
            fetchAttendance();
        }
    }, [courseModuls]);

    const fetchCourseCurrent = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/courses`);
            const data = await response.json();
            const course = data.courses.find(course => course.id === parseInt(id));
            if (course) {
                setCourseCurrent(course);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        }
    };

    const fetchStudentInfo = async (courseName) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/contacts`);
            const data = await response.json();
            const filteredContacts = data.contacts.filter(contact => contact.courseName === courseName);
            setNumberOfStudents(filteredContacts.length);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/attendance`);
            const data = await response.json();
            setCourseAttendance(data.attendance);
            calculateOverallAverageAttendance(data.attendance, courseModuls);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const calculateAverageAttendance = (modulId, attendanceData) => {
        const attendanceForModule = attendanceData.filter(attendance => attendance.modulId === modulId);
        if (attendanceForModule.length === 0) return 0;
        const totalAttendance = attendanceForModule.reduce((acc, curr) => acc + curr.attendance, 0);
        return totalAttendance / attendanceForModule.length;
    };

    const calculateOverallAverageAttendance = (attendanceData, moduls) => {
        if (moduls.length === 0) return;
        const totalAttendance = moduls.reduce((acc, curr) => acc + calculateAverageAttendance(curr.id, attendanceData), 0);
        setOverallAverageAttendance(totalAttendance / moduls.length);
    };

    const fetchCourseModuls = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/moduls");
            const data = await response.json();
            const filteredModuls = data.moduls.filter(modul => modul.courseName === courseCurrent?.courseName);
            setCourseModuls(filteredModuls);
        } catch (error) {
            console.error("Error fetching moduls:", error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const goToModulAttendance = (id) => () => {
        navigate(`/modul/${id}/attendance`);
    };

    return (
        <div>
            <h2>
                {courseCurrent ? courseCurrent.courseName : "Loading..."}
                <button className="back-button" onClick={handleBack}>Back</button>
            </h2>
            <div style={{ display: "flex", justifyContent:"center", alignItems: "center", marginRight: "20px", marginBottom: "30px" }}>
                <CourseCurrentChart
                    courseModuls={courseModuls}
                    calculateAverageAttendance={(modulId) => calculateAverageAttendance(modulId, courseAttendance)}
                />
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>Average Attendance:</div>
                    <div style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "40px", border: "1px solid black", padding: "15px"}}>
                        {Math.round(overallAverageAttendance * 100) / 100}%
                    </div>
                </div>
            </div>
            {courseCurrent && (
                <div style={{marginLeft: "40px"}}>
                    <table style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "15px", border: "1px solid black" }}>Module Name</th>
                                <th style={{ padding: "15px", border: "1px solid black" }}>Number of Students</th>
                                <th style={{ padding: "15px", border: "1px solid black" }}>Average Attendance</th>
                                <th style={{ padding: "15px", border: "1px solid black" }}>Address</th>
                                <th style={{ padding: "15px", border: "1px solid black" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseModuls.map(modul => (
                                <tr key={modul.id}>
                                    <td style={{ padding: "15px", border: "1px solid black" }}>{modul.modulName}</td>
                                    <td style={{ padding: "15px", border: "1px solid black" }}>{numberOfStudents}</td>
                                    <td style={{ padding: "15px", border: "1px solid black" }}>{calculateAverageAttendance(modul.id, courseAttendance)}%</td>
                                    <td style={{ padding: "15px", border: "1px solid black" }}>{modul.classroomRoomNumber}</td>
                                    <td style={{ padding: "15px", border: "1px solid black" }}>
                                        <button onClick={goToModulAttendance(modul.id)} style={{ marginRight: "20px"}}>Attendances</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CourseCurrent;
