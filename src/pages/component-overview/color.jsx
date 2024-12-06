import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material-ui imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress';
import 'boxicons/css/boxicons.min.css';
import Badge from '@mui/material/Badge';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import avatar5 from 'assets/images/users/avatar-5.png';
// chart imports
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// project imports
import MainCard from 'components/MainCard';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export default function LeaderTable() {
  const [leaderData, setLeaderData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Global Stats state
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 1000,
    totalPoints: 5000
  });
  useEffect(() => {
    // Function to fetch leaderboard data from API
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://1eaf-49-43-3-43.ngrok-free.app/fetch_leaderboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            limit: 10, // Optionally adjust limit
            order_by: 'report_count'
          })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        const sortedData = data.leaderboard.sort((a, b) => a.rank - b.rank);
        
        setLeaderData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  const barData = {
    labels: leaderData.map((leader) => leader.user_name),
    datasets: [
      {
        label: 'Points Earned',
        data: leaderData.map((leader) => leader.points),
        backgroundColor: leaderData.map((_, index) => {
          const colors = [
            '#FF6384', // Red
            '#36A2EB', // Blue
            '#FFCE56', // Yellow
            '#4BC0C0', // Teal
            '#9966FF', // Purple
            '#FF9F40', // Orange
            '#E7E9ED', // Grey
            '#8E44AD', // Violet
            '#2ECC71', // Green
            '#E74C3C' // Crimson
          ];
          return colors[index % colors.length]; // Cycle through the colors
        }),
        borderColor: leaderData.map((_, index) => {
          const borderColors = [
            '#FF3D67', // Darker red
            '#2A89C8', // Darker blue
            '#E6B416', // Darker yellow
            '#3FA9A8', // Darker teal
            '#7B47E3', // Darker purple
            '#E68A31', // Darker orange
            '#C0C2C4', // Darker grey
            '#742A92', // Darker violet
            '#27AE60', // Darker green
            '#C0392B' // Darker crimson
          ];
          return borderColors[index % borderColors.length];
        }),
        borderWidth: 1,
        barThickness: 25, // Set the bar width
        maxBarThickness: 30 // Optional: restrict the maximum width
      }
    ]
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Points Earned by Users'
      }
    }
  };
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Leaderboard" sx={{ bgcolor: 'white', color: 'black' }}>
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: 'white',
                color: 'black'
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: '#F4F4F4' }}>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="h6">#</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Rank</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Status</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Report Count</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Points Earned</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderData.map((leader, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: '#F0F8FF',
                        },
                      }}
                    >
                      <TableCell align="center">

                        <Typography>{index + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar alt={leader.user_name} src={avatar1} />
                          <Typography>{leader.user_name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>{leader.rank}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: leader.status === 'Active' ? 'green' : 'green',
                            fontWeight: 'bold',
                          }}
                        >
                          {leader.status || 'Active Member'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{leader.report_count}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{leader.points}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
        {/* Leaderboard Bar Graph */}
        <Grid item xs={12}>
          <MainCard title="Points Visualization">
            <Bar data={barData} options={barOptions} />
          </MainCard>
        </Grid>
        {/* Global Stats Section */}
        <Grid item xs={12}>
          <Card>
            <div className="global-stats" style={{ padding: '16px' }}>
              <Typography variant="h5" className="section-title">
                Global Stats
              </Typography>
              <Box className="global-stats" sx={{ padding: 2 }}>
                <Typography variant="h4" className="section-title" sx={{ fontWeight: 'bold' }}>
                  Global Stats
                </Typography>
                <Box
                  className="stats-grid"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 3,
                    marginTop: 2
                  }}
                >
                  <Box className="stat-item" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <i className="bx bx-user" style={{ fontSize: '32px', color: '#1976D2' }}></i> {/* Boxicon for user */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Total Users: {globalStats.totalUsers}
                    </Typography>
                  </Box>
                  <Box className="stat-item" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <i className="bx bx-group" style={{ fontSize: '32px', color: '#1976D2' }}></i> {/* Boxicon for group */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Total Points: {globalStats.totalPoints}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </div>
          </Card>
        </Grid>
        {/* Leaderboard Table */}
      </Grid>
    </Box>
  );
}
LeaderTable.propTypes = {
  leaderData: PropTypes.array
};