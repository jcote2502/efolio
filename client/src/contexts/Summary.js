import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Create the SummaryContext
const SummaryContext = createContext();

// Provide the SummaryContext to components
export const SummaryProvider = ({ children }) => {
    const [summary, setSummary] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const route = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/summaries` : '/api/summaries';

    const callRefresh = () => {
        setRefresh(!refresh);
    }

    // Add new summary
    const addSummary = async (newSummary) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ newSummary }),
            });

            if (!response.ok) {
                throw new Error('Failed to add summary');
            }

            setRefresh(!refresh)
        } catch (error) {
            console.error('Error adding summary', error);
        }
    };

    // Update specific summary by id
    const updateSummary = async (newSummary) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/update-summary/${summary._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ newSummary }),
            });

            if (!response.ok) {
                throw new Error('Failed to update summary');
            }

            setRefresh(!refresh)
        } catch (error) {
            console.error('Error updating summary', error);
        }
    };

    // Delete summary by id
    const deleteSummary = async (_id) => {
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
                throw new Error('Failed to delete summary');
            }

            setRefresh(!refresh)
        } catch (error) {
            console.error('Error deleting summary', error);
        }
    };

    // Fetch summaries on component mount
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(`${route}/user-summary`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch summaries');
                }

                const data = await response.json();
                setSummary(data.summary);
            } catch (error) {
                console.error('Error fetching summaries', error);
            }
        };
        fetchSummary();
    }, [refresh, route]);

    return (
        <SummaryContext.Provider value={{ summary, callRefresh, addSummary, updateSummary, deleteSummary }}>
            {children}
        </SummaryContext.Provider>
    );
};

export const useSummary = () => {
    return useContext(SummaryContext);
};
