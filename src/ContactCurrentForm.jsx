import { useState } from "react";

const ContactCurrentForm = ({ modulId, modulStart, modulEnd, updateCallback, contactId }) => {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const formatDateTime = (dateTime) => {
        return dateTime.replace('T', ' ');
    };

    const calculateAttendancePercentage = (modulStart, modulEnd, checkIn, checkOut) => {
        const modulStartTime = new Date(modulStart);
        const modulEndTime = new Date(modulEnd);
        let checkInTime = new Date(checkIn);
        let checkOutTime = new Date(checkOut);

        if (checkInTime < modulStartTime) {
            checkInTime = modulStartTime;
        }

        if (checkInTime > modulEndTime) {
            checkInTime = modulEndTime;
        }

        if (checkOutTime > modulEndTime) {
            checkOutTime = modulEndTime;
        }

        if (checkOutTime < checkInTime) {
            checkOutTime = checkInTime;
        }

        const modulDuration = modulEndTime - modulStartTime;
        const attendanceDuration = checkOutTime - checkInTime;

        return Math.round((attendanceDuration / modulDuration) * 100);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formattedCheckIn = formatDateTime(checkIn);
        const formattedCheckOut = formatDateTime(checkOut);
        const attendance = calculateAttendancePercentage(modulStart, modulEnd, formattedCheckIn, formattedCheckOut);

        const data = {
            contactId,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
            modulId,
            attendance
        };

        const url = "http://127.0.0.1:5000/create_contact_check_in";
        const options = {
            method: "POST",
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
                <label htmlFor="checkIn" className="form-label">Check In:</label>
                <input
                    type="datetime-local"
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-row">
                <label htmlFor="checkOut" className="form-label">Check Out:</label>
                <input
                    type="datetime-local"
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="form-input"
                />
            </div>
            <button type="submit" className="submit-button">Create</button>
        </form>
    );
};

export default ContactCurrentForm;
