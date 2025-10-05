import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Box,
  TextareaAutosize, Alert, CircularProgress,
  Chip, Grid, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComponentProps } from '../types';

const CodeTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minHeight: '300px',
  padding: '16px',
  fontFamily: 'monospace',
  fontSize: '14px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  },
}));

const CodeSubmission: React.FC<ComponentProps> = ({ account, signer }) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const sampleCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private storedData;
    
    event DataStored(uint256 indexed value, address indexed sender);
    
    modifier onlyPositive(uint256 _value) {
        require(_value > 0, "Value must be positive");
        _;
    }
    
    function set(uint256 _value) public onlyPositive(_value) {
        storedData = _value;
        emit DataStored(_value, msg.sender);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
    
    function increment() public {
        storedData += 1;
        emit DataStored(storedData, msg.sender);
    }
}`;

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to submit');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate code analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation:
      // 1. Hash the code
      // 2. Submit to SkillEvaluator contract
      // 3. Trigger AI analysis service
      
      console.log('Code submitted for analysis');
      setSubmitSuccess(true);
      setCode('');
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setError('Failed to submit code: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadSample = () => {
    setCode(sampleCode);
  };

  const analysisCriteria = [
    { name: 'Code Complexity', weight: '30%', description: 'Cyclomatic complexity, nesting depth' },
    { name: 'Security', weight: '40%', description: 'Vulnerability detection, best practices' },
    { name: 'Code Quality', weight: '30%', description: 'Readability, documentation, structure' }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Submit Code for Evaluation
                </Typography>
                <Button variant="outlined" onClick={loadSample} size="small">
                  Load Sample
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Submit your Solidity smart contract for anonymous skill evaluation. 
                Your code will be analyzed using AI and given a score based on complexity, 
                security, and quality metrics.
              </Typography>
              
              <CodeTextarea
                placeholder="// Enter your Solidity code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              {submitSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Code submitted successfully! Analysis will be completed shortly.
                </Alert>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !code.trim()}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Analyzing...' : 'Submit Code'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => setCode('')}
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
              </Box>
              
              <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
                * Your code will be hashed and stored securely. Original code is not stored on-chain.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evaluation Criteria
              </Typography>
              
              {analysisCriteria.map((criteria, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: 'background.default' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">
                      {criteria.name}
                    </Typography>
                    <Chip label={criteria.weight} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {criteria.description}
                  </Typography>
                </Paper>
              ))}
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Your final score will be encrypted and can only be decrypted by you and 
                used for anonymous job matching.
              </Alert>
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submission Tips
              </Typography>
              
              <Typography variant="body2" paragraph>
                • Submit complete, compilable Solidity contracts
              </Typography>
              <Typography variant="body2" paragraph>
                • Include proper error handling and security checks
              </Typography>
              <Typography variant="body2" paragraph>
                • Add meaningful comments and documentation
              </Typography>
              <Typography variant="body2" paragraph>
                • Follow Solidity best practices and conventions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CodeSubmission;