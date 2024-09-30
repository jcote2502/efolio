import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Create the ExperienceContext
const ExperienceContext = createContext();

// Provide the ExperienceContext to components
export const ExperienceProvider = ({ children }) => {
    const [experiences, setExperiences] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const route = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/experiences` :  '/api/experiences';

    const callRefresh = () => {
        setRefresh(!refresh);
    }

    // Fetch all experiences for the site
    const fetchExperiences = async () => {
        try {
            const response = await fetch(`${route}/site-experiences`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch experiences');
            }

            const data = await response.json();
            setExperiences(data.experiences);
        } catch (error) {
            console.error('Error fetching experiences', error);
        }
    };

    // Add new experience
    const addExperience = async (newExperience) => {
        const token = getAuthToken();
        const formData = new FormData();

        formData.append('image', newExperience.image);
        formData.append('experience', JSON.stringify(newExperience));

        try {
            const response = await fetch(`${route}/create`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add experience');
            }

            fetchExperiences(); // Re-fetch experiences after adding a new one
        } catch (error) {
            console.error('Error adding experience', error);
        }
    };

    // Update specific experience by id
    const updateExperience = async (_id, updatedData, previousHref) => {
        const token = getAuthToken();
        const formData = new FormData();
        if (typeof updatedData.image !== "string"){
            formData.append('image', updatedData.image);
            formData.append('previousHref', previousHref);
        }
        formData.append("experience", JSON.stringify(updatedData));

        try {
            const response = await fetch(`${route}/update-experience/${_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to update experience');
            }

            fetchExperiences();
        } catch (error) {
            console.error('Error updating experience', error);
        }
    };

    // Delete experience by id
    const deleteExperience = async (_id) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/delete/${_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete experience');
            }

            fetchExperiences(); // Re-fetch experiences after deleting
        } catch (error) {
            console.error('Error deleting experience', error);
        }
    };

    // Fetch experiences on component mount
    useEffect(() => {
        
    // Fetch all experiences for the site
    const fetchExp = async () => {
        try {
            const response = await fetch(`${route}/site-experiences`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch experiences');
            }

            const data = await response.json();
            setExperiences(data.experiences);
        } catch (error) {
            console.error('Error fetching experiences', error);
        }
    };
    fetchExp();
    }, [route]);

    return (
        <ExperienceContext.Provider value={{ experiences,callRefresh, addExperience, updateExperience, deleteExperience }}>
            {children}
        </ExperienceContext.Provider>
    );
};

export const useExperience = () => {
    return useContext(ExperienceContext);
};
