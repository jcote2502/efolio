import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Create the SkillsContext
const SkillsContext = createContext();

// Provide the SkillsContext to components
export const SkillsProvider = ({ children }) => {
    const [skills, setSkills] = useState([]);
    const route = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/skills` : '/api/skills';


    // Fetch all skills for the site
    const fetchSkills = async () => {
        try {
            const response = await fetch(`${route}/site-skills`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch skills');
            }

            const data = await response.json();
            setSkills(data.skills);
        } catch (error) {
            console.error('Error fetching skills', error);
        }
    };

    // Add new skill
    const addSkill = async (newSkill) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ skill: newSkill }),
            });

            if (!response.ok) {
                throw new Error('Failed to add skill');
            }
            fetchSkills();
        } catch (error) {
            console.error('Error adding skill', error);
        }
    };

    const updateSkill = async (newSkill) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${route}/update/${newSkill._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify(newSkill),
            });

            if (!response.ok) {
                throw new Error('Failed to update skill');
            }

            // Re-fetch skills after adding a new one
            fetchSkills();
        } catch (error) {
            console.error('Error adding skill', error);
        }
    }

    // Delete a skill by id
    const deleteSkill = async (_id) => {
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
                throw new Error('Failed to delete skill');
            }

            fetchSkills();
        } catch (error) {
            console.error('Error deleting skill', error);
        }
    };

    // Fetch skills on component mount
    useEffect(() => {
        const initialfetch = async () => {
            try {
                const response = await fetch(`${route}/site-skills`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch skills');
                }

                const data = await response.json();
                setSkills(data.skills);
            } catch (error) {
                console.error('Error fetching skills', error);
            }
        };
        initialfetch();
    }, [route]);

    return (
        <SkillsContext.Provider value={{ skills, updateSkill, addSkill, deleteSkill }}>
            {children}
        </SkillsContext.Provider>
    );
};

export const useSkills = () => {
    return useContext(SkillsContext);
}
