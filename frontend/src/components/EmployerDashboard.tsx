import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, TextField, Box,
  Chip, Grid, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Slider, List, ListItem, ListItemText
} from '@mui/material';
import { ComponentProps } from '../types';

interface JobData {
  id: number;
  description: string;
  requiredScore: number;
  offeredSalary: number;
  status: string;
  applicants: number;
}

interface MatchData {
  id: number;
  jobId: number;
  jobTitle: string;
  developerScore: string;
  status: string;
  matchDate: string;
}

interface NewJob {
  description: string;
  requiredScore: number;
  offeredSalary: number;
}

const EmployerDashboard: React.FC<ComponentProps> = ({ account, signer }) => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [jobDialog, setJobDialog] = useState<boolean>(false);
  const [newJob, setNewJob] = useState<NewJob>({
    description: '',
    requiredScore: 70,
    offeredSalary: 80000
  });

  useEffect(() => {
    if (account && signer) {
      loadJobs();
      loadMatches();
    }
  }, [account, signer]);

  const loadJobs = async () => {
    const mockJobs = [
      {
        id: 1,
        description: "Senior Solidity Developer",
        requiredScore: 85,
        offeredSalary: 120000,
        status: "Open",
        applicants: 3
      },
      {
        id: 2,
        description: "DeFi Protocol Developer", 
        requiredScore: 90,
        offeredSalary: 150000,
        status: "Closed",
        applicants: 7
      }
    ];
    setJobs(mockJobs);
  };

  const loadMatches = async () => {
    const mockMatches = [
      {
        id: 1,
        jobId: 1,
        jobTitle: "Senior Solidity Developer",
        developerScore: "●●●●●",
        status: "Pending",
        matchDate: "2024-01-20"
      },
      {
        id: 2,
        jobId: 1,
        jobTitle: "Senior Solidity Developer", 
        developerScore: "●●●●●",
        status: "Confirmed",
        matchDate: "2024-01-19"
      }
    ];
    setMatches(mockMatches);
  };

  const handlePostJob = async () => {
    try {
      console.log("Posting job:", newJob);
      
      const jobWithId = {
        ...newJob,
        id: jobs.length + 1,
        status: "Open",
        applicants: 0
      };
      
      setJobs([...jobs, jobWithId]);
      setJobDialog(false);
      setNewJob({
        description: '',
        requiredScore: 70,
        offeredSalary: 80000
      });
    } catch (error) {
      console.error("Failed to post job:", error);
    }
  };

  const handleConfirmMatch = async (matchId) => {
    try {
      console.log("Confirming match:", matchId);
      setMatches(matches.map(match => 
        match.id === matchId 
          ? { ...match, status: "Confirmed" }
          : match
      ));
    } catch (error) {
      console.error("Failed to confirm match:", error);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Statistics
              </Typography>
              <Typography variant="h3" color="primary">
                {jobs.length}
              </Typography>
              <Typography variant="body2">
                Total Jobs Posted
              </Typography>
              <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
                {jobs.filter(job => job.status === 'Open').length}
              </Typography>
              <Typography variant="body2">
                Active Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Matching Statistics
              </Typography>
              <Typography variant="h3" color="primary">
                {matches.length}
              </Typography>
              <Typography variant="body2">
                Total Matches
              </Typography>
              <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>
                {matches.filter(match => match.status === 'Confirmed').length}
              </Typography>
              <Typography variant="body2">
                Confirmed Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Posted Jobs
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setJobDialog(true)}
                >
                  Post New Job
                </Button>
              </Box>
              
              {jobs.map((job) => (
                <Paper key={job.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1">
                        {job.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Chip 
                        label={job.status} 
                        color={job.status === 'Open' ? 'success' : 'default'}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Score: {job.requiredScore}+
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        ${job.offeredSalary.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2" color="text.secondary">
                        {job.applicants} applicants
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Candidate Matches
              </Typography>
              
              {matches.map((match) => (
                <Paper key={match.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">
                        {match.jobTitle}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Score: {match.developerScore}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Chip 
                        label={match.status} 
                        color={match.status === 'Confirmed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2" color="text.secondary">
                        {match.matchDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      {match.status === 'Pending' && (
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleConfirmMatch(match.id)}
                        >
                          Confirm
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={jobDialog} onClose={() => setJobDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post New Job</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Job Description"
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
              sx={{ mb: 3 }}
            />
            
            <Typography gutterBottom>Required Skill Score: {newJob.requiredScore}</Typography>
            <Slider
              value={newJob.requiredScore}
              onChange={(e, value) => setNewJob({...newJob, requiredScore: Array.isArray(value) ? value[0] : value})}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Offered Salary (USD)"
              type="number"
              value={newJob.offeredSalary}
              onChange={(e) => setNewJob({...newJob, offeredSalary: parseInt(e.target.value) || 0})}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="caption" color="text.secondary">
              Note: Requirements will be encrypted and used for private matching
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDialog(false)}>Cancel</Button>
          <Button onClick={handlePostJob} variant="contained">Post Job</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployerDashboard;