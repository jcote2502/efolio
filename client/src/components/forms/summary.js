import React, { useEffect, useState } from 'react';
import { Box, Button, Textarea, VStack, HStack } from '@chakra-ui/react';
import { useSummary } from '../../contexts/Summary';

const SummaryForm = ({ onClose }) => {
    const [text, setText] = useState('');
    const { summary, callRefresh, addSummary, updateSummary } = useSummary();

    useEffect(() => {
        setText(summary?.summary)
    }, [summary])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!summary?.summary) {
            await addSummary(text);
        } else {
            await updateSummary(text);
        }
        callRefresh();
        onClose();
    };

    return (
        <Box as='form' onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Summary"
                    size="md"
                    rows={8}
                    resize='vertical'
                />
                <HStack flex={1} spacing={4}>
                    <Button type="submit" colorScheme="green">Submit</Button>
                    <Button colorScheme="gray" onClick={() => onClose()}>Cancel</Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default SummaryForm;
