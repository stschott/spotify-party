import React, { useEffect, useState, useContext } from 'react';
import { Container } from '@material-ui/core';
import OwnerScreen from '../OwnerScreen/OwnerScreen';
import UserScreen from '../UserScreen/UserScreen';
import Toast from '../Toast/Toast';
import { ToastContext } from '../../contexts/ToastContext';

const UserPage = ({match}) => {
    const { toast } = useContext(ToastContext);
    const [partyData, setPartyData] = useState();
    const id = match.params.id;

    useEffect(() => {
        async function getParty() {
            try {
                const partyResponse = await fetch(`/${id}`);
                const partyResponseData = await partyResponse.json();
                setPartyData(partyResponseData);
            } catch (err) {
                setPartyData( { error: { message: err.message } } );
            }
            
        }
        getParty();
    }, []);

    const renderContent = () => {
        if (!partyData) {
            // Put in loading indicator
            return "";
        }  

        if (partyData.error) {
            return partyData.error.message;
        } else if (partyData.owner){
            return <OwnerScreen userId={partyData.userId} />;
        } else {
            return <UserScreen userId={partyData.userId} />;
        }
    };

    return (
        <>
            <Toast active={toast.active} type={toast.type} message={toast.message}/>
            <Container>
                {renderContent()}
            </Container>
        </>
    )
};

export default UserPage;
