import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CoursesForm from './CoursesForm';

const CourseList = () => {
    const navigate = useNavigate(); // Using useNavigate instead of useHistory
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({});

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/courses");
            const data = await response.json();
            setCourses(data.courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const openModal = (modul) => {
        setCurrentCourse(modul);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentCourse({});
        setIsModalOpen(false);
    };

    const onDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (confirmDelete) {
            try {
                const options = {
                    method: "DELETE"
                };
                const response = await fetch(`http://127.0.0.1:5000/delete_course/${id}`, options);
                if (response.status === 200) {
                    fetchCourses();
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
        fetchCourses();
    };

    const handleBack = () => {
        navigate(-1);
    };

    const goToCourseAttendance = (id) => {
        navigate(`/courses/${id}/attendance`); // Fixing the variable name to id
    };

    return (
        <div>
            <h2>
                Course
                <button className="back-button" onClick={handleBack}>Back</button>
            </h2>
            <table style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th style={{ padding: "15px", border: "1px solid black" }}>ID</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Course Name</th>
                        <th style={{ padding: "15px", border: "1px solid black" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{course.id}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>{course.courseName}</td>
                            <td style={{ padding: "15px", border: "1px solid black" }}>
                                <button onClick={() => openModal(course)} style={{ marginRight: "5px" }}>Update</button>
                                <button onClick={() => goToCourseAttendance(course.id)} style={{ marginRight: "5px"}}>Attendances</button>
                                <button onClick={() => onDelete(course.id)} style={{ backgroundColor: "red" }}>Delete</button>
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
                        <CoursesForm
                            existingCourse={currentCourse}
                            updateCallback={updateCallback}
                        />
                    </div>
                </div>
            )}
            <div className="create-contact-button">
                <button onClick={openCreateModal}>Add New Course</button>
            </div>
        </div>
    );
};

export default CourseList;
