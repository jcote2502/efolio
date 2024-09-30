import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken } from '../utils';

// Create the ProjectContext
const ProjectContext = createContext();

// Provide the ProjectContext to components
export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const route = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/projects` : '/api/projects';

    const callRefresh = () => {
        setRefresh(!refresh);
    }

    // Fetch a specific project by ID
    const fetchProject = async (_id) => {
        try {
            const response = await fetch(`${route}/site-project/${_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }

            const project = await response.json();
            setProject(project);
        } catch (error) {
            console.error('Error fetching project', error);
        }
    };

    // Add new project
    const addProject = async (project) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${route}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ project }),
            });
            if (!response.ok) {
                throw new Error('Failed to add project');
            }
            const _id = await response.json();
            fetchProject(_id);
            setRefresh(!refresh);
            return (_id);
        } catch (error) {
            console.error('Error adding project', error);
        }
    };

    // Update specific project by id
    const updateProject = async (_id, updatedProject) => {
        const token = getAuthToken();
        const formData = new FormData();
        if (typeof updatedProject.image !== "string") {
            formData.append('image', updatedProject.image);
            formData.append('previousHref', project.image);
        }
        formData.append("project", JSON.stringify(updatedProject));

        try {
            const response = await fetch(`${route}/update-project-info/${_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            fetchProject(_id);
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error updating project', error);
        }
    };

    // Delete project by id
    const deleteProject = async (_id) => {
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
                throw new Error('Failed to delete project');
            }

            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting project', error);
        }
    };

    const addSection = async (_id, section) => {
        const token = getAuthToken();
        const formData = new FormData();
        if (typeof section.image !== "string") {
            formData.append('image', section.image);
        }
        formData.append("section", JSON.stringify(section));
        try {
            const response = await fetch(`${route}/add-section/${_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add project section');
            }

            fetchProject(_id);
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error add project section', error);
        }
    }

    const updateSection = async (_id, section) => {
        const token = getAuthToken();
        const formData = new FormData();
        if (typeof section.image !== "string") {
            formData.append('image', section.image);
        }
        formData.append("section", JSON.stringify(section));
        try {
            const response = await fetch(`${route}/update-section/${_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update project section');
            }

            fetchProject(_id);
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error updating project section', error);
        }
    }

    const deleteSection = async (_id, section) => {
        const token = getAuthToken();
        console.log(section);
        try {
            const response = await fetch(`${route}/delete-section/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ section })
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
            fetchProject(_id);
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting project', error);
        }
    }

    // Fetch projects on component mount
    useEffect(() => {
        const initialfetch = async () => {
            try {
                const response = await fetch(`${route}/site-projects`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                setProjects(data.projects.sort((a, b) => new Date(b.endDate) - new Date(a.endDate)));
            } catch (error) {
                console.error('Error fetching projects', error);
            }
        };
        initialfetch();
    }, [refresh,route]);

    return (
        <ProjectContext.Provider value={{ projects, project, callRefresh, addSection, updateSection, deleteSection, fetchProject, addProject, updateProject, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    return useContext(ProjectContext);
};
