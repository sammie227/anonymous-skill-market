import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Tab, Tabs, Box } from '@mui/material';
import { ethers } from 'ethers';

import DeveloperDashboard from './components/DeveloperDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import CodeSubmission from './components/CodeSubmission';
import JobMatching from './components/JobMatching';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bcd4',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to connect to wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Anonymous Skill Market
          </Typography>
          <Typography variant="body2">
            {account ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}` : 'Not Connected'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Developer Dashboard" />
          <Tab label="Employer Dashboard" />
          <Tab label="Submit Code" />
          <Tab label="Find Jobs" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <DeveloperDashboard account={account} signer={signer} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <EmployerDashboard account={account} signer={signer} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <CodeSubmission account={account} signer={signer} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <JobMatching account={account} signer={signer} />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;