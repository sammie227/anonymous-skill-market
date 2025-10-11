import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, AppBar, Toolbar, Typography, Container, Tab, Tabs, Box, 
  Button, Chip, IconButton, Avatar, Menu, MenuItem, Alert, Card
} from '@mui/material';
import { AccountCircle, Logout, Wallet, Code, Work, Search, Dashboard, SwapHoriz } from '@mui/icons-material';
import { ethers } from 'ethers';

import DeveloperDashboard from './components/DeveloperDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import CodeSubmission from './components/CodeSubmission';
import JobMatching from './components/JobMatching';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f57c00',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#1a202c',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(25, 118, 210, 0.2)',
          color: '#1a202c',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: '#64748b',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
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

type UserRole = 'developer' | 'employer' | null;

function App() {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
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
      
      // Load saved role for this wallet address
      const savedRole = localStorage.getItem(`userRole_${accounts[0]}`);
      if (savedRole && (savedRole === 'developer' || savedRole === 'employer')) {
        setUserRole(savedRole as UserRole);
        if (savedRole === 'developer') {
          setTabValue(0);
        } else if (savedRole === 'employer') {
          setTabValue(1);
        }
      }
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
    setUserRole(null);
    setTabValue(0);
    setAnchorEl(null);
  };

  // Listen for account changes
  React.useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        console.log('Account changed detected:', accounts);
        if (accounts.length === 0) {
          // User disconnected their wallet
          console.log('Wallet disconnected');
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // User switched accounts
          const newAccount = accounts[0];
          console.log('Switching from', account, 'to', newAccount);
          setAccount(newAccount);
          
          // Load saved role for the new account
          const savedRole = localStorage.getItem(`userRole_${newAccount}`);
          console.log('Loaded role for new account:', savedRole);
          if (savedRole && (savedRole === 'developer' || savedRole === 'employer')) {
            setUserRole(savedRole as UserRole);
          } else {
            setUserRole(null);
            setTabValue(0);
          }
          
          // Update provider and signer
          if (provider) {
            const newSigner = await provider.getSigner();
            setSigner(newSigner);
          }
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum && window.ethereum.off) {
          window.ethereum.off('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [account, provider]);

  const selectRole = (role: UserRole) => {
    setUserRole(role);
    
    // Save role to localStorage for this wallet address
    if (account && role) {
      localStorage.setItem(`userRole_${account}`, role);
    }
    
    if (role === 'developer') {
      setTabValue(0); // Developer Dashboard
    } else if (role === 'employer') {
      setTabValue(1); // Employer Dashboard
    }
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
              {userRole && (
                <Chip 
                  icon={userRole === 'developer' ? <Code /> : <Work />}
                  label={userRole === 'developer' ? 'Developer' : 'Employer'}
                  color="secondary"
                  size="small"
                />
              )}
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
                <MenuItem onClick={() => {
                  const newRole = userRole === 'developer' ? 'employer' : 'developer';
                  selectRole(newRole);
                  handleMenuClose();
                }}>
                  <SwapHoriz sx={{ mr: 2 }} /> 
                  Switch to {userRole === 'developer' ? 'Employer' : 'Developer'}
                </MenuItem>
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

      {isConnected && !userRole && (
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
            Welcome to Anonymous Skill Market
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 2 }}>
            Choose your role to get started. You can switch between roles anytime in the menu.
          </Typography>
          <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
            Your role preference will be saved for this wallet address. You can easily switch roles later using the menu in the top-right corner.
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Card 
              sx={{ 
                p: 4, 
                minWidth: 280, 
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                }
              }}
              onClick={() => selectRole('developer')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Code sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  I'm a Developer
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Submit code, get evaluated, and find job opportunities
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                >
                  Start Coding
                </Button>
              </Box>
            </Card>

            <Card 
              sx={{ 
                p: 4, 
                minWidth: 280, 
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'secondary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(245, 124, 0, 0.15)',
                }
              }}
              onClick={() => selectRole('employer')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Work sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  I'm an Employer
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Post jobs and find qualified developers privately
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                >
                  Hire Talent
                </Button>
              </Box>
            </Card>
          </Box>
        </Container>
      )}

      {isConnected && userRole && (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
          {userRole === 'developer' && (
            <>
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
                  label="Dashboard" 
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
                <CodeSubmission account={account} signer={signer} />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <JobMatching account={account} signer={signer} />
              </TabPanel>
            </>
          )}

          {userRole === 'employer' && (
            <>
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
                  icon={<Work />} 
                  label="Dashboard" 
                  sx={{ minHeight: 72 }}
                />
                <Tab 
                  icon={<Search />} 
                  label="Find Developers" 
                  sx={{ minHeight: 72 }}
                />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <EmployerDashboard account={account} signer={signer} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <JobMatching account={account} signer={signer} />
              </TabPanel>
            </>
          )}
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;