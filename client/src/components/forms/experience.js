import { useEffect, useState } from "react";
import { useExperience } from "../../contexts/Experience"
import { Textarea, Button, VStack, HStack, FormControl, FormLabel, Input, Select, IconButton, Text, Image, Checkbox } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { UploadImage } from "../uploads/Photo";
import { getDuration, renderMonthOptions, renderYearOptions, validateDates } from "../utils/dateTime";


const ExperienceForm = ({ onClose, selectedExperience = null }) => {

    const { addExperience, updateExperience, deleteExperience } = useExperience();
    const [previousHref, setPreviousHref] = useState('');
    // const [error, setError] = useState(null)

    const [experienceForm, setExperienceForm] = useState({
        title: '',
        company: '',
        startDate: '',
        stopDate: '',
        stillEmployed: false,
        duration: '',
        location: '',
        description: '',
        skills: [],
        image: '',
    })

    const [newSkill, setNewSkill] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endYear, setEndYear] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState(false);

    useEffect(() => {
        if (selectedExperience) {
            setExperienceForm(selectedExperience);
            if (selectedExperience.startDate) {
                const start = new Date(selectedExperience.startDate);
                setStartMonth(start.getMonth() + 1);
                setStartYear(start.getFullYear());
            }
            if (selectedExperience.stopDate) {
                const end = new Date(selectedExperience.stopDate);
                setEndMonth(end.getMonth() + 1);
                setEndYear(end.getFullYear());
            }
            if (selectedExperience.stillEmployed){
                setIsCurrentlyEmployed(true);
            }
            setPreviousHref(selectedExperience.image)

        }
    }, [selectedExperience])

    const handleCheckboxChange = () => {
        setExperienceForm({ ...experienceForm, stillEmployed: !isCurrentlyEmployed, stopDate: null });
        setIsCurrentlyEmployed(!isCurrentlyEmployed);
        if (!isCurrentlyEmployed) {
            setEndMonth('');
            setEndYear('');
        }

    };

    const handleSubmit = async () => {
        // need to set duration in this step as well
        const startDate = new Date(`${startYear}-${startMonth}-01`);
        const stopDate = endYear && endMonth ? new Date(`${endYear}-${endMonth}-01`) : null;
        if (!validateDates(startDate, stopDate, isCurrentlyEmployed)) {
            // setError('Invalid Stop Date : Must be after Start Date.')
            return
        }
        const updatedForm = {
            ...experienceForm,
            startDate: startYear && startMonth ? startDate : "",
            stopDate: endYear && endMonth ? stopDate : "",
            duration: getDuration(startDate, stopDate),
        };
        if (selectedExperience) {
            await updateExperience(selectedExperience._id, updatedForm, previousHref);
        } else {
            await addExperience(updatedForm);
        }
        onClose();
    };

    const handleDelete = async () => {
        deleteExperience(selectedExperience._id);
        onClose();
    }

    const handleFormChange = (e) => {
        setExperienceForm({ ...experienceForm, [e.target.name]: e.target.value });
    }

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setExperienceForm({
                ...experienceForm,
                skills: [...experienceForm.skills, newSkill],
            });
            setNewSkill('');
        }
    }

    const handleRemoveSkill = (index) => {
        const updatedSkills = experienceForm.skills.filter((_, i) => i !== index);
        setExperienceForm({ ...experienceForm, skills: updatedSkills });
    }


    return (
        <VStack spacing={4} p={5}>
            <FormControl>
                <FormLabel>Job Title *</FormLabel>
                <Input
                    name='title'
                    value={experienceForm.title}
                    onChange={handleFormChange}
                    placeholder="Required"
                />
            </FormControl>

            <FormControl>
                <FormLabel>Company *</FormLabel>
                <Input
                    name='company'
                    value={experienceForm.company}
                    onChange={handleFormChange}
                    placeholder="Required"
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
                        {renderMonthOptions()}
                    </Select>
                    <Select
                        placeholder="Year"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                    >
                        {renderYearOptions()}
                    </Select>
                </HStack>
            </FormControl>

            <FormControl>
                <FormLabel>End Date</FormLabel>
                <Checkbox
                    isChecked={experienceForm.stillEmployed}
                    onChange={handleCheckboxChange}
                >
                    Currently Employed
                </Checkbox>
                <HStack>
                    <Select
                        placeholder="Month"
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value)}
                        isDisabled={experienceForm.stillEmployed}
                    >
                        {renderMonthOptions()}
                    </Select>
                    <Select
                        placeholder="Year"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        isDisabled={experienceForm.stillEmployed}
                    >
                        {renderYearOptions()}
                    </Select>
                </HStack>
            </FormControl>

            <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                    name='description'
                    value={experienceForm.description}
                    onChange={handleFormChange}
                    placeholder="description"
                    maxLength={375}
                />
            </FormControl>

            <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                    name='location'
                    value={experienceForm.location}
                    onChange={handleFormChange}
                    placeholder="location"
                />
            </FormControl>

            <FormControl>
                <FormLabel>Skills</FormLabel>
                <VStack align="stretch" spacing={2}>
                    {experienceForm.skills.map((skill, index) => (
                        <HStack key={index} spacing={3}>
                            <Text fontSize='14px'>{skill}</Text>
                            <IconButton
                                size="xs"
                                icon={<CloseIcon />}
                                onClick={() => handleRemoveSkill(index)}
                                aria-label="Remove Skill"
                            />
                        </HStack>
                    ))}
                    <HStack>
                        <Input
                            placeholder="Add new skill"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <Button onClick={handleAddSkill}>Add</Button>
                    </HStack>
                </VStack>
            </FormControl>

            {experienceForm.image || imageUrl ? <Image pt='15px' src={imageUrl || experienceForm.image} boxSize="200px" objectFit='cover' /> : <Text pt="15px">Upload an Image Below</Text>}
            <UploadImage setParentForm={setExperienceForm} setImageUrl={setImageUrl} />

            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
                <Button colorScheme="gray" onClick={onClose}>Cancel</Button>
                {selectedExperience && <Button colorScheme="red" onClick={handleDelete}>Delete</Button>}
            </HStack>
        </VStack>
    )

}

export default ExperienceForm;