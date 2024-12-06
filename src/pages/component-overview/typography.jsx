import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Divider } from '@mui/material';

export default function ComponentTypography() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0); // Initialize balance state

 
  const rewards = [
    { id: 1, name: 'Gift Card', cost: 50, description: 'A $10 gift card', collectionInfo: 'Delivered via email.' },
    { id: 2, name: 'Coffee Mug', cost: 30, description: 'A branded coffee mug', collectionInfo: 'Shipped to your address.' },
  ];

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
            setReports(data.reports);
          }
          if (data.points) {
            setBalance(data.points);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Rewards Dashboard
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'gray' }}>
        Track your progress, redeem points, and explore upcoming features.
      </Typography>
      
      <Card sx={{ mb: 3, backgroundColor: '#F5F5F5', p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reward Balance
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: '#1976D2' }}>
              {balance}/100
            </Typography>
            <Typography variant="body1" sx={{ ml: 2 }}>
              Available Points
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Earn more points by completing activities and submitting reports.
          </Typography>
        </CardContent>
      </Card>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          <Card>
            <CardContent>
              {reports.length > 0 ? (
                reports.map((report, index) => (
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

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Available Rewards
          </Typography>
          <Grid container spacing={2}>
            {rewards.length > 0 ? (
              rewards.map((reward) => (
                <Grid item xs={12} sm={6} key={reward.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {reward.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {reward.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                        {reward.collectionInfo}
                      </Typography>
                      <Button variant="contained" fullWidth>
                        Redeem for {reward.cost} points
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    No rewards available at the moment.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Reward Tips
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Maximize your points by:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">Submitting detailed and timely reports.</Typography>
          </li>
          <li>
            <Typography variant="body2">Participating in bonus activities.</Typography>
          </li>
          <li>
            <Typography variant="body2">Redeeming rewards during promotional periods.</Typography>
          </li>
        </ul>
      </Box>

      <Divider sx={{ my: 4 }} />
      <Box>
        <Typography variant="h6" gutterBottom>
          Upcoming Features
        </Typography>
        <Typography variant="body2" color="textSecondary">
          We're working on:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">Exclusive rewards for top earners.</Typography>
          </li>
          <li>
            <Typography variant="body2">Weekly point boosters for regular participants.</Typography>
          </li>
          <li>
            <Typography variant="body2">Enhanced reward redemption options.</Typography>
          </li>
        </ul>
      </Box>
    </Box>
  );
}
