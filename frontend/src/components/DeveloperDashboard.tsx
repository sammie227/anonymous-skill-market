import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, TextField, Box,
  Chip, Grid, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Slider, Alert, List, ListItem, ListItemText,
  ListItemIcon, Avatar, Divider
} from '@mui/material';
import { 
  Upload, Work, Visibility, Message, CheckCircle, 
  Schedule, Business, AttachMoney 
} from '@mui/icons-material';
import { ethers } from 'ethers';
import { ComponentProps } from '../types';

const SKILL_MARKET_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with deployed address

interface Invitation {
  id: number;
  companyName: string;
  jobTitle: string;
  industry: string;
  salaryRange: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined' | 'interviewing';
  matchScore: number;
}

interface Profile {
  skillScore: number;
  expectedSalary: number;
  skills: string[];
  experience: string;
  isPublic: boolean;
}

const DeveloperDashboard: React.FC<ComponentProps> = ({ account, signer }) => {
  const [profile, setProfile] = useState<Profile>({
    skillScore: 0,
    expectedSalary: 80000,
    skills: [],
    experience: '',
    isPublic: false
  });
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [profileDialog, setProfileDialog] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>('');

  useEffect(() => {
    if (account && signer) {
      loadDeveloperData();
    }
  }, [account, signer]);

  const loadDeveloperData = async () => {
    try {
      // Simulate loading developer profile and statistics
      setProfile({
        skillScore: 88,
        expectedSalary: 120000,
        skills: ['Solidity', 'TypeScript', 'React', 'DeFi'],
        experience: '3+ years blockchain development',
        isPublic: true
      });

      // Load mock invitations
      const mockInvitations: Invitation[] = [
        {
          id: 1,
          companyName: "Stealth DeFi Protocol",
          jobTitle: "Senior Smart Contract Developer",
          industry: "DeFi",
          salaryRange: "$120,000 - $150,000",
          message: "We're impressed with your Solidity skills! Your encrypted score matches our requirements perfectly.",
          timestamp: "2024-01-20",
          status: "pending",
          matchScore: 95
        },
        {
          id: 2,
          companyName: "Top-tier Security Firm",
          jobTitle: "Smart Contract Auditor",
          industry: "Security",
          salaryRange: "$100,000 - $130,000",
          message: "Your security-focused development style caught our attention. Interested in joining our audit team?",
          timestamp: "2024-01-18",
          status: "interviewing",
          matchScore: 89
        }
      ];
      setInvitations(mockInvitations);
    } catch (error) {
      console.error("Failed to load developer data:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // In real implementation, encrypt the values using FHEVM
      const encryptedScore = ethers.randomBytes(32);
      const encryptedSalary = ethers.randomBytes(32);
      
      console.log("Updating profile:", profile);
      setProfileDialog(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleInvitationResponse = async (invitationId: number, response: 'accepted' | 'declined') => {
    try {
      setInvitations(invitations.map(inv => 
        inv.id === invitationId ? { ...inv, status: response } : inv
      ));
      console.log(`Invitation ${invitationId} ${response}`);
    } catch (error) {
      console.error("Failed to respond to invitation:", error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'declined': return 'error';
      case 'interviewing': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Response';
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      case 'interviewing': return 'In Interview';
      default: return status;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                Your Profile
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="primary">
                  {profile.skillScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Encrypted Skill Score
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Expected Salary:</strong> ${profile.expectedSalary.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Experience:</strong> {profile.experience}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Status:</strong> {profile.isPublic ? 'Public' : 'Private'}
              </Typography>
              
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => setProfileDialog(true)}
                startIcon={<Upload />}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="secondary">
                    {invitations.length}
                  </Typography>
                  <Typography variant="body2">
                    Job Invitations
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {invitations.filter(inv => inv.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2">
                    Pending Responses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main">
                    {invitations.filter(inv => inv.status === 'interviewing').length}
                  </Typography>
                  <Typography variant="body2">
                    Active Interviews
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Job Invitations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Work />
                Job Invitations
              </Typography>
              
              {invitations.length === 0 && (
                <Alert severity="info">
                  No job invitations yet. Keep improving your skills and employers will find you!
                </Alert>
              )}
              
              {invitations.map((invitation) => (
                <Paper key={invitation.id} sx={{ p: 3, mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Business color="primary" />
                        <Typography variant="h6">
                          {invitation.jobTitle}
                        </Typography>
                        <Chip 
                          label={`${invitation.matchScore}% Match`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {invitation.companyName} • {invitation.industry}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {invitation.message}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={invitation.salaryRange} size="small" variant="outlined" icon={<AttachMoney />} />
                        <Chip label={invitation.timestamp} size="small" variant="outlined" icon={<Schedule />} />
                        <Chip 
                          label={getStatusText(invitation.status)} 
                          color={getStatusColor(invitation.status)}
                          size="small" 
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        {invitation.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'row', md: 'column' } }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                              sx={{ flex: 1 }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                              sx={{ flex: 1 }}
                            >
                              Decline
                            </Button>
                          </Box>
                        )}
                        
                        {invitation.status === 'accepted' && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<Message />}
                            disabled
                          >
                            Contact Employer
                          </Button>
                        )}
                        
                        {invitation.status === 'interviewing' && (
                          <Button
                            variant="contained"
                            color="info"
                            startIcon={<Visibility />}
                            disabled
                          >
                            Interview Details
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Update Dialog */}
      <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Update Your Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Your skill score and salary expectations will be encrypted using FHEVM for privacy.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Expected Salary: ${profile.expectedSalary.toLocaleString()}</Typography>
                <Slider
                  value={profile.expectedSalary}
                  onChange={(e, value) => setProfile({...profile, expectedSalary: Array.isArray(value) ? value[0] : value})}
                  min={50000}
                  max={300000}
                  step={5000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  sx={{ mb: 3 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Skill Score: {profile.skillScore}/100</Typography>
                <Slider
                  value={profile.skillScore}
                  onChange={(e, value) => setProfile({...profile, skillScore: Array.isArray(value) ? value[0] : value})}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Experience Description"
                  multiline
                  rows={3}
                  value={profile.experience}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  sx={{ mb: 3 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Skills:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {profile.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    sx={{ flex: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained">Update Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeveloperDashboard;