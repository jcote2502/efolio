import { Button, VStack } from "@chakra-ui/react";
import Footer from "./Footer";
import NavBar from "./NavBar";


const PageFrame = ({ isAdmin = false, children }) => {
    return (
        <>
            <VStack justifyContent='center' w='80%'>
                <NavBar isAdmin={isAdmin} />
                {children}
            </VStack>
            <Footer isAdmin={isAdmin} />
        </>
    );
}

export const PageButton = ({ onClick, children }) => (
    <Button w='150px' onClick={onClick}>{children}</Button>
)

export default PageFrame;