import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ClassroomForm from './ClassroomForm'

const ClassroomList = () => {
    const navigate = useNavigate(); // useNavigate instead of useHistory
    const [classrooms, setClassrooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClassroom, setCurrentClassroom] = useState({});

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/classrooms");
            const data = await response.json();
            setClassrooms(data.classrooms);
        } catch (error) {
            console.error("Error fetching classrooms", error);
        }
    };

    const openModal = (classroom) => {
        setCurrentClassroom(classroom);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentClassroom({});
        setIsModalOpen(false);
    };

    const onDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this classroom?");
        if (confirmDelete) {
            try {
                const options = {
                    method: "DELETE"
                }
                const response = await fetch(`http://127.0.0.1:5000/delete_classroom/${id}`, options)
                if (response.status === 200) {
                    updateCallback()
                } else {
                    console.error("Failed to delete")
                }
            } catch (error) {
                alert(error)
            }
        }
    }
    

    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    const updateCallback = () => {
        closeModal();
        fetchClassrooms(); // Refresh contacts after an update
    };

    const handleBack = () => {
        navigate(-1); // Navigate back in the history stack
    };
    
    return (
        <div>
            <h2>
                Classrooms
                <button className="back-button" onClick={handleBack}>Back</button>
            </h2>
            <table style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th style={{ padding: "15px", border: "1px solid black" }}>ID</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Class Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Room Number</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Adress</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classrooms.map((classroom) => (
                        <tr key={classroom.id}>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{classroom.id}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{classroom.className}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{classroom.roomNumber}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{classroom.address}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>
                                <button onClick={() => openModal(classroom)}style={{ marginRight: "5px" }}>Update</button>
                                <button onClick={() => onDelete(classroom.id)} style={{ backgroundColor: "red" }}>Delete</button>
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
                        <ClassroomForm
                            existingClassroom={currentClassroom}
                            updateCallback={updateCallback}
                        />
                    </div>
                </div>
            )}
            <div className="create-contact-button">
                <button onClick={openCreateModal}>Add New Classroom</button>
            </div>
        </div>
    )
}

export default ClassroomList;
