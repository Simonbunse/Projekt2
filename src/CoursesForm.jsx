import React, { useState } from "react";

const CoursesForm = ({ existingCourse = {}, updateCallback }) => {
    const [courseName, setCourseName] = useState(existingCourse.courseName || "");

    const updating = Object.entries(existingCourse).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            courseName
        };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_course/${existingCourse.id}` : "create_course");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json();
            alert(data.message);
        } else {
            updateCallback();
        }
    };

    return (
        <form onSubmit={onSubmit} className="form-container">
            <div className="form-row">
                <label htmlFor="courseName" className="form-label">Course Name:</label>
                <input
                    type="text"
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="form-input"
                />
            </div>
            <button type="submit" className="submit-button">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default CoursesForm;
