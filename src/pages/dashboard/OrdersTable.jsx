import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Material-UI imports

import Box from '@mui/material/Box';
import NOData from '../../assets/images/users/000.png';
// ==============================|| ORDER TABLE ||============================== //
// Main component
export default function OrderTable({ botData = [], meetingData = [], is_last_meeting = null }) {
  // Log botData and meetingData when component mounts or updates
  useEffect(() => {
    console.log('Bot Data from comp:', botData);
    console.log('Meeting Data from comp:', meetingData);
    console.log('Is Last Meeting:', is_last_meeting);
    // Fetch the recording URL from meetingData if available
    if (meetingData && meetingData.mp4_url) {
      setRecordingUrl(meetingData.mp4_url);
    }
  }, [botData, meetingData, is_last_meeting]); // Dependency array to re-run effect when these change
  // Handle tab change

 
  return (
    <Box>
  

    </Box>
  );
}
// PropTypes for validation
OrderTable.propTypes = {
  botData: PropTypes.any, // Ensure botData is passed
  meetingData: PropTypes.object, // Ensure meetingData is an object
  is_last_meeting: PropTypes.bool // Expecting a boolean value
};
