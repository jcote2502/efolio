import { Center, Spinner} from "@chakra-ui/react";

// used for manipulating local authToken
export const saveAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const destroyAuthToken = () => {
    localStorage.removeItem('authToken');
}

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
}

// used for render loading pages when fetching data
export const renderLoading = () => {
    return (
        <Center mt={10}>
            <Spinner size='xl' />
        </Center>
    );
};

