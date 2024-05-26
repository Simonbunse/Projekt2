import React, { useState } from "react";

const ModulsForm = ({ existingModul = {}, updateCallback, classrooms, courses }) => {
    const [modulName, setModulName] = useState(existingModul.modulName || "");
    const [start, setStart] = useState(existingModul.start || "");
    const [slut, setSlut] = useState(existingModul.slut || "");
    const [classroomRoomNumber, setClassroomRoomNumber] = useState(classrooms.length > 0 ? classrooms[0].roomNumber : "");
    const [courseName, setCourseName] = useState(courses.length > 0 ? courses[0].courseName : "");
    
    const updating = Object.entries(existingModul).length !== 0;

    const formatDateTime = (dateTime) => {
        return dateTime.replace('T', ' ');
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formattedStart = formatDateTime(start);
        const formattedSlut = formatDateTime(slut);

        const data = {
            modulName,
            start: formattedStart,
            slut: formattedSlut,
            classroomRoomNumber,
            courseName
        };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_modul/${existingModul.id}` : "create_modul");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const responseData = await response.json();
            alert(responseData.message);
        } else {
            updateCallback();
        }
    };

    return (
        <form onSubmit={onSubmit} className="form-container">
            <div className="form-row">
                <label htmlFor="modulName" className="form-label">Modul Name:</label>
                <input
                    type="text"
                    id="modulName"
                    value={modulName}
                    onChange={(e) => setModulName(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="start" className="form-label">Start:</label>
                <input
                    type="datetime-local" 
                    id="start"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="slut" className="form-label">Slut:</label>
                <input
                    type="datetime-local" 
                    id="slut"
                    value={slut}
                    onChange={(e) => setSlut(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="classroomRoomNumber" className="form-label">Classroom Room Number:</label>
                <select
                    id="classroomRoomNumber"
                    value={classroomRoomNumber}
                    onChange={(e) => setClassroomRoomNumber(e.target.value)}
                    className="form-input"
                >
                    {classrooms.map(classroom => (
                        <option key={classroom.id} value={classroom.roomNumber}>{classroom.roomNumber}</option>
                    ))}
                </select>
            </div>
            <div className="form-row">
                <label htmlFor="courseName" className="form-label">Course Name:</label>
                <select
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="form-input"
                >
                    {courses.map(course => (
                        <option key={course.id} value={course.courseName}>{course.courseName}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="submit-button">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default ModulsForm;
