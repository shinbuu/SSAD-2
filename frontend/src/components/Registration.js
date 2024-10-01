import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', { username, password });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 1500); // Redirect to login page after 1.5 seconds
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return ( <
        div className = "container" >
        <
        h2 > Register < /h2> <
        form onSubmit = { handleSubmit } >
        <
        div >
        <
        label > Username < /label> <
        input type = "text"
        value = { username }
        onChange = {
            (e) => setUsername(e.target.value)
        }
        required /
        >
        <
        /div> <
        div >
        <
        label > Password < /label> <
        input type = "password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        required /
        >
        <
        /div> <
        button type = "submit" > Register < /button> < /
        form > {
            message && < p > { message } < /p>} < /
            div >
        );
    }

    export default Registration;