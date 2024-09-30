import { HStack, Text } from "@chakra-ui/react";
import { useState } from "react";


export const SkillCard = ({ item, index }) => {
    var fs = '32px';
    var cl = 'black';
    if (item.strength === "1") { fs = '32px' }
    else if (item.strength === "2") { fs = '26px'; cl = 'rgb(50,52,51)' }
    else { fs = '22px'; cl = 'rgb(100,102,101)' }
    return (
        <Text p='5px' textAlign='center' maxW='500px' minW='200px' color={cl} fontSize={fs} key={index}>
            {item.skill}
        </Text>
    )
};

export const AdminSkillDisplay = ({ item, index ,onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        < HStack
            bgColor={isHovered? 'appColors.greyGoose': 'transparent'}
            key={index}
            cursor='pointer'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            p='5px'
            borderRadius='10px'
            onClick={()=>onClick()}
        >
            <Text>{item.skill}</Text>
        </HStack>
        )
}