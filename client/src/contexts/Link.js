import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Create the LinkContext
const LinkContext = createContext();

// Provide the LinkContext to components
export const LinkProvider = ({ children }) => {
    const [links, setLinks] = useState([]);
    const route = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/links` :  '/api/links';



    // Fetch all links for the site
    const fetchLinks = async () => {
        try {
            const response = await fetch(`${route}/site-links`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch links');
            }

            const data = await response.json();
            setLinks(data);
        } catch (error) {
            console.error('Error fetching links', error);
        }
    };

    // Create a New Link
    const addLink = async (link) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({link}),
            });

            if (!response.ok) {
                throw new Error('Failed to update link');
            }

            fetchLinks();
        } catch (error) {
            console.error('Error updating link', error);
        }
    };

    // Update specific link by id
    const updateLink = async (updatedData) => {
        const token = getAuthToken();
        const href = updatedData.href;
        const platform = updatedData.platform;
        const siteHandle = updatedData.siteHandle;
        try {
            const response = await fetch(`${route}/update-link/${updatedData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({href, siteHandle, platform}),
            });

            if (!response.ok) {
                throw new Error('Failed to update link');
            }
            
            fetchLinks();
        } catch (error) {
            console.error('Error updating link', error);
        }
    };

    // Delete a skill by id
    const deleteLink = async (_id) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/delete/${_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete link');
            }

            fetchLinks();
        } catch (error) {
            console.error('Error deleting link', error);
        }
    };

    // Fetch links on component mount
    useEffect(() => {
        const initialfetch = async () => {
            try {
                const response = await fetch(`${route}/site-links`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch links');
                }
    
                const data = await response.json();
                setLinks(data);
            } catch (error) {
                console.error('Error fetching links', error);
            }
        };
        initialfetch();
        }, [route]);

    return (
        <LinkContext.Provider value={{ links, deleteLink, addLink, updateLink }}>
            {children}
        </LinkContext.Provider>
    );
};

export const useLink = () => {
    return useContext(LinkContext);
};
