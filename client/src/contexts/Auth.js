import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuthToken, destroyAuthToken, saveAuthToken } from '../utils';

// Create the AuthContext
const AuthContext = createContext();

// Provide the AuthContext to components
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsloggedIn] = useState(false);
    // const [error, setError] = useState(null);
    const navigate = useNavigate();
    const route = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/users` : '/api/users';

    // Fetch user with token from the backend (e.g., on page load)
    const fetchUserWithToken = useCallback(async () => {
        const token = getAuthToken();
        if (!token) return console.warn("no token");
        try {
            const response = await fetch(`${route}/get-with-token/${token}`, {
                method: 'GET',
                headers: {
                    Authorization: token
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            setUser(data);
            setIsloggedIn(true);
        } catch (error) {
            console.warn(error);
            destroyAuthToken();
            setUser(null);
            setIsloggedIn(false);
        }
    }, [route]);

    // Done
    // Login function
    const login = async (email, password) => {
        try {
            const response = await fetch(`${route}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Failed to log in');
            }
            const data = await response.json();
            saveAuthToken(data.token);
            setUser(data.user);
            setIsloggedIn(true);
            navigate("/admin/my-info")
        } catch (error) {
            console.warn(error);
            setUser(null);
            navigate("/admin")
        }
    };

    // Done
    // Logout function
    const logout = async () => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/logout/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
            });
            if (!response.ok) {
                throw new Error('Failed to logout');
            }

            // Clear auth state and localStorage
            setUser(null);
            setIsloggedIn(false);
            destroyAuthToken();
        } catch (error) {
            console.warn(error);
            setUser(null);
            setIsloggedIn(false);
            destroyAuthToken();
        }

        navigate('/')
    };

    // update password
    const updatePassword = async (oldPassword, newPassword) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/update-password/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            if (!response.ok) {
                throw new Error('Failed to update password');
            }
            fetchUserWithToken(token);
        } catch (error) {
            console.warn(error);
        }
    }

    // update email
    const updateEmail = async (newEmail, password) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/update-email/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ newEmail, password })
            });
            if (!response.ok) {
                throw new Error('Failed to update email');
            }
            fetchUserWithToken(token);
        } catch (error) {
            console.warn(error);
        }
    }

    // Update profile info
    const updateProfileInfo = async (newInfo) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/update-user/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ newInfo })
            });
            if (!response.ok) {
                throw new Error('Failed to update profile info');
            }
            fetchUserWithToken(token);
        } catch (error) {
            console.warn(error);
        }
    };

    // Update profile photo
    const updateProfileFiles = async (newFile, field) => {
        const token = getAuthToken();
        const formData = new FormData();

        // Append data to FormData object
        formData.append('image', newFile); // File is passed here
        if (field === 'headshot') {
            formData.append('previousHref', user.headshot || null);
        } else if (field === 'banner') {
            formData.append('previousHref', user.banner || null);
        }
        formData.append('field', field);

        try {
            const response = await fetch(`${route}/update-image/${user._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token // Send token in headers
                },
                body: formData // Send the FormData object as the body
            });

            if (!response.ok) {
                throw new Error('Failed to update profile photo');
            }

            // Fetch updated user info
            fetchUserWithToken(token);
        } catch (error) {
            console.warn(error);
        }
    };

    // Check for token in localStorage on load and fetch user
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch(`${route}/site-info`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.warn(error);
            }
        }
        async function fetchUserToken() {
            const token = getAuthToken();
            if (!token) return console.warn("no token");
            try {
                const response = await fetch(`${route}/get-with-token/${token}`, {
                    method: 'GET',
                    headers: {
                        Authorization: token
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                setUser(data);
                setIsloggedIn(true);
            } catch (error) {
                console.warn(error);
                destroyAuthToken();
                setUser(null);
                setIsloggedIn(false);
            }
        }
        const token = getAuthToken();
        if (token) {
            fetchUserToken();
        } else {
            fetchUserInfo()
        }
    }, [isLoggedIn, route]);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updatePassword, updateEmail, updateProfileInfo, updateProfileFiles }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}
