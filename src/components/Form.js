"use client";

import { useState } from "react";

export default function Form() {
    const [formData, setFormData] = useState({ email: "", phone: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        alert(data.message || "Error sending notification");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" onChange={handleChange} required />
            <button type="submit">Submit</button>
        </form>
    );
}