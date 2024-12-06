// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  Grid, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import MainCard from 'components/MainCard';
import OrdersTable from './OrdersTable';
import NOData from '../../assets/images/users/nodata.jpg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Carousel from 'react-material-ui-carousel';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import { color } from 'framer-motion';


// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};



// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("id");
  const [date, setDate] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [aiResult, setAiResult] = useState(null); // hold ai response
  const [processing, setProcessing] = useState(false);
  const [imageView, setImageView] = useState(false);
  const [results, setResults] = useState({
    wasteType: '',
    quantity: '',
    confidence: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportloading, setReportLoading] = useState(false);
  const [balance, setRewardBalance] = useState(0); // Initialize balance state
  const [rewardReports, setRewardReports] = useState([]);

const [isopen, IssetOpen] = useState(false);
const [selectedReport, setSelectedReport] = useState(null);

const handleClickOpen = (report) => {
  setSelectedReport(report);
  IssetOpen(true);
};

const handleClickClose = () => {
  IssetOpen(false);
  setSelectedReport(null);
};

  

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get address from coordinates
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const address = response.data.display_name || 'Location not found';
            setLocation(address);
          } catch (error) {
            console.error('Error fetching address:', error);
            toast.error('Failed to fetch address.');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Geolocation permission denied.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchReports = useCallback(async () => {
    setReportLoading(true);
    setError(null);
    const userId = localStorage.getItem('id');

    try {
      const response = await axios.post('https://1eaf-49-43-3-43.ngrok-free.app/fetch_recent_reports', {
        user_id: userId,
      });

      if (response.status === 200) {
        setReports(response.data.reports); // Update state with fetched reports

      } else {
        setReports([]); // Set empty array if no reports found
      }
    } catch (err) {
      setError('Failed to fetch reports'); // Handle any errors
      console.error('Error fetching reports:', err);
    } finally {
      setReportLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);
  useEffect(() => {
    // Retrieve userId from localStorage
    const userId = localStorage.getItem('id');
    if (userId) {
      // Call getReports API using fetch with POST method
      fetch('https://1eaf-49-43-3-43.ngrok-free.app/get_reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch reports');
          }
          return response.json();
        })
        .then((data) => {
          if (data.reports) {
             setRewardReports(data.reports);
          }
          if (data.points) {
            setRewardBalance(data.points);
          } else {
            setError('No reports found.');
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      setError('User ID not found in localStorage');
    }
  }, []);


  const handleOpen = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
    setOpen(true);
    fetchLocation();
  };
  const handleClose = () => {
    setOpen(false);
    setLocation('');
    setImage(null);
    setAiResult(null);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageView(true)
      await processImageWithPrompt(file);
    } else {
      toast.error('Please upload a valid image file (JPG or JPEG)');
      setImageView(false)
      e.target.value = null;
    }
  };


  const processImageWithPrompt = async (file) => {
    try {
      setImageView(false)
      setProcessing(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];

        const requestPayload = {
          image: base64Image,
        };

        const response = await fetch('https://1eaf-49-43-3-43.ngrok-free.app/process_image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
        });

        const data = await response.json();

        if (response.ok) {
          const jsonMatch = data.text.match(/```json\n([\s\S]*?)\n```/);

          if (jsonMatch && jsonMatch[1]) {
            const aiData = JSON.parse(jsonMatch[1]);
            const { wasteType, quantity, confidence } = aiData;

            setResults({
              wasteType: wasteType || 'Unknown',
              quantity: quantity || 'N/A',
              confidence: confidence !== undefined ? `${confidence}` : 'N/A',
            });

            toast.success('Image processed successfully!');
            setImageView(true)
          } else {
            toast.error('Invalid JSON in AI response.');
          }
        } else {
          toast.error('Backend processing failed.');
        }
      };

      reader.onerror = () => {
        toast.error('Error reading image file.');
      };
    } catch (error) {
      console.error('Processing error:', error);
      setImageView(true)
      toast.error('Unexpected error during processing.');
    } finally {
      setProcessing(false);
    }
  };


  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    console.log("function called");
    setIsSubmitting(true);

    if (!location || !image) {
      toast.error('Please fill in all fields and upload an image.');
      return;
    }

    const userId = localStorage.getItem('id');
    console.log(userId);

    const base64Image = await convertImageToBase64(image);

    const reportData = {
      location,
      date,
      image: base64Image,
      waste_type: results.wasteType,
      quantity: results.quantity,
      confidence: results.confidence,
      user_id: userId,
    };


    await submitReportToFirestore(reportData);
    setIsSubmitting(false);


    handleClose();

    setLocation('');
    setDate('');
    setImage(null);
    setImagePreview(null);
    setResults({
      wasteType: '',
      quantity: '',
      confidence: '',
    });
  };

  const submitReportToFirestore = async (reportData) => {
    try {
      const response = await axios.post('https://1eaf-49-43-3-43.ngrok-free.app/submit_report', reportData);
      if (response.status === 200) {
        toast.success('Report submitted successfully!');
      } else {
        toast.error('Failed to submit the report.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Error submitting the report.');
    }
  };


  // Function to format timestamp to IST
  const formatDateToIST = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata', // Set time zone to India Standard Time (IST)
    };

    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between" >
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', }}>
              Your Recent Reports
            </Typography>
          </Grid>
        </Grid>

        {reportloading ? (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress size={45} color="secondary" />
  </Box>
) : (
  <>
    <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
      {reports.map((report, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: 2,
              border: '1px solid #ddd',
              '&:hover .hoverDetails': {
                opacity: 1,
              },
              cursor: 'pointer',
            }}
            onClick={() => handleClickOpen(report)} // Open dialog on click
          >
            <CardMedia
              component="img"
              height="300"
              image={report.image_url || NOData}
              alt="Report image"
              sx={{
                objectFit: 'cover',
                borderRadius: '12px',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
            <Box
              className="hoverDetails"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1" mb={1}>
                <strong>Date:</strong> {formatDateToIST(report.timestamp)}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> Not Collected
              </Typography>
            </Box>
          </Box>
         
        </Grid>
      ))}
    </Grid>

    {/* Dialog Component */}
    <Dialog open={isopen} onClose={handleClickClose} fullWidth maxWidth="sm">
      {selectedReport && (
        <>
          <DialogTitle>Report Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1" mb={2}>
              <strong>Location:</strong> {selectedReport.location}
            </Typography>
            <Typography variant="body1" mb={2}>
              <strong>Quantity:</strong> {selectedReport.quantity}
            </Typography>
            <Typography variant="body1" mb={2}>
              <strong>Waste Type:</strong> {selectedReport.waste_type}
            </Typography>
            <CardMedia
              component="img"
              height="300"
              image={selectedReport.image_url || NOData}
              alt="Report image"
              sx={{
                objectFit: 'cover',
                borderRadius: '12px',
                marginTop: 2,
              }}
            />
          </DialogContent>
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button onClick={handleClickClose} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </>
      )}
    </Dialog>
  </>
)}


      </Grid>



      <Grid item xs={12} md={4} lg={4} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Report Waste</Typography>
        <Grid>
          <MainCard sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report waste here by uploading the image . You will get the reward for it in a few seconds.
            </Typography>
            <Grid container spacing={2} justifyContent={'center'}>
              <Grid item xl={5}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Report Waste</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                value={location}
                disabled
                onChange={(e) => setLocation(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Date"
                variant="outlined"
                value={date}
                disabled
                sx={{ mb: 2 }}
              />
              <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Upload Image
                <input
                  type="file"
                  accept=".jpg, .jpeg"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {image && <Typography>Selected file: {image.name}</Typography>}
              {!imageView && imagePreview && (
                <Container
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30vh',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `url(${imagePreview}) center center / cover`,
                      filter: 'blur(8px)',
                      zIndex: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      textAlign: 'center',
                    }}
                  >
                    <ClipLoader size={50} color="white" loading={!imageView} />
                    <Typography variant="h5" gutterBottom color="white" sx={{ mt: 2 }}>
                      Wait for a While, AI is Detecting the Image
                    </Typography>
                  </Box>

                </Container>
              )}
              {imageView && imagePreview && (
                <Container
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    style={{
                      width: 'auto',
                      height: '30vh',
                      objectFit: 'contain',
                    }}
                  />
                </Container>
              )}
            </Box>
            {results.wasteType && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Waste Type"
                  value={results.wasteType}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Quantity"
                  value={results.quantity}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Confidence"
                  value={results.confidence}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Rewards History</Typography>
          </Grid>
          <Grid item />
          <MainCard sx={{ mt: 2 }} content={false}>
            {loading && <Typography>Loading...</Typography>}
            {!loading && (
              <>
                {meetings.length === 0 ? (
                  <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }} display={'flex'} flexDirection={'column'}>
                    <img
                      src={NOData}
                      alt="No meetings"
                      style={{ width: '50%', height: '50%' }}
                    />
                    <Typography variant="h5" align="center">No Rewards to show</Typography>
                  </Grid>
                ) : (
                  <List
                    component="nav"
                    sx={{
                      px: 0,
                      py: 0,
                      '& .MuiListItemButton-root': {
                        py: 1.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
                      },
                    }}
                  >
                    {meetings.map((meeting, index) => (
                      <ListItemButton key={index} divider onClick={() => handleMeetingClick(meeting.bot_id)}>
                        <ListItemAvatar>
                          <Avatar src={getMeetingLogo(meeting.meetingUrl)} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle1">{meeting.meetingUrl}</Typography>}
                          secondary={new Date(meeting.timestamp).toLocaleString()}
                        />
                        <ListItemSecondaryAction>
                          <Stack alignItems="flex-end">
                            <Typography variant="subtitle1" noWrap>
                            </Typography>
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </>
            )}
          </MainCard>
        </Grid> */}
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item >
            <Typography variant="h6" gutterBottom>
              Rewards History
            </Typography>
            <Card sx={{
              width: '150%',
              '@media (min-width: 1200px)': {
                width: '155%',
              },
            }}>
              <CardContent>
                {rewardReports.length > 0 ? (
                  rewardReports.map((report, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 1,
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {report.type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(report.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body3"
                        sx={{
                          color: report.type === 'Rewards Earned' ? 'green' : 'red',
                        }}
                      >
                        {report.type === 'Rewards Earned' ? '+' : '-'}
                        {report.amount}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No transactions yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>


        </Grid>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Grid>

  );
}
