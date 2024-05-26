import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const CurrentModul = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Using useNavigate instead of useHistory
    const [attendance, setAttendance] = useState([]);
    const [currentModul, setCurrentModul] = useState({});

    useEffect(() => {
        fetchAttendance();
        fetchCurrentModul();
    }, [id]);

    const fetchCurrentModul = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/moduls");
            const data = await response.json();
            const filteredModul = data.moduls.find(modul => modul.id.toString() === id);
            setCurrentModul(filteredModul);
        } catch (error) {
            console.error("Error fetching moduls:", error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/attendance`);
            const data = await response.json();
            const filteredData = data.attendance.filter(modul => modul.modulId.toString() === id);
            setAttendance(filteredData);
            fetchContacts(filteredData);
        } catch (error) {
            console.error("Error fetching moduls:", error);
        }
    };

    const fetchContacts = async (filteredAttendance) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/contacts`);
            const data = await response.json();
            const contactIds = filteredAttendance.map(modul => modul.contactId);
            const filteredContacts = data.contacts.filter(contact => contactIds.includes(contact.id));
            const mergedData = filteredAttendance.map(attendance => {
                const contact = filteredContacts.find(contact => contact.id === attendance.contactId);
                return {
                    ...attendance,
                    contactId: contact ? contact.id : '',
                    firstName: contact ? contact.firstName : '',
                    lastName: contact ? contact.lastName : ''
                };
            });
            setAttendance(mergedData);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const goBack = () => {
        navigate(-1); // Using navigate instead of history.goBack
    };

    const goToStudent = (id) => {
        navigate(`/contacts/${id}/attendance`);
    };

    return (
        <div>
            <h2>
                {currentModul ? currentModul.modulName : "Loading..."}
                <button className="back-button" onClick={goBack}>Back</button>
            </h2>
            <table style={{ margin: "auto", marginBottom: "0px", borderSpacing: 20}}>
                <tbody >
                    <tr>
                        <td style={{ padding: "15px", border: "1px solid black" }}>Start of Modul: {currentModul.start}</td>
                        <td style={{ padding: "15px", border: "1px solid black" }}>End of Modul: {currentModul.slut}</td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Student Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Check In</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Check Out</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Attendance</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((attendance) => (
                        <tr key={attendance.id}>
                            <td style={{ padding: "15px", border: "1px solid black" }}>
                                {attendance.firstName} {attendance.lastName}
                            </td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{attendance.checkIn}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{attendance.checkOut}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{attendance.attendance}%</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>
                                <button onClick={() => goToStudent(attendance.contactId)} style={{ marginRight: "5px"}}>Go to Student</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CurrentModul;
