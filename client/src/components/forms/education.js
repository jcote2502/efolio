import React, { useEffect, useState } from 'react';
import { Button, VStack, HStack, FormControl, FormLabel, Input, Select, IconButton, Text, Image } from '@chakra-ui/react';
import { useEducation } from '../../contexts/Education';
import { CloseIcon } from '@chakra-ui/icons';
import { UploadImage } from '../uploads/Photo';

// do NOT MODIFY

const EducationForm = ({ onClose, selectedEducation = null }) => {
    const { addEducation, updateEducation, deleteEducation } = useEducation();

    const [educationForm, setEducationForm] = useState({
        school: "",
        location: "",
        specificCollege: "",
        gpa: "",
        startDate: "",
        endDate: "",
        degreeLevel: "",
        degree: "",
        minor: "",
        achievements: [],
        associations: [],
        image: ""
    });

    const [newAchievement, setNewAchievement] = useState('');
    const [newAssociation, setNewAssociation] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endYear, setEndYear] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (selectedEducation) {
            setEducationForm(selectedEducation);
            if (selectedEducation.startDate) {
                const start = new Date(selectedEducation.startDate);
                setStartMonth(start.getMonth() + 1);
                setStartYear(start.getFullYear());
            }
            if (selectedEducation.endDate) {
                const end = new Date(selectedEducation.endDate);
                setEndMonth(end.getMonth() + 1);
                setEndYear(end.getFullYear());
            }
        }
    }, [selectedEducation]);

    const degrees = ["Diploma", "Associate", "Bachelor", "Master", "Doctorate"];

    const handleSubmit = async () => {
        const updatedForm = {
            ...educationForm,
            startDate: startYear && startMonth ? new Date(`${startYear}-${startMonth}-01`) : "",
            endDate: endYear && endMonth ? new Date(`${endYear}-${endMonth}-01`) : "",
        };

        if (selectedEducation) {
            await updateEducation(selectedEducation._id,updatedForm);
        } else {
            await addEducation(updatedForm);
        }
        onClose();
    };

    const handleDelete = async () => {
        deleteEducation(selectedEducation._id);
        onClose();
    };

    const handleFormChange = (e) => {
        setEducationForm({ ...educationForm, [e.target.name]: e.target.value });
    };

    const handleAddAchievement = () => {
        if (newAchievement.trim()) {
            setEducationForm({
                ...educationForm,
                achievements: [...educationForm.achievements, newAchievement],
            });
            setNewAchievement('');
        }
    };

    const handleAddAssociation = () => {
        if (newAssociation.trim()) {
            setEducationForm({
                ...educationForm,
                associations: [...educationForm.associations, newAssociation],
            });
            setNewAssociation('');
        }
    };

    const handleRemoveAchievement = (index) => {
        const updatedAchievements = educationForm.achievements.filter((_, i) => i !== index);
        setEducationForm({ ...educationForm, achievements: updatedAchievements });
    };

    const handleRemoveAssociation = (index) => {
        const updatedAssociations = educationForm.associations.filter((_, i) => i !== index);
        setEducationForm({ ...educationForm, associations: updatedAssociations });
    };

    const renderOptions = () => (
        Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
        ))
    );

    return (
        <VStack spacing={4} p={5}>
            {/* Existing Form Fields */}
            <FormControl>
                <FormLabel>School *</FormLabel>
                <Input
                    name="school"
                    value={educationForm.school}
                    onChange={handleFormChange}
                    placeholder='Required'
                />
            </FormControl>

            <FormControl>
                <FormLabel>Degree Level *</FormLabel>
                <Select
                    placeholder='required'
                    value={educationForm.degreeLevel}
                    onChange={handleFormChange}
                    name='degreeLevel'
                >
                    {degrees.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <FormLabel>Major *</FormLabel>
                <Input
                    name="degree"
                    value={educationForm.degree}
                    onChange={handleFormChange}
                    placeholder='required'
                />
            </FormControl>

            <FormControl>
                <FormLabel>Minor</FormLabel>
                <Input
                    name="minor"
                    value={educationForm.minor}
                    onChange={handleFormChange}
                    placeholder='optional'
                />
            </FormControl>

            <FormControl>
                <FormLabel>Start Date *</FormLabel>
                <HStack>
                    <Select
                        placeholder="Month"
                        value={startMonth}
                        onChange={(e) => setStartMonth(e.target.value)}
                    >
                        {renderOptions()}
                    </Select>
                    <Input
                        placeholder="Year"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                        type="number"
                    />
                </HStack>
            </FormControl>

            <FormControl>
                <FormLabel>End Date *</FormLabel>
                <HStack>
                    <Select
                        placeholder="Month"
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value)}
                    >
                        {renderOptions()}
                    </Select>
                    <Input
                        placeholder="Year"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        type="number"
                    />
                </HStack>
            </FormControl>

            <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                    name="location"
                    value={educationForm.location}
                    onChange={handleFormChange}
                    placeholder='optional'
                />
            </FormControl>

            <FormControl>
                <FormLabel>GPA</FormLabel>
                <Input
                    name="gpa"
                    value={educationForm.gpa}
                    onChange={handleFormChange}
                    placeholder='optional'
                />
            </FormControl>

            <FormControl>
                <FormLabel>Specific College</FormLabel>
                <Input
                    name="specificCollege"
                    value={educationForm.specificCollege}
                    onChange={handleFormChange}
                    placeholder='optional'
                />
            </FormControl>

            {/* Achievements Section */}
            <FormControl>
                <FormLabel>Achievements</FormLabel>
                <VStack align="stretch" spacing={2}>
                    {educationForm.achievements.map((achievement, index) => (
                        <HStack key={index} spacing={3}>
                            <Text fontSize='14px'>{achievement}</Text>
                            <IconButton
                                size="xs"
                                icon={<CloseIcon />}
                                onClick={() => handleRemoveAchievement(index)}
                                aria-label="Remove achievement"
                            />
                        </HStack>
                    ))}
                    <HStack>
                        <Input
                            placeholder="Add new achievement"
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                        />
                        <Button onClick={handleAddAchievement}>Add</Button>
                    </HStack>
                </VStack>
            </FormControl>

            {/* Associations Section */}
            <FormControl>
                <FormLabel>Associations</FormLabel>
                <VStack align="stretch" spacing={2}>
                    {educationForm.associations.map((association, index) => (
                        <HStack key={index} spacing={3}>
                            <Text>{association}</Text>
                            <IconButton
                                size="xs"
                                icon={<CloseIcon />}
                                onClick={() => handleRemoveAssociation(index)}
                                aria-label="Remove association"
                            />
                        </HStack>
                    ))}
                    <HStack>
                        <Input
                            placeholder="Add new association"
                            value={newAssociation}
                            onChange={(e) => setNewAssociation(e.target.value)}
                        />
                        <Button onClick={handleAddAssociation}>Add</Button>
                    </HStack>
                </VStack>
            </FormControl>
            
            {educationForm.image || imageUrl? <Image pt='15px' src={imageUrl || educationForm.image} boxSize="200px" objectFit='cover'/>: <Text pt="15px">Upload an Image Below</Text>}
            <UploadImage setParentForm={setEducationForm}  setImageUrl={setImageUrl}/>

            {/* Submit / Cancel / Delete Buttons */}
            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
                <Button colorScheme="gray" onClick={onClose}>Cancel</Button>
                {selectedEducation && <Button colorScheme="red" onClick={handleDelete}>Delete</Button>}
            </HStack>
        </VStack>
    );
};

export default EducationForm;
