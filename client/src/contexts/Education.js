import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Do NOT MODIFY


// Create the EducationContext
const EducationContext = createContext();

// Provide the EducationContext to components
export const EducationProvider = ({ children }) => {
    const [educations, setEducations] = useState([]);
    const route =  process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/educations` :  '/api/educations';

    // Done
    // Fetch all education records for the user
    const fetchEducations = async () => {
        try {
            const response = await fetch(`${route}/site-educations`);

            if (!response.ok) {
                throw new Error('Failed to fetch educations');
            }

            const data = await response.json();
            setEducations(data);
        } catch (error) {
            console.error('Error fetching educations', error);
        }
    };

    // Done
    // Add new education
    const addEducation = async (education) => {
        const token = getAuthToken();
        const formData = new FormData();

        formData.append('image', education.image);
        formData.append("education", JSON.stringify(education));

        try {
            const response = await fetch(`${route}/create`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add education');
            }

            fetchEducations(); // Re-fetch educations after adding a new one
        } catch (error) {
            console.error('Error adding education', error);
        }
    };

    // Update specific education by ID
    const updateEducation = async (_id, education) => {
        const token = getAuthToken();
        const formData = new FormData();

        // if the imagefield is a file 
        if (typeof education.image !== 'string'){
            formData.append('image', education.image);
            education.image='';
            const oldEducation = educations.find(item=> item._id === _id);
            formData.append('previousHref', oldEducation.image);
        }
        formData.append("education", JSON.stringify(education));


        try {
            const response = await fetch(`${route}/update-education/${_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update education');
            }

            fetchEducations(); // Re-fetch educations after updating
        } catch (error) {
            console.error('Error updating education', error);
        }
    };

    // Delete education by ID
    const deleteEducation = async (_id) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}delete/${_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete education');
            }

            fetchEducations(); // Re-fetch educations after deleting
        } catch (error) {
            console.error('Error deleting education', error);
        }
    };

    // Fetch educations on component mount
    useEffect(() => {
        const fetchEdu = async () => {
            try {
                const response = await fetch(`${route}/site-educations`);
    
                if (!response.ok) {
                    throw new Error('Failed to fetch educations');
                }
    
                const data = await response.json();
                setEducations(data);
            } catch (error) {
                console.error('Error fetching educations', error);
            }
        };
        fetchEdu();
    }, [route]);

    return (
        <EducationContext.Provider value={{ educations, addEducation, updateEducation, deleteEducation }}>
            {children}
        </EducationContext.Provider>
    );
};

export const useEducation = () => {
    return useContext(EducationContext);
};
