import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ContactForm from './ContactForm';

const ContactList = () => {
    const navigate = useNavigate(); // Using useNavigate instead of useHistory
    const [contacts, setContacts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState({});

    useEffect(() => {
        fetchContacts();
        fetchCourses();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/contacts");
            const data = await response.json();
            setContacts(data.contacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/courses");
            const data = await response.json();
            setCourses(data.courses);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const openModal = (contact) => {
        setCurrentContact(contact);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentContact({});
        setIsModalOpen(false);
    };

    const goToAttendancePage = (contactId) => {
        navigate(`/contacts/${contactId}/attendance`); // Using navigate instead of history.push
    };

    const onDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Student?");
        if (confirmDelete) {
            try {
                const options = {
                    method: "DELETE"
                }
                const response = await fetch(`http://127.0.0.1:5000/delete_contact/${id}`, options)
                if (response.status === 200) {
                    fetchContacts();
                } else {
                    console.error("Failed to delete");
                }
            } catch (error) {
                console.error("Error deleting contact:", error);
            }
        }
    };

    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    const updateCallback = () => {
        closeModal();
        fetchContacts();
    };

    return (
        <div>
            <h2>
                Students
                <button className="back-button" onClick={() => navigate(-1)}>Back</button> {/* Using navigate instead of history.goBack */}
            </h2>
            <table style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th style={{ padding: "15px", border: "1px solid black" }}>ID</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>First Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Last Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Course</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Email</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{contact.id}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{contact.firstName}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{contact.lastName}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{contact.courseName}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{contact.email}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>
                                <button onClick={() => openModal(contact)} style={{ marginRight: "5px" }}>Update</button>
                                <button onClick={() => goToAttendancePage(contact.id)} style={{ marginRight: "5px" }}>Attendance</button>
                                <button onClick={() => onDelete(contact.id)} style={{ backgroundColor: "red" }}>Delete</button>
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
                        <ContactForm
                            existingContact={currentContact}
                            updateCallback={updateCallback}
                            courses={courses}
                        />
                    </div>
                </div>
            )}
            <div className="create-contact-button">
                <button onClick={openCreateModal}>Add New Contact</button>
            </div>
        </div>
    );
}

export default ContactList;
