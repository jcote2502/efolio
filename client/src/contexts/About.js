import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Create the AboutContext
const AboutContext = createContext();

// Provide the AboutContext to components
export const AboutProvider = ({ children }) => {
    const [about, setAbout] = useState(null); // Changed to null for a single about section
    const [refresh, setRefresh] = useState(false);
    const route = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/abouts` :  '/api/abouts';

    const callRefresh = () => {
        setRefresh(!refresh);
    };

    const addSection = async (newSection) => {
        const token = getAuthToken();
        console.log(newSection);
        try {
            const formData = new FormData();
            formData.append('newSection', JSON.stringify(newSection));

            if (newSection.image) {
                formData.append('image', newSection.image);
            }
            if (newSection.video) {
                formData.append('video', newSection.video);
            }

            const response = await fetch(`${route}/create`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add section');
            }

            callRefresh();
        } catch (error) {
            console.error('Error adding section', error);
        }
    };

    // Update an existing section
    const updateSection = async (_id, updatedSection, previousHref) => {
        const token = getAuthToken();
        console.log(updatedSection)
        try {
            const formData = new FormData();
            formData.append('updatedSection', JSON.stringify(updatedSection));

            if (updatedSection.image) {
                formData.append('image', updatedSection.image);
            }
            if (updatedSection.video) {
                formData.append('video', updatedSection.video);
            }
            if (previousHref){
                formData.append('previousHref', previousHref);
            }

            const response = await fetch(`${route}/update-section/${_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update section');
            }

            callRefresh();
        } catch (error) {
            console.error('Error updating section', error);
        }
    };

    // Delete a section
    const deleteSection = async (_id) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${route}/delete-section/${_id}`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete section');
            }

            callRefresh();
        } catch (error) {
            console.error('Error deleting section', error);
        }
    };

    // Fetch about section on component mount
    useEffect(() => {
        async function fetchAbout() {
            try {
                const response = await fetch(`${route}/site-about`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch about section');
                }
                const data = await response.json();
                setAbout(data);
            } catch (error) {
                console.error('Error fetching about section', error);
            }
        }
        fetchAbout();
    }, [refresh,route]);

    return (
        <AboutContext.Provider value={{ about, addSection, deleteSection, updateSection }}>
            {children}
        </AboutContext.Provider>
    );
};

export const useAbout = () => {
    return useContext(AboutContext);
};
