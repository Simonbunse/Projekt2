import { useState } from "react";

const ContactForm = ({ existingContact = {}, updateCallback, courses }) => {
    const [firstName, setFirstName] = useState(existingContact.firstName || "");
    const [lastName, setLastName] = useState(existingContact.lastName || "");
    const [courseName, setCourseName] = useState(courses.length > 0 ? courses[0].courseName : "");
    const [email, setEmail] = useState(existingContact.email || "");
    const [cardId, setCardId] = useState(existingContact.cardId || "");
    

    const updating = Object.entries(existingContact).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            firstName,
            lastName,
            courseName,
            email,
            cardId
        }
        const url = "http://127.0.0.1:5000/" + (updating ? `update_contact/${existingContact.id}` : "create_contact")
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    }

    return (
        <form onSubmit={onSubmit} className="form-container">
            <div className="form-row">
                <label htmlFor="firstName" className="form-label">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="lastName" className="form-label">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="courseName" className="form-label">Course Name:</label>
                <select
                    type="text"
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
            <div className="form-row">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="cardId" className="form-label">Card ID:</label>
                <input
                    type="text"
                    id="cardId"
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    className="form-input"
                />
            </div>
            <button type="submit" className="submit-button">{updating ? "Update" : "Create"}</button>
        </form>
    );    
};

export default ContactForm