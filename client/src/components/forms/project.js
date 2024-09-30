import { useNavigate } from "react-router-dom";
import { useProject } from "../../contexts/Project"
import { useEffect, useState } from "react";
import { getDuration, renderMonthOptions, renderYearOptions, validateDates } from "../utils/dateTime";
import { Textarea, Button, Link as ChakraLink, VStack, HStack, FormControl, FormLabel, Input, Select, IconButton, Text, Image, Checkbox } from '@chakra-ui/react';
import { CloseIcon } from "@chakra-ui/icons";
import { UploadImage } from "../uploads/Photo";


export const AddProjectForm = ({ onClose }) => {
    const { addProject } = useProject();
    // const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [projectForm, setProjectForm] = useState({
        title: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        shortSummary: '',
        duration: '',
    });

    const [startMonth, setStartMonth] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endYear, setEndYear] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);

    const handleCheckboxChange = () => {
        setProjectForm({ ...projectForm, currentlyWorking: !isCurrent, endDate: null });
        setIsCurrent(!isCurrent);
        if (!isCurrent) {
            setEndMonth('');
            setEndYear('');
        }
    };

    const handleSubmit = async () => {
        // need to set duration in this step as well
        const startDate = new Date(`${startYear}-${startMonth}-01`);
        const stopDate = endYear && endMonth ? new Date(`${endYear}-${endMonth}-01`) : null;
        if (!validateDates(startDate, stopDate, isCurrent)) {
            // setError('Invalid Stop Date : Must be after Start Date.')
            return
        }
        const updatedForm = {
            ...projectForm,
            startDate: startYear && startMonth ? startDate : "",
            endDate: endYear && endMonth ? stopDate : "",
            duration: getDuration(startDate, stopDate),
        };
        console.log(updatedForm);
        const _id = await addProject(updatedForm);
        onClose();
        navigate(`/admin/project/${_id}`);
    };


    const handleFormChange = (e) => {
        setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
    };


    return (
        <VStack spacing={4} p={5}>
            <FormControl>
                <FormLabel>Title *</FormLabel>
                <Input
                    name='title'
                    value={projectForm.title}
                    onChange={handleFormChange}
                    placeholder="Project Title"
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
                <FormLabel>End Date *</FormLabel>
                <Checkbox
                    isChecked={projectForm.currentlyWorking}
                    onChange={handleCheckboxChange}
                >
                    Currently Working On
                </Checkbox>
                <HStack>
                    <Select
                        placeholder="Month"
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value)}
                        isDisabled={projectForm.currentlyWorking}
                    >
                        {renderMonthOptions()}
                    </Select>
                    <Select
                        placeholder="Year"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        isDisabled={projectForm.currentlyWorking}
                    >
                        {renderYearOptions()}
                    </Select>
                </HStack>
            </FormControl>

            <FormControl>
                <FormLabel>Short Summary *</FormLabel>
                <Textarea
                    name='shortSummary'
                    value={projectForm.shortSummary}
                    onChange={handleFormChange}
                    placeholder="shortSummary"
                    maxLength={75}
                />
                <Text textAlign='right' fontSize="sm" color="gray.500">
                    {projectForm.shortSummary.length}/75 characters
                </Text>
            </FormControl>

            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
                <Button colorScheme="gray" onClick={onClose}>Cancel</Button>
            </HStack>
        </VStack>
    )
}


export const EditProjectHeaderForm = ({ onClose }) => {

    const { project, updateProject } = useProject();
    // const [error, setError] = useState(null);

    const [projectForm, setProjectForm] = useState(project);

    const [newSkill, setNewSkill] = useState('');
    const [newLink, setNewLink] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endYear, setEndYear] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [imageUrl, setImageUrl] = useState('');


    useEffect(() => {
        const start = new Date(project.startDate);
        setStartMonth(start.getMonth() + 1);
        setStartYear(start.getFullYear());

        if (project.endDate) {
            const end = new Date(project.endDate);
            setEndMonth(end.getMonth() + 1);
            setEndYear(end.getFullYear());
        }
        if (project.currentlyWorking) {
            setIsCurrent(true);

        }
    }, [project])

    const handleCurrentChange = () => {
        setProjectForm({ ...projectForm, currentlyWorking: !isCurrent, endDate: null });
        setIsCurrent(!isCurrent);
        if (!isCurrent) {
            setEndMonth('');
            setEndYear('');
        }
    };

    const handleFeaturedChange = () => {
        setProjectForm({ ...projectForm, featured: !projectForm.featured });
    }

    const handleSubmit = async () => {
        // need to set duration in this step as well
        const startDate = new Date(`${startYear}-${startMonth}-01`);
        const stopDate = endYear && endMonth ? new Date(`${endYear}-${endMonth}-01`) : null;
        if (!validateDates(startDate, stopDate, isCurrent)) {
            // setError('Invalid Stop Date : Must be after Start Date.')
            console.log('hello');
            return
        }
        const updatedForm = {
            ...projectForm,
            startDate: startYear && startMonth ? startDate : "",
            endDate: endYear && endMonth ? stopDate : "",
            duration: getDuration(startDate, stopDate),
        };
        console.log(updatedForm);
        await updateProject(project._id, updatedForm);
        onClose();
    };


    const handleFormChange = (e) => {
        setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
    };


    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setProjectForm({
                ...projectForm,
                skills: [...projectForm.skills, newSkill],
            });
            setNewSkill('');
        }
    }

    const handleRemoveSkill = (index) => {
        const updatedSkills = projectForm.skills.filter((_, i) => i !== index);
        setProjectForm({ ...projectForm, skills: updatedSkills });
    }

    const handleAddLink = () => {
        if (newLink.trim()) {
            setProjectForm({
                ...projectForm,
                links: [...projectForm.links, newLink],
            });
            setNewLink('');
        }
    }

    const handleRemoveLink = (index) => {
        const updatedLinks = projectForm.links.filter((_, i) => i !== index);
        setProjectForm({ ...projectForm, links: updatedLinks });
    }


    return (
        <VStack spacing={4} p={5}>
            <FormControl>
                <FormLabel>Title *</FormLabel>
                <Input
                    name='title'
                    value={projectForm.title}
                    onChange={handleFormChange}
                    placeholder="Project Title"
                />
            </FormControl>

            <FormControl>
                <Checkbox
                    isChecked={projectForm.featured}
                    onChange={handleFeaturedChange}
                >
                    Featured
                </Checkbox>
            </FormControl>

            <FormControl>
                <FormLabel>Subtitle</FormLabel>
                <Input
                    name='subtitle'
                    value={projectForm.subtitle}
                    onChange={handleFormChange}
                    placeholder="Subtitle"
                />
            </FormControl>

            <FormControl>
                <FormLabel>Associated Company</FormLabel>
                <Input
                    name='associatedCompany'
                    value={projectForm.associatedCompany}
                    onChange={handleFormChange}
                    placeholder="Company"
                />
            </FormControl>

            <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                    name='location'
                    value={projectForm.location}
                    onChange={handleFormChange}
                    placeholder="Location"
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
                <FormLabel>End Date *</FormLabel>
                <Checkbox
                    isChecked={projectForm.currentlyWorking}
                    onChange={handleCurrentChange}
                >
                    Currently Working On
                </Checkbox>
                <HStack>
                    <Select
                        placeholder="Month"
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value)}
                        isDisabled={projectForm.currentlyWorking}
                    >
                        {renderMonthOptions()}
                    </Select>
                    <Select
                        placeholder="Year"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        isDisabled={projectForm.currentlyWorking}
                    >
                        {renderYearOptions()}
                    </Select>
                </HStack>
            </FormControl>

            <FormControl>
                <FormLabel>Short Summary *</FormLabel>
                <Textarea
                    name='shortSummary'
                    value={projectForm.shortSummary}
                    onChange={handleFormChange}
                    placeholder="Short Summary"
                    maxLength={75}
                    resize='none'
                />
                <Text textAlign='right' fontSize="sm" color="gray.500">
                    {projectForm.shortSummary.length}/75 characters
                </Text>
            </FormControl>

            <FormControl>
                <FormLabel>Skills</FormLabel>
                <VStack align="stretch" spacing={2}>
                    <HStack wrap='wrap'>
                        {projectForm.skills.map((skill, index) => (
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
                    </HStack>

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

            <FormControl>
                <FormLabel>Links</FormLabel>
                <VStack align="stretch" spacing={2}>
                    {projectForm.links.map((link, index) => (
                        <HStack key={index} spacing={3}>
                            <ChakraLink
                                key={index}
                                href={link}
                                isExternal
                                color="black"
                                fontSize="10px"
                                w='80%'
                            >
                                {link}
                            </ChakraLink>
                            <IconButton
                                size="xs"
                                icon={<CloseIcon />}
                                onClick={() => handleRemoveLink(index)}
                                aria-label="Remove Link"
                            />
                        </HStack>
                    ))}
                    <HStack>
                        <Input
                            placeholder="Add new Link"
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                        />
                        <Button onClick={handleAddLink}>Add</Button>
                    </HStack>
                </VStack>
            </FormControl>

            <FormControl>
                <FormLabel>Long Summary</FormLabel>
                <Textarea
                    name='summary'
                    value={projectForm.summary}
                    onChange={handleFormChange}
                    placeholder="Long Summary"
                    maxLength={1000}
                    rows={8}
                    resize='vertical'
                />
                <Text textAlign='right' fontSize="sm" color="gray.500">
                    {projectForm?.summary?.length || '0'}/1000 characters
                </Text>
            </FormControl>

            {project.image || imageUrl ? <Image pt='15px' src={imageUrl || project.image} boxSize="200px" objectFit='cover' /> : <Text pt="15px">Upload an Image Below</Text>}
            <UploadImage setParentForm={setProjectForm} setImageUrl={setImageUrl} />

            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
                <Button colorScheme="gray" onClick={onClose}>Cancel</Button>
            </HStack>
        </VStack>
    )


}


export const ProjectSectionForm = ({ onClose, _id = null, selectedSection = null }) => {
    const { addSection, updateSection, deleteSection } = useProject();

    const [sectionForm, setSectionForm] = useState({
        header: '',
        body: '',
        image: '',
    });
    const [imageUrl, setImageUrl] = useState('');


    useEffect(() => {
        if (selectedSection) {
            setSectionForm(selectedSection);
        }
    }, [selectedSection]);

    const handleFormChange = (e) => {
        setSectionForm({ ...sectionForm, [e.target.name]: e.target.value });
    }

    const handleDelete = async () => {
        await deleteSection(_id, selectedSection);
        onClose();
    }

    const handleSubmit = async () => {
        if (sectionForm.header === '' && sectionForm.body === '' && sectionForm.image === '') {
            return
        }
        if (selectedSection) {
            await updateSection(_id, sectionForm);
        } else {
            await addSection(_id, sectionForm);
        }
        onClose();
    }

    return (
        <VStack spacing={4} p={5}>
            <FormControl>
                <FormLabel>Header</FormLabel>
                <Input
                    name='header'
                    value={sectionForm.header}
                    onChange={handleFormChange}
                    placeholder="Header"
                />
            </FormControl>
            <FormControl>
                <FormLabel>Body</FormLabel>
                <Textarea
                    name='body'
                    value={sectionForm.body}
                    onChange={handleFormChange}
                    placeholder="Body"
                    maxLength={1500}
                    resize='vertical'
                    rows='10'
                />
            </FormControl>

            {sectionForm.image || imageUrl ? <Image pt='15px' src={imageUrl || sectionForm.image} boxSize="200px" objectFit='cover' /> : <Text pt="15px">Upload an Image Below</Text>}
            <UploadImage setParentForm={setSectionForm} setImageUrl={setImageUrl} />

            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
                <Button colorScheme="gray" onClick={onClose}>Cancel</Button>
                {selectedSection && <Button colorScheme="red" onClick={handleDelete}>Delete</Button>}
            </HStack>
        </VStack>
    )
}