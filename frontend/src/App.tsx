import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, AppBar, Toolbar, Typography, Container, Tab, Tabs, Box, 
  Button, Chip, IconButton, Avatar, Menu, MenuItem, Alert
} from '@mui/material';
import { AccountCircle, Logout, Wallet, Code, Work, Search, Dashboard } from '@mui/icons-material';
import { ethers } from 'ethers';

import DeveloperDashboard from './components/DeveloperDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import CodeSubmission from './components/CodeSubmission';
import JobMatching from './components/JobMatching';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    secondary: {
      main: '#ff6d00',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
        },
      },
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this application!");
      return;
    }

    setConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setSigner(null);
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isConnected = !!account;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Code sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Anonymous Skill Market
            </Typography>
            <Chip 
              label="FHEVM" 
              size="small" 
              sx={{ ml: 2, bgcolor: 'primary.main', color: 'black', fontWeight: 600 }}
            />
          </Box>
          
          {isConnected ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                icon={<AccountCircle />}
                label={`${account.substring(0, 6)}...${account.substring(38)}`}
                color="primary"
                variant="outlined"
              />
              <IconButton onClick={handleMenuOpen} sx={{ color: 'primary.main' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={disconnectWallet}>
                  <Logout sx={{ mr: 2 }} /> Disconnect
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<Wallet />}
              onClick={connectWallet}
              disabled={connecting}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {!isConnected && (
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
            Privacy-First Skill Certification
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Prove your coding skills anonymously using Fully Homomorphic Encryption
          </Typography>
          <Alert severity="info" sx={{ mb: 4 }}>
            Connect your wallet to start using the anonymous skill certification marketplace
          </Alert>
          <Button
            variant="contained"
            size="large"
            startIcon={<Wallet />}
            onClick={connectWallet}
            disabled={connecting}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            {connecting ? 'Connecting...' : 'Connect Wallet to Get Started'}
          </Button>
        </Container>
      )}

      {isConnected && (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{ 
              mb: 3,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5,
              }
            }}
          >
            <Tab 
              icon={<Dashboard />} 
              label="Developer" 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<Work />} 
              label="Employer" 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<Code />} 
              label="Submit Code" 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<Search />} 
              label="Find Jobs" 
              sx={{ minHeight: 72 }}
            />
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
      )}
    </ThemeProvider>
  );
}

export default App;