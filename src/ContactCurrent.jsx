import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import ContactCurrentForm from "./ContactCurrentForm";
import ContactCurrentChart from "./ContactCurrentChart";

const ContactCurrent = () => {
    const navigate = useNavigate(); // Using useNavigate instead of useHistory
    const { id } = useParams();
    const [currentContactName, setCurrentContactName] = useState("");
    const [course_name, setCourseName] = useState("");
    const [currentContactId, setCurrentContactId] = useState("");
    const [contactCurrent, setContactCurrent] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState({});
    const [contactModuls, setContactModuls] = useState([]);
    const [overallAverageAttendance, setOverallAverageAttendance] = useState(0);

    useEffect(() => {
        fetchContactData();
        setIdFunction();
        fetchContactCurrentName();
    }, [id]);

    useEffect(() => {
        if (course_name) {
            fetchContactModuls();
        }
    }, [course_name]);

    const setIdFunction = () => {
        setCurrentContactId(id);
    };

    const fetchContactModuls = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/moduls_current?course_name=${course_name}`);
            const data = await response.json();
            setContactModuls(data.moduls);
        } catch (error) {
            console.error("Error fetching moduls:", error);
        }
    };

    const fetchContactCurrentName = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/contacts`);
            const data = await response.json();
            const contact = data.contacts.find(contact => contact.id === parseInt(id));
            if (contact) {
                setCurrentContactName(`${contact.firstName} ${contact.lastName}`);
                setCourseName(contact.courseName);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const fetchContactData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/contacts/${id}/attendance`);
            const data = await response.json();
            setContactCurrent(data.contacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const closeModal = () => {
        setCurrentContact({});
        setIsModalOpen(false);
    };

    const openCreateModal = (modulId, modulStart, modulEnd) => {
        setCurrentContact({ modulId, modulStart, modulEnd });
        setIsModalOpen(true);
    };

    const updateCallback = () => {
        closeModal();
        fetchContactData();
    };
    
    const calculateAverageAttendance = (attendanceData, moduls) => {
        if (!attendanceData.length || !moduls.length) return 0;
        const totalAttendance = moduls.reduce((acc, modul) => {
            const attendance = attendanceData.find(a => a.modulId === modul.id);
            return acc + (attendance ? attendance.attendance : 0);
        }, 0);
        return totalAttendance / moduls.length;
    };

    useEffect(() => {
        setOverallAverageAttendance(calculateAverageAttendance(contactCurrent, contactModuls));
    }, [contactCurrent, contactModuls]);

    const handleBack = () => {
        navigate(-1); // Navigate back in the history stack
    };

    return (
        <div>
            <h2>
                {currentContactName}
                <button className="back-button" onClick={handleBack}>Back</button>
            </h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginRight: "20px", marginBottom: "30px" }}>
                <ContactCurrentChart
                    courseModuls={contactModuls}
                    calculateAverageAttendance={(modulId) => {
                        const attendance = contactCurrent.find(a => a.modulId === modulId);
                        return attendance ? attendance.attendance : 0;
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>Average Attendance:</div>
                    <div style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "40px", border: "1px solid black", padding: "15px"}}>
                        {Math.round(overallAverageAttendance * 100) / 100}%
                    </div>
                </div>
            </div>
            <table style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th colSpan="4" style={{ padding: "15px", border: "1px solid black" }}>Module</th>
                        <th colSpan="4" style={{ padding: "15px", border: "1px solid black" }}>Attendance</th>
                    </tr>
                    <tr>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Module Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Start</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Slut</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Classroom</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Check In</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Check Out</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Attendance</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contactModuls.map((moduls) => {
                        const attendance = contactCurrent.find(a => a.modulId === moduls.id);
                        return (
                            <tr key={moduls.id}>
                                <td style={{ padding: "15px", border: "1px solid black" }}>{moduls.modulName}</td>
                                <td style={{ padding: "15px", border: "1px solid black" }}>{moduls.start}</td>
                                <td style={{ padding: "15px", border: "1px solid black" }}>{moduls.slut}</td>
                                <td style={{ padding: "15px", border: "1px solid black" }}>{moduls.classroomRoomNumber}</td>
                                <td style={{ padding: "15px", border: "1px solid black" }}>{attendance ? attendance.checkIn : ''}</td>
                                <td style={{ padding: "15px", border: "1px solid black" }}>{attendance ? attendance.checkOut : ''}</td>
                                <td style={{ padding: "15px", border: "1px solid black" }}>{attendance ? `${attendance.attendance}%` : ''}</td>
                                <td style={{ padding: "15px", border: "1px solid black" }}>
                                    {!attendance && (
                                        <button onClick={() => openCreateModal(moduls.id, moduls.start, moduls.slut)}>Check In Manually</button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <ContactCurrentForm
                            modulId={currentContact.modulId}
                            modulStart={currentContact.modulStart}
                            modulEnd={currentContact.modulEnd}
                            updateCallback={updateCallback}
                            contactId={currentContactId}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactCurrent;
