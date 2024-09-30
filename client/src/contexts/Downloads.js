import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Create the DownloadContext
const DownloadContext = createContext();

// Provide the DownloadContext to components
export const DownloadProvider = ({ children }) => {
    const [downloads, setDownloads] = useState(null);
    const [resume, setResume] = useState(null);
    const route = '/downloads';


    // Fetch downloads for the site
    const fetchDownloads = async () => {
        try {
            const response = await fetch(`${route}/site-downloads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch downloads');
            }

            const data = await response.json();
            setDownloads(data);
        } catch (error) {
            console.error('Error fetching downloads', error);
        }
    };


    const fetchResume = async () => {
        try {
            const response = await fetch(`${route}/site-resume`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch downloads');
            }

            const data = await response.json();

            setResume(data);
        } catch (error) {
            console.error('Error fetching downloads', error);
        }
    }

    const addResume = async (resume) => {
        const token = getAuthToken();
        const formData = new FormData();

        formData.append('resume', resume);

        try {
            const response = await fetch(`${route}/add-resume`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add Resume');
            }

            fetchResume(); // Re-fetch resume after adding a new one
        } catch (error) {
            console.error('Error adding Resume', error);
        }
    }

    // use id from resume object
    const updateResume = async (resume) => {

    }


    // Fetch a specific download by ID
    const fetchDownloadById = async (_id) => {
        try {
            const response = await fetch(`${route}/site-download/${_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch download');
            }

            const data = await response.json();
            return data.download;
        } catch (error) {
            console.error(`Error fetching download (${_id})`, error);
        }
    };

    // Add a new download
    const addDownload = async (_id, file, name) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);

        try {
            const response = await fetch(`${route}/add-download/${_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add download');
            }

            const newDownload = await response.json();
            setDownloads((prevDownloads) => [...prevDownloads, newDownload]);
        } catch (error) {
            console.error('Error adding download', error);
        }
    };

    // Delete a download by ID
    const deleteDownload = async (_id) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/delete/${_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete download');
            }

            setDownloads((prevDownloads) => prevDownloads.filter((download) => download._id !== _id));
        } catch (error) {
            console.error('Error deleting download', error);
        }
    };

    // Fetch downloads on component mount
    useEffect(() => {
        fetchDownloads();
        fetchResume();
    }, []);

    return (
        <DownloadContext.Provider value={{ downloads, resume, updateResume, fetchResume, addResume, fetchDownloadById, addDownload, deleteDownload }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownloads = () => {
    return useContext(DownloadContext);
};
