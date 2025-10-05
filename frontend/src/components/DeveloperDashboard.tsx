import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, TextField, Box,
  Chip, Grid, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Slider
} from '@mui/material';
import { ethers } from 'ethers';
import { ComponentProps } from '../types';

const SKILL_MARKET_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with deployed address

interface Submission {
  id: number;
  codeHash: string;
  score: number;
  timestamp: string;
  status: string;
}

const DeveloperDashboard: React.FC<ComponentProps> = ({ account, signer }) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [skillScore, setSkillScore] = useState<number>(0);
  const [expectedSalary, setExpectedSalary] = useState<number>(50000);
  const [registerDialog, setRegisterDialog] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (account && signer) {
      checkRegistrationStatus();
      loadSubmissions();
    }
  }, [account, signer]);

  const checkRegistrationStatus = async () => {
    try {
      // This would check if developer is registered
      // For now, we'll simulate this
      setIsRegistered(false);
    } catch (error) {
      console.error("Failed to check registration:", error);
    }
  };

  const loadSubmissions = async () => {
    // Load developer's code submissions
    const mockSubmissions = [
      {
        id: 1,
        codeHash: "QmTest123",
        score: 85,
        timestamp: "2024-01-15",
        status: "Evaluated"
      },
      {
        id: 2,
        codeHash: "QmTest456",
        score: 92,
        timestamp: "2024-01-20",
        status: "Evaluated"
      }
    ];
    setSubmissions(mockSubmissions);
  };

  const handleRegister = async () => {
    try {
      // In real implementation, encrypt the values using FHEVM
      const encryptedScore = ethers.randomBytes(32);
      const encryptedSalary = ethers.randomBytes(32);
      
      // Mock transaction for demo
      console.log("Registering developer with score:", skillScore, "salary:", expectedSalary);
      
      setIsRegistered(true);
      setRegisterDialog(false);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (!isRegistered) {
    return (
      <Box>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Developer Registration
            </Typography>
            <Typography variant="body1" paragraph>
              Register as a developer to start submitting code and getting matched with jobs.
              Your skill score and salary expectations will be encrypted and kept private.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setRegisterDialog(true)}
              size="large"
            >
              Register as Developer
            </Button>
          </CardContent>
        </Card>

        <Dialog open={registerDialog} onClose={() => setRegisterDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Developer Registration</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Current Skill Score: {skillScore}</Typography>
              <Slider
                value={skillScore}
                onChange={(e, value) => setSkillScore(value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                label="Expected Annual Salary (USD)"
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="caption" color="text.secondary">
                Note: Your data will be encrypted using FHE and remain private
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRegisterDialog(false)}>Cancel</Button>
            <Button onClick={handleRegister} variant="contained">Register</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Developer Profile
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label="Registered" color="success" sx={{ mr: 1 }} />
                <Chip label="Active" color="primary" />
              </Box>
              <Typography variant="body2">
                Skill Score: Encrypted ●●●●●
              </Typography>
              <Typography variant="body2">
                Expected Salary: Encrypted ●●●●●
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Typography variant="h3" color="primary">
                {submissions.length}
              </Typography>
              <Typography variant="body2">
                Code Submissions
              </Typography>
              <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
                {submissions.filter(s => s.status === 'Evaluated').length}
              </Typography>
              <Typography variant="body2">
                Evaluations Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Code Submissions History
              </Typography>
              {submissions.map((submission) => (
                <Paper key={submission.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2">
                        {submission.codeHash}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Chip 
                        label={submission.status} 
                        color={submission.status === 'Evaluated' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Score: {submission.score}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2" color="text.secondary">
                        {submission.timestamp}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeveloperDashboard;