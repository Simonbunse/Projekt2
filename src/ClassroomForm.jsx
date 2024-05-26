import { useState } from "react";

const ClassroomForm = ({ existingClassroom = {}, updateCallback }) => {
    const [className, setClassName] = useState(existingClassroom.className || "");
    const [roomNumber, setRoomNumber] = useState(existingClassroom.roomNumber || "");
    const [address, setAddress] = useState(existingClassroom.address || "");

    const updating = Object.entries(existingClassroom).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            className,
            roomNumber,
            address
        };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_classroom/${existingClassroom.id}` : "create_classroom");
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
                <label htmlFor="className" className="form-label">Classroom Name:</label>
                <input
                    type="text"
                    id="className"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="roomNumber" className="form-label">Room Number:</label>
                <input
                    type="text"
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="address" className="form-label">Address:</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                />
            </div>
            <button type="submit" className="submit-button">{updating ? "Update" : "Create"} Classroom</button>
        </form>
    );
    
};

export default ClassroomForm;
