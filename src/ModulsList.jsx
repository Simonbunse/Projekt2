import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ModulsForm from "./ModulsForm";

const ModulsList = () => {
    const navigate = useNavigate();
    const [Moduls, setModuls] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModul, setCurrentModul] = useState({});

    useEffect(() => {
        fetchModuls();
        fetchClassrooms();
        fetchCourses();
    }, []);

    const fetchModuls = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/moduls");
            const data = await response.json();
            setModuls(data.moduls);
        } catch (error) {
            console.error("Error fetching moduls:", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/courses");
            const data = await response.json();
            setCourses(data.courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const fetchClassrooms = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/classrooms");
            const data = await response.json();
            setClassrooms(data.classrooms);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        }
    };

    const openModal = (modul) => {
        setCurrentModul(modul);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentModul({});
        setIsModalOpen(false);
    };

    const onDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Moduls?");
        if (confirmDelete) {
            try {
                const options = {
                    method: "DELETE"
                };
                const response = await fetch(`http://127.0.0.1:5000/delete_modul/${id}`, options);
                if (response.status === 200) {
                    fetchModuls();
                } else {
                    console.error("Failed to delete modul");
                }
            } catch (error) {
                console.error("Error deleting modul:", error);
            }
        }
    };

    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    const updateCallback = () => {
        closeModal();
        fetchModuls();
    };

    const goToModulAttendance = (id) => {
        navigate(`/modul/${id}/attendance`);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <h2>
                Moduls
                <button className="back-button" onClick={goBack}>Back</button>
            </h2>
            <table style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th style={{ padding: "15px", border: "1px solid black" }}>ID</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Modul Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Start</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Slut</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Classroom Room Number</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Course Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Moduls.map((modul) => (
                        <tr key={modul.id}>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{modul.id}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{modul.modulName}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{modul.start}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{modul.slut}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{modul.classroomRoomNumber}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{modul.courseName}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>
                                <button onClick={() => openModal(modul)} style={{ marginRight: "5px" }}>Update</button>
                                <button onClick={() => goToModulAttendance(modul.id)} style={{ marginRight: "5px"}}>Attendances</button>
                                <button onClick={() => onDelete(modul.id)} style={{ backgroundColor: "red" }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <ModulsForm
                            existingModul={currentModul}
                            updateCallback={updateCallback}
                            classrooms={classrooms}
                            courses={courses}
                        />
                    </div>
                </div>
            )}
            <div className="create-contact-button">
                <button onClick={openCreateModal}>Add New Modul</button>
            </div>
        </div>
    );
};

export default ModulsList;
