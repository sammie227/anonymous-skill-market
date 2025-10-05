import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Box,
  Chip, Grid, Paper, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip
} from '@mui/material';
import { WorkOutline, TrendingUp, Security, Code, Verified, Business, Group, Lightbulb } from '@mui/icons-material';
import { ComponentProps, JobMatch, Application } from '../types';

const JobMatching: React.FC<ComponentProps> = ({ account, signer }) => {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applyDialog, setApplyDialog] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);

  useEffect(() => {
    if (account && signer) {
      findMatches();
      loadApplications();
    }
  }, [account, signer]);

  const findMatches = async () => {
    setIsLoading(true);
    try {
      // Simulate finding matches based on encrypted criteria
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockMatches = [
        {
          id: 1,
          title: "Senior DeFi Protocol Developer",
          company: "Stealth DeFi Startup",
          industry: "DeFi Protocol",
          companySize: "50-100 employees",
          fundingStage: "Series A",
          techStack: ["Solidity", "Ethereum", "Hardhat"],
          culture: ["Remote-first", "Fast-paced", "Equity-heavy"],
          matchScore: 95,
          salaryRange: "$120,000 - $150,000",
          requirements: "Advanced Solidity, DeFi Experience",
          posted: "2 days ago",
          type: "Full-time",
          location: "Remote",
          verified: true
        },
        {
          id: 2,
          title: "Smart Contract Security Auditor", 
          company: "Top-tier Security Firm",
          industry: "Security & Auditing",
          companySize: "10-50 employees",
          fundingStage: "Profitable",
          techStack: ["Solidity", "Foundry", "Static Analysis"],
          culture: ["Quality-focused", "Learning-oriented", "Flexible hours"],
          matchScore: 88,
          salaryRange: "$100,000 - $130,000",
          requirements: "Security Knowledge, Testing",
          posted: "1 week ago",
          type: "Contract",
          location: "Hybrid",
          verified: true
        },
        {
          id: 3,
          title: "Blockchain Full-Stack Developer",
          company: "Web3 Gaming Studio",
          industry: "Gaming & NFTs",
          companySize: "20-50 employees", 
          fundingStage: "Seed",
          techStack: ["Solidity", "React", "Unity"],
          culture: ["Creative", "Gaming-focused", "Collaborative"],
          matchScore: 82,
          salaryRange: "$90,000 - $120,000",
          requirements: "Solidity, React, Web3.js",
          posted: "3 days ago",
          type: "Full-time",
          location: "Remote",
          verified: false
        }
      ];
      
      setMatches(mockMatches);
    } catch (error) {
      console.error("Failed to find matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplications = async () => {
    const mockApplications: Application[] = [
      {
        id: 1,
        jobTitle: "Senior DeFi Protocol Developer",
        status: "Applied" as const,
        appliedDate: "2024-01-20",
        matchScore: 95
      },
      {
        id: 2,
        jobTitle: "Smart Contract Security Auditor",
        status: "Under Review" as const, 
        appliedDate: "2024-01-18",
        matchScore: 88
      }
    ];
    setApplications(mockApplications);
  };

  const handleApply = async (job: JobMatch) => {
    setSelectedJob(job);
    setApplyDialog(true);
  };

  const confirmApplication = async () => {
    if (!selectedJob) return;
    
    try {
      console.log("Applying to job:", selectedJob.id);
      
      // Add to applications
      const newApplication: Application = {
        id: applications.length + 1,
        jobTitle: selectedJob.title,
        status: "Applied" as const,
        appliedDate: new Date().toISOString().split('T')[0],
        matchScore: selectedJob.matchScore
      };
      
      setApplications([...applications, newApplication]);
      setApplyDialog(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Failed to apply:", error);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'default';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'primary';
      case 'Under Review': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Job Matches Based on Your Encrypted Profile
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={findMatches}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <TrendingUp />}
                >
                  {isLoading ? 'Finding Matches...' : 'Refresh Matches'}
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Matches are found using encrypted comparison of your skill score and salary expectations. 
                Employers cannot see your actual data.
              </Alert>
              
              {matches.map((job) => (
                <Paper key={job.id} sx={{ p: 3, mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WorkOutline color="primary" />
                        <Typography variant="h6">
                          {job.title}
                        </Typography>
                        <Chip 
                          label={`${job.matchScore}% Match`}
                          color={getMatchColor(job.matchScore)}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {job.company}
                        </Typography>
                        {job.verified && (
                          <Tooltip title="Verified Employer">
                            <Verified sx={{ fontSize: 16, color: 'primary.main' }} />
                          </Tooltip>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                          icon={<Business />} 
                          label={job.industry} 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                        />
                        <Chip 
                          icon={<Group />} 
                          label={job.companySize} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={job.fundingStage} 
                          size="small" 
                          variant="outlined"
                          color="secondary"
                        />
                      </Box>
                      
                      <Typography variant="body2" paragraph>
                        <strong>Requirements:</strong> {job.requirements}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        <strong>Tech Stack:</strong> {job.techStack.join(', ')}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        <strong>Culture:</strong> {job.culture.join(' • ')}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={job.type} size="small" variant="outlined" />
                        <Chip label={job.location} size="small" variant="outlined" />
                        <Chip label={job.posted} size="small" variant="outlined" />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Typography variant="h6" color="primary">
                          {job.salaryRange}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Encrypted Salary Range
                        </Typography>
                        
                        <Button
                          variant="contained"
                          onClick={() => handleApply(job)}
                          sx={{ mt: 1 }}
                          disabled={applications.some(app => app.jobTitle === job.title)}
                        >
                          {applications.some(app => app.jobTitle === job.title) ? 'Already Applied' : 'Apply'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              {matches.length === 0 && !isLoading && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No job matches found. Try updating your skill profile or check back later for new opportunities.
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Applications
              </Typography>
              
              {applications.map((application) => (
                <Paper key={application.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">
                        {application.jobTitle}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Chip 
                        label={application.status}
                        color={getStatusColor(application.status)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        {application.matchScore}% Match
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2" color="text.secondary">
                        {application.appliedDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button size="small" variant="outlined" disabled>
                        View Status
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              {applications.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
                  No applications yet. Apply to some matched jobs above!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={applyDialog} onClose={() => setApplyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Job Application</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedJob.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedJob.company}
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Your encrypted skill score will be shared with the employer for matching. 
                Your identity remains anonymous until both parties agree to proceed.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Industry:</strong> {selectedJob.industry}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Company Size:</strong> {selectedJob.companySize}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Stage:</strong> {selectedJob.fundingStage}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Match Score:</strong> {selectedJob.matchScore}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Salary:</strong> {selectedJob.salaryRange}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {selectedJob.location}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tech Stack:</strong> {selectedJob.techStack.join(', ')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Culture:</strong> {selectedJob.culture.join(' • ')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Requirements:</strong> {selectedJob.requirements}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialog(false)}>Cancel</Button>
          <Button onClick={confirmApplication} variant="contained">
            Confirm Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobMatching;