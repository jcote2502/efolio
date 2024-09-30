import { VStack, Text, HStack } from "@chakra-ui/react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const Footer = ({ isAdmin = false }) => {
    const navigate = useNavigate();
    return (
        <>
            {isAdmin ?
                <NavBar isAdmin={isAdmin} />
                :
                <VStack maxW='100%' position='relative'>
                    <NavBar />
                    <HStack position='absolute' bottom='30px' minW='100px' color="gray.500" >
                        <>
                            <Text>Powered Using CoyoteWebEngine; For more visit</Text>
                            <Text cursor='pointer' color='appColors.pastelYellow' onClick={() => { navigate('/projects') }}>Projects</Text>
                        </>
                    </HStack>
                </VStack>}
        </>
    )
}
export default Footer;