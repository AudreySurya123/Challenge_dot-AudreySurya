import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';

const styles = {
    body: {
        backgroundColor: '#f8f9fa',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    card: {
        border: 'none',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%',
        padding: '2rem'
    },
    heading: {
        fontSize: '2rem',
        color: '#333'
    },
    label: {
        fontWeight: 600,
        color: '#555'
    },
    input: {
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        borderColor: '#ced4da',
        padding: '0.375rem 0.75rem'
    },
    inputFocus: {
        boxShadow: 'none',
        borderColor: '#007bff'
    },
    button: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderRadius: '8px',
        transition: 'background-color 0.3s, border-color 0.3s'
    },
    buttonHover: {
        backgroundColor: '#0056b3',
        borderColor: '#004085'
    },
    icon: {
        cursor: 'pointer'
    },
    vh100: {
        height: '100vh',
        background: 'linear-gradient(to right, #007bff, #6c757d)',
        color: '#fff'
    },
    placeholder: {
        color: '#aaa'
    }
};

const Login = () => {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validEmail = "tes@gmail.com";
    const validPassword = "tes123";

    const onLogin = (e) => {
        e.preventDefault();

        if (email === validEmail && password === validPassword) {
            Swal.fire({
                title: 'Success!',
                text: 'You have successfully logged in.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.removeItem('quizState');
                    navigate("/quiz");
                }
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Login Failed. Please check your credentials.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <section className="d-flex justify-content-center align-items-center vh-100" style={styles.vh100}>
            <div className="card" style={styles.card}>
                <h1 className="text-center mb-4" style={styles.heading}>Login</h1>
                <form onSubmit={onLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" style={styles.label}>Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label" style={styles.label}>Password</label>
                        <div className="d-flex align-items-center">
                            <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                className="form-control"
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                title={showPass ? 'Hide Password' : 'Show Password'}
                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                                onClick={() => setShowPass(!showPass)}
                                style={{ transform: 'translateY(-50%)', padding: '0 0.75rem', marginTop: '15px' }}
                            >
                                <i
                                    className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} text-secondary`}
                                    style={styles.icon}
                                ></i>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                        style={styles.button}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
