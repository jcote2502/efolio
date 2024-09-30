import React, { useEffect, useState } from 'react';
import { Button, VStack, HStack, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useSkills } from '../../contexts/Skill';
const SkillsForm = ({ onClose, selectedSkill = null }) => {
    const { addSkill, updateSkill, deleteSkill } = useSkills();

    const [skillForm, setSkillForm] = useState({
        skill: "",
        strength: "",
    });

    useEffect(() => {
        function setSkills() {
            if (selectedSkill) {
                setSkillForm(selectedSkill);
            }
        }
        setSkills();
    }, [selectedSkill])

    const strengths = [
        { label: 'proficient', value: '1' },
        { label: "intermediate", value: '2' },
        { label: "familiar", value: '3' },
    ]

    const handleSubmit = async () => {
        if (selectedSkill) {
            await updateSkill(skillForm)
        } else {
            await addSkill(skillForm)
        }
        onClose();
    }

    const handleDelete = async () => {
        deleteSkill(selectedSkill._id)
        onClose();
    }

    const handleFormChange = (e) => {
        setSkillForm({ ...skillForm, [e.target.name]: e.target.value });
    };


    return (
        <VStack spacing={4} p={5}>
            <FormControl>
                <FormLabel>New Skill</FormLabel>
                <Input
                    name="skill"
                    value={skillForm.skill}
                    onChange={handleFormChange}
                    placeholder='Enter Skill'
                />
            </FormControl>
            <FormControl>
                <FormLabel>Strength</FormLabel>
                <Select
                    placeholder='Select a Strength'
                    value={skillForm.strength}
                    onChange={handleFormChange}
                    name='strength'
                >
                    {strengths.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <HStack flex={1} spacing={4}>
                <Button colorScheme="green" onClick={() => handleSubmit()}>Submit</Button>
                <Button colorScheme="gray" onClick={() => onClose()}>Cancel</Button>
                {selectedSkill ? <Button colorScheme="red" onClick={() => handleDelete()}>Delete</Button> : null}
            </HStack>
        </VStack>
    );

}

export default SkillsForm;