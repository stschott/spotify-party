import React, { useEffect } from 'react';

const CreatePage = ({history}) => {

    useEffect(() => {
        (async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                
                const createResponse = await fetch(`/party/create?code=${code}`);
                const createData = await createResponse.json();
                history.push(`/${createData.ownerId}`);
            } catch (err) {
                console.log(err);
            }
        })(); 
    }, []);

    return (
        <>
        </>
    )
};

export default CreatePage;
