import { Box, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";

// do NOT MODIFY

export const EducationCard = ({ education, isAdmin=false, onClick=()=>{}}) => {
    const [isHovered, setIsHovered] = useState(false);

    const {
        school,
        location,
        degree,
        degreeLevel,
        minor,
        gpa,
        startDate,
        endDate,
        achievements,
        associations,
        image,
        specificCollege
    } = education;

    return (
        <Box
            w={isAdmin? "300px" : "400px"}
            bg={isAdmin? "appColors.coffeeCream":'transparent'}
            color={isAdmin? "appColors.matteBlack":'white'}
            p={isAdmin? "2.5px":'5px'}
            borderRadius="10px"
            boxShadow="lg"
            m="3"
            position="relative"  
            onMouseEnter={() => setIsHovered(true)}  
            onMouseLeave={() => setIsHovered(false)} 
            onClick={()=>onClick()}
        >
            {/* Background Image */}
            {image && (
                <Box
                    as="img"
                    src={image}
                    alt={school}
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    boxSize='100%'
                    opacity={isHovered ? ".25" : "1"} 
                    zIndex={isHovered ? "0" : "2"}
                    objectFit="cover"
                    borderRadius="10px"
                />
            )}

            {/* Text Content */}
            <VStack zIndex="1" position="relative">
                <Text textAlign='center' fontSize={isAdmin? "24px" : "30px"} fontWeight="bold">{school}</Text>
                {specificCollege && <Text textAlign='center' fontSize={isAdmin? "24px" : "30px"} fontFamily="navbar">{specificCollege}</Text>}
                {location && <Text textAlign='center' fontSize={isAdmin? "16px" : "24px"} fontFamily="navbar">{location}</Text>}
                <Text textAlign='center' fontSize={isAdmin? "16px" : "24px"} fontFamily="navbar">{degreeLevel} in {degree}</Text>
                {minor && <Text textAlign='center' fontSize={isAdmin? "16px" : "24px"} fontFamily="navbar">Minor: {minor}</Text>}
                <Text  textAlign='center'fontSize={isAdmin? "16px" : "24px"} fontFamily="navbar">
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </Text>
                {gpa && <Text textAlign='center' fontSize={isAdmin? "16px" : "20px"} fontFamily="navbar">GPA: {gpa}</Text>}
                {achievements.length > 0 && (
                    <Text textAlign='center' fontSize={isAdmin? "12px" : "20px"} fontFamily="navbar">Achievements: {achievements.join(", ")}</Text>
                )}
                {associations.length > 0 && (
                    <Text textAlign='center' fontSize={isAdmin? "12px" : "20px"}  fontFamily="navbar">Associations: {associations.join(", ")}</Text>
                )}
            </VStack>
        </Box>
    );
};

