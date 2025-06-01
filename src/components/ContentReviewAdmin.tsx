import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Badge,
  Snackbar,
  Checkbox
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
  Assessment as ReportIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  SwapHoriz as SwapIcon,
  Description as InstructionsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { quarantineManager } from '../utils/quarantineManager';
import { contentValidator } from '../utils/contentValidator';
import { conciergeAgent } from '../agents/conciergeAgent';
import { csvUpdater } from '../utils/csvUpdater';
import { globalSearchEngine, SearchResult, SearchableContent, PAGE_MAPPINGS } from '../utils/globalSearch';
import { contentReassignmentManager } from '../utils/contentReassignmentManager';
import ContentReassignmentDialog from './ContentReassignmentDialog';
import {
  loadActivities,
  loadStandardizedDayTrips,
  loadStandardizedAmateurSports,
  loadStandardizedSportingEvents,
  loadStandardizedSpecialEvents,
  loadHappyHours
} from '../utils/dataLoader';
import type { QuarantinedItem, ValidationIssue } from '../utils/contentValidator';
import type { CurationReport } from '../agents/conciergeAgent';
import type { UpdateSummary } from '../utils/csvUpdater';
import { auth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ContentReviewAdmin: React.FC = () => {
  const [quarantinedItems, setQuarantinedItems] = useState<QuarantinedItem[]>([]);
  const [currentItem, setCurrentItem] = useState<QuarantinedItem | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [curationReport, setCurationReport] = useState<CurationReport | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReportCategory, setSelectedReportCategory] = useState('activities');
  const [updatePreview, setUpdatePreview] = useState<UpdateSummary | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [isGeneratingUpdates, setIsGeneratingUpdates] = useState(false);

  // New state for global search and reassignment
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInitialized, setSearchInitialized] = useState(false);
  const [reassignmentDialogOpen, setReassignmentDialogOpen] = useState(false);
  const [selectedContentForReassignment, setSelectedContentForReassignment] = useState<SearchableContent | null>(null);
  const [reassignmentLoading, setReassignmentLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    contentTypes: [] as string[],
    pageCategories: [] as string[]
  });

  // Add state for messages
  const [successMessage, setSuccessMessage] = useState<{
    title: string;
    message: string;
    insights: any[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add state for pattern confirmation
  const [pendingPatterns, setPendingPatterns] = useState<{
    patterns: any[];
    onConfirm: (approved: string[]) => void;
  } | null>(null);

  // Add state for pattern selection
  const [selectedCount, setSelectedCount] = useState(0);
  const selectedPatternsRef = useRef<string[]>([]);

  const navigate = useNavigate();

  // Initialize the ref
  useEffect(() => {
    selectedPatternsRef.current = [];
  }, []);

  // Load quarantined items and initialize search on component mount
  useEffect(() => {
    loadQuarantinedItems();
    initializeGlobalSearch();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (!searchInitialized) return;

    setIsSearching(true);
    const filters = {
      contentTypes: searchFilters.contentTypes.length > 0 ? searchFilters.contentTypes : undefined,
      pageCategories: searchFilters.pageCategories.length > 0 ? searchFilters.pageCategories : undefined,
      minRelevanceScore: 0.3 // Add minimum relevance threshold
    };

    globalSearchEngine.searchDebounced(searchQuery, filters, (results) => {
      setSearchResults(results);
      setIsSearching(false);
    });
  }, [searchQuery, searchFilters, searchInitialized]);

  // Add filter update handler
  const updateSearchFilters = (newFilters: typeof searchFilters) => {
    setSearchFilters(newFilters);
  };

  // Add filter controls to search section
  const renderFilterControls = () => (
    <Box sx={{ mb: 2 }}>
      <FormControl size="small" sx={{ mr: 2, minWidth: 200 }}>
        <InputLabel>Content Type</InputLabel>
        <Select
          multiple
          value={searchFilters.contentTypes}
          onChange={(e) => updateSearchFilters({
            ...searchFilters,
            contentTypes: e.target.value as string[]
          })}
          label="Content Type"
        >
          <MenuItem value="activity">Activities</MenuItem>
          <MenuItem value="day-trip">Day Trips</MenuItem>
          <MenuItem value="amateur-sport">Amateur Sports</MenuItem>
          <MenuItem value="sporting-event">Sporting Events</MenuItem>
          <MenuItem value="special-event">Special Events</MenuItem>
          <MenuItem value="happy-hour">Happy Hours</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Page Category</InputLabel>
        <Select
          multiple
          value={searchFilters.pageCategories}
          onChange={(e) => updateSearchFilters({
            ...searchFilters,
            pageCategories: e.target.value as string[]
          })}
          label="Page Category"
        >
          <MenuItem value="activities">Activities Page</MenuItem>
          <MenuItem value="day-trips">Day Trips Page</MenuItem>
          <MenuItem value="amateur-sports">Amateur Sports Page</MenuItem>
          <MenuItem value="sporting-events">Sporting Events Page</MenuItem>
          <MenuItem value="special-events">Special Events Page</MenuItem>
          <MenuItem value="happy-hours">Happy Hours Page</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const initializeGlobalSearch = async () => {
    try {
      setLoading(true);
      console.log('Initializing global search engine...');

      const [activities, dayTrips, amateurSports, sportingEvents, specialEvents, happyHours] = await Promise.all([
        loadActivities(),
        loadStandardizedDayTrips(),
        loadStandardizedAmateurSports(),
        loadStandardizedSportingEvents(),
        loadStandardizedSpecialEvents(),
        loadHappyHours()
      ]);

      globalSearchEngine.initialize(
        activities,
        dayTrips,
        amateurSports,
        sportingEvents,
        specialEvents,
        happyHours
      );

      setSearchInitialized(true);
      console.log('Global search engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize global search:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuarantinedItems = () => {
    const items = quarantineManager.loadQuarantinedItems();
    setQuarantinedItems(items);
  };

  const runValidation = async () => {
    setValidating(true);
    try {
      const newQuarantinedItems = await contentValidator.validateAllData();
      quarantineManager.saveQuarantinedItems(newQuarantinedItems);
      setQuarantinedItems(newQuarantinedItems);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setValidating(false);
    }
  };

  const handleReviewItem = (item: QuarantinedItem) => {
    setCurrentItem(item);
    setReviewNotes('');
    setSelectedCategory(item.suggestedCategory || '');
    setReviewDialogOpen(true);
  };

  const handleApproveItem = () => {
    if (!currentItem) return;
    
    quarantineManager.approveItem(
      currentItem.id,
      selectedCategory || undefined,
      reviewNotes || undefined
    );
    
    loadQuarantinedItems();
    setReviewDialogOpen(false);
    setCurrentItem(null);
  };

  const handleRejectItem = () => {
    if (!currentItem) return;
    
    quarantineManager.rejectItem(currentItem.id, reviewNotes || undefined);
    loadQuarantinedItems();
    setReviewDialogOpen(false);
    setCurrentItem(null);
  };

  const generateCurationReport = async (category: string) => {
    setLoading(true);
    try {
      const report = await conciergeAgent.curatePage(category as any);
      setCurationReport(report);
      setReportDialogOpen(true);
    } catch (error) {
      console.error('Failed to generate curation report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportQuarantineData = () => {
    const data = quarantineManager.exportQuarantineData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quarantine-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreviewUpdates = async () => {
    setIsGeneratingUpdates(true);
    try {
      const preview = await csvUpdater.getUpdatePreview();
      setUpdatePreview(preview.summary);
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error('Failed to generate update preview:', error);
    } finally {
      setIsGeneratingUpdates(false);
    }
  };

  const handleDownloadUpdatedCSVs = async () => {
    setIsGeneratingUpdates(true);
    try {
      await csvUpdater.downloadUpdatedCSVs();
      
      // Get potential new patterns
      const reassignmentPatterns = await conciergeAgent.learnFromReassignments();
      
      if (reassignmentPatterns.length > 0) {
        // Show confirmation dialog for patterns
        setPendingPatterns({
          patterns: reassignmentPatterns,
          onConfirm: async (approvedPatternIds) => {
            // Add approved patterns to concierge
            await conciergeAgent.addApprovedPatterns(
              reassignmentPatterns.filter(p => approvedPatternIds.includes(p.pattern))
            );
            
            // Clear reassignments after patterns are handled
            contentReassignmentManager.clearOperations();
            
            // Reset the tab to quarantined items
            setTabValue(0);
            
            // Show success message
            setSuccessMessage({
              title: 'CSV Updates Downloaded',
              message: 'All reassignments have been cleared. The concierge agent has learned from the approved patterns.',
              insights: reassignmentPatterns.filter(p => approvedPatternIds.includes(p.pattern))
            });
          }
        });
      } else {
        // If no patterns, just clear reassignments
        contentReassignmentManager.clearOperations();
        setTabValue(0);
        setSuccessMessage({
          title: 'CSV Updates Downloaded',
          message: 'All reassignments have been cleared.',
          insights: []
        });
      }
    } catch (error) {
      console.error('Failed to download updated CSVs:', error);
      setErrorMessage('Failed to process CSV updates. Please try again.');
    } finally {
      setIsGeneratingUpdates(false);
    }
  };

  const handleReassignContent = (content: SearchableContent) => {
    setSelectedContentForReassignment(content);
    setReassignmentDialogOpen(true);
  };

  const handleConfirmReassignment = async (newPageCategory: string) => {
    if (!selectedContentForReassignment) return;

    setReassignmentLoading(true);
    try {
      // Update content in global search engine
      const updatedContent = globalSearchEngine.moveContent(
        selectedContentForReassignment.id,
        selectedContentForReassignment.contentType,
        newPageCategory
      );

      if (updatedContent) {
        // Record the reassignment operation
        contentReassignmentManager.recordReassignment(
          selectedContentForReassignment,
          newPageCategory,
          updatedContent
        );

        // Update search results if needed
        if (searchQuery) {
          const newResults = globalSearchEngine.search(searchQuery, {
            contentTypes: searchFilters.contentTypes.length > 0 ? searchFilters.contentTypes : undefined,
            pageCategories: searchFilters.pageCategories.length > 0 ? searchFilters.pageCategories : undefined
          });
          setSearchResults(newResults);
        }

        console.log(`Content successfully moved to ${newPageCategory}`);
      }
    } catch (error) {
      console.error('Failed to reassign content:', error);
    } finally {
      setReassignmentLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleDownloadReassignmentInstructions = () => {
    contentReassignmentManager.downloadUpdateInstructions();
  };

  const getIssueIcon = (issue: ValidationIssue) => {
    switch (issue.severity) {
      case 'high': return <ErrorIcon color="error" fontSize="small" />;
      case 'medium': return <WarningIcon color="warning" fontSize="small" />;
      case 'low': return <WarningIcon color="info" fontSize="small" />;
      default: return <WarningIcon fontSize="small" />;
    }
  };

  const getIssueColor = (issue: ValidationIssue) => {
    switch (issue.severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const stats = quarantineManager.getReviewStats();
  const pendingItems = quarantinedItems.filter(item => item.reviewStatus === 'pending');
  const reassignmentStats = contentReassignmentManager.getStats();
  const searchStats = searchInitialized ? globalSearchEngine.getStats() : null;

  const handleLogout = () => {
    auth.logout();
    navigate('/admin/login');
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Content Review Administration
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Review quarantined content, search all content, and manage content reassignments
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dashboard Overview
        </Typography>
        {/* Enhanced Statistics Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1.5 }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle2" color="textSecondary" noWrap>
                  Total Items
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 0.5 }}>
                  {stats.total}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Quarantined
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1.5 }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle2" color="textSecondary" noWrap>
                  Pending Review
                </Typography>
                <Typography variant="h4" color="warning.main" sx={{ mt: 1, mb: 0.5 }}>
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1.5 }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle2" color="textSecondary" noWrap>
                  Approved
                </Typography>
                <Typography variant="h4" color="success.main" sx={{ mt: 1, mb: 0.5 }}>
                  {stats.approved}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1.5 }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle2" color="textSecondary" noWrap>
                  All Content
                </Typography>
                <Typography variant="h4" color="info.main" sx={{ mt: 1, mb: 0.5 }}>
                  {searchStats?.totalItems || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Searchable
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1.5 }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle2" color="textSecondary" noWrap>
                  Reassignments
                </Typography>
                <Typography variant="h4" color="secondary.main" sx={{ mt: 1, mb: 0.5 }}>
                  {reassignmentStats.totalOperations}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  This Session
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1.5 }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle2" color="textSecondary" noWrap>
                  Completion
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 0.5 }}>
                  {stats.completionPercentage.toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.completionPercentage} 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item>
              <Button 
                variant="contained" 
                size="small"
                onClick={runValidation}
                disabled={validating}
                startIcon={<RefreshIcon />}
              >
                {validating ? 'Validating...' : 'Validate'}
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                size="small"
                onClick={exportQuarantineData}
                startIcon={<ExportIcon />}
              >
                Export
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => generateCurationReport(selectedReportCategory)}
                disabled={loading}
                startIcon={<ReportIcon />}
              >
                {loading ? 'Generating...' : 'Report'}
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handlePreviewUpdates}
                disabled={isGeneratingUpdates || stats.approved === 0}
                startIcon={<PreviewIcon />}
                color="info"
              >
                {isGeneratingUpdates ? 'Loading...' : 'Preview'}
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                size="small"
                onClick={handleDownloadUpdatedCSVs}
                disabled={isGeneratingUpdates || stats.approved === 0}
                startIcon={<DownloadIcon />}
                color="success"
              >
                {isGeneratingUpdates ? 'Loading...' : 'Download CSVs'}
              </Button>
            </Grid>
            <Grid item>
              <Badge badgeContent={reassignmentStats.totalOperations} color="secondary">
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={handleDownloadReassignmentInstructions}
                  disabled={!contentReassignmentManager.hasPendingOperations()}
                  startIcon={<InstructionsIcon />}
                  color="secondary"
                >
                  Instructions
                </Button>
              </Badge>
            </Grid>
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedReportCategory}
                  label="Category"
                  onChange={(e) => setSelectedReportCategory(e.target.value)}
                >
                  <MenuItem value="activities">Activities</MenuItem>
                  <MenuItem value="day-trips">Day Trips</MenuItem>
                  <MenuItem value="amateur-sports">Amateur Sports</MenuItem>
                  <MenuItem value="sporting-events">Sporting Events</MenuItem>
                  <MenuItem value="special-events">Special Events</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {validating && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <LinearProgress sx={{ mt: 1 }} />
          Running content validation across all CSV files...
        </Alert>
      )}

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={pendingItems.length} color="warning">
                Quarantined Items
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={searchStats?.totalItems || 0} color="info">
                Global Search
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={reassignmentStats.totalOperations} color="secondary">
                Reassignments
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Quarantined Items List */}
        <Typography variant="h5" gutterBottom>
          Quarantined Items ({pendingItems.length} pending)
        </Typography>

        {pendingItems.length === 0 ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">
              🎉 No items in quarantine!
            </Typography>
            <Typography>
              All content has been reviewed or no validation issues were found.
            </Typography>
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {pendingItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                          {item.originalData.title || 'Untitled Item'}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center" mb={1}>
                          <Box sx={{ 
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            px: 2,
                            py: 0.5,
                            borderRadius: '16px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}>
                            <Typography variant="subtitle2">
                              Current Location: {item.itemType}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {item.originalData.description?.substring(0, 200)}...
                        </Typography>
                        
                        {/* Category and Score */}
                        <Box display="flex" gap={1} alignItems="center" mb={1}>
                          <Chip 
                            label={item.itemType} 
                            size="small" 
                            color="primary"
                          />
                          <Chip 
                            label={`Score: ${item.score}/100`} 
                            size="small" 
                            color={item.score >= 70 ? 'success' : item.score >= 50 ? 'warning' : 'error'}
                          />
                          <Chip 
                            label={item.reviewStatus} 
                            size="small" 
                            color="default"
                          />
                        </Box>

                        {/* Issues */}
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {item.issues.map((issue, index) => (
                            <Tooltip key={index} title={`${issue.message}${issue.suggestion ? ` Suggestion: ${issue.suggestion}` : ''}`}>
                              <Chip
                                icon={getIssueIcon(issue)}
                                label={issue.type.replace('_', ' ')}
                                size="small"
                                color={getIssueColor(issue) as any}
                                variant="outlined"
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleReviewItem(item)}
                          >
                            Review
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Global Search */}
        <Typography variant="h5" gutterBottom>
          Global Content Search
        </Typography>

        {!searchInitialized ? (
          <Alert severity="info">
            <LinearProgress sx={{ mt: 1 }} />
            Initializing search engine...
          </Alert>
        ) : (
          <Box>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search across all content (title, description, location, tags...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            {/* Add Filter Controls */}
            {renderFilterControls()}

            {/* Search Results */}
            {isSearching && (
              <Box display="flex" justifyContent="center" p={2}>
                <LinearProgress sx={{ width: '100%' }} />
              </Box>
            )}

            {searchResults.length > 0 && (
              <Typography variant="h6" gutterBottom>
                Search Results ({searchResults.length})
              </Typography>
            )}

            <Grid container spacing={2}>
              {searchResults.map((result, index) => {
                const item = result.item;
                const currentPageMapping = PAGE_MAPPINGS.find(p => p.pageCategory === item.pageCategory);
                
                return (
                  <Grid item xs={12} key={`${item.id}_${item.contentType}_${index}`}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom>
                              {item.title || (item as any).name || 'Untitled'}
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" mb={1}>
                              <Box sx={{ 
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                px: 2,
                                py: 0.5,
                                borderRadius: '16px',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}>
                                <Typography variant="subtitle2">
                                  Current Location: {currentPageMapping?.displayName || item.pageCategory}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              {item.description?.substring(0, 200)}
                              {item.description && item.description.length > 200 ? '...' : ''}
                            </Typography>
                            
                            <Box display="flex" gap={1} alignItems="center" mb={1}>
                              <Chip 
                                label={item.contentType} 
                                size="small" 
                                color="default"
                              />
                              <Chip 
                                label={`Relevance: ${(result.relevanceScore * 100).toFixed(0)}%`} 
                                size="small" 
                                color="info"
                              />
                            </Box>

                            {result.matchedFields.length > 0 && (
                              <Typography variant="caption" color="textSecondary">
                                Matched: {result.matchedFields.join(', ')}
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box display="flex" gap={1} justifyContent="flex-end">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<SwapIcon />}
                                onClick={() => handleReassignContent(item)}
                              >
                                Reassign
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {searchQuery && searchResults.length === 0 && !isSearching && (
              <Alert severity="info">
                No content found matching your search query.
              </Alert>
            )}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Reassignment Summary */}
        <Typography variant="h5" gutterBottom>
          Content Reassignments
        </Typography>

        {reassignmentStats.totalOperations === 0 ? (
          <Alert severity="info">
            No content reassignments have been made in this session.
          </Alert>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Session Summary ({reassignmentStats.totalOperations} operations)
            </Typography>
            
            {Object.entries(reassignmentStats.byCategoryMove).map(([move, count]) => (
              <Chip
                key={move}
                label={`${move}: ${count}`}
                sx={{ mr: 1, mb: 1 }}
                color="secondary"
              />
            ))}

            <Box mt={3}>
              <Button
                variant="contained"
                startIcon={<InstructionsIcon />}
                onClick={handleDownloadReassignmentInstructions}
                color="secondary"
              >
                Download CSV Update Instructions
              </Button>
            </Box>

            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              The downloaded file will contain detailed instructions for updating your CSV files 
              to make these reassignments permanent.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Review Item: {currentItem?.originalData.title}
        </DialogTitle>
        <DialogContent>
          {currentItem && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Quarantine Reason
              </Typography>
              <Typography variant="body2" color="error" paragraph>
                {currentItem.quarantineReason}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Validation Issues
              </Typography>
              <List dense>
                {currentItem.issues.map((issue, index) => (
                  <ListItem key={index}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getIssueIcon(issue)}
                      <ListItemText
                        primary={issue.message}
                        secondary={issue.suggestion}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Item Details
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Category:</strong> {currentItem.itemType}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Score:</strong> {currentItem.score}/100
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Description:</strong> {currentItem.originalData.description}
              </Typography>

              <TextField
                fullWidth
                label="Review Notes"
                multiline
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Target Category (if approving for different section)</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Target Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">Keep in original category</MenuItem>
                  <MenuItem value="activities">Activities</MenuItem>
                  <MenuItem value="happy-hours">Happy Hours</MenuItem>
                  <MenuItem value="day-trips">Day Trips</MenuItem>
                  <MenuItem value="amateur-sports">Amateur Sports</MenuItem>
                  <MenuItem value="sporting-events">Sporting Events</MenuItem>
                  <MenuItem value="special-events">Special Events</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRejectItem}
            color="error"
            variant="outlined"
            startIcon={<RejectIcon />}
          >
            Reject
          </Button>
          <Button 
            onClick={handleApproveItem}
            color="success"
            variant="contained"
            startIcon={<ApproveIcon />}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content Reassignment Dialog */}
      <ContentReassignmentDialog
        open={reassignmentDialogOpen}
        onClose={() => setReassignmentDialogOpen(false)}
        content={selectedContentForReassignment}
        onConfirm={handleConfirmReassignment}
        loading={reassignmentLoading}
      />

      {/* Curation Report Dialog */}
      <Dialog 
        open={reportDialogOpen} 
        onClose={() => setReportDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          🤵 Concierge Report: {curationReport?.pageCategory}
        </DialogTitle>
        <DialogContent>
          {curationReport && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4">{curationReport.summary.totalItems}</Typography>
                    <Typography variant="caption">Total Items</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">{curationReport.summary.validItems}</Typography>
                    <Typography variant="caption">Valid Items</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">{curationReport.summary.issuesFound}</Typography>
                    <Typography variant="caption">Issues Found</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4">{curationReport.qualityMetrics.averageScore.toFixed(1)}</Typography>
                    <Typography variant="caption">Avg Score</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Insights & Recommendations
              </Typography>
              {curationReport.insights.map((insight, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {insight.severity === 'high' && <ErrorIcon color="error" />}
                      {insight.severity === 'medium' && <WarningIcon color="warning" />}
                      {insight.severity === 'low' && <WarningIcon color="info" />}
                      <Typography variant="subtitle1">
                        {insight.title}
                      </Typography>
                      <Chip label={insight.type} size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>{insight.description}</Typography>
                    <Typography variant="subtitle2" gutterBottom>Recommendation:</Typography>
                    <Typography color="primary">{insight.recommendation}</Typography>
                    {insight.affectedItems.length > 0 && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                          Affected Items ({insight.affectedItems.length}):
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {insight.affectedItems.slice(0, 5).join(', ')}
                          {insight.affectedItems.length > 5 && '...'}
                        </Typography>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSV Update Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          📄 CSV Update Preview
        </DialogTitle>
        <DialogContent>
          {updatePreview && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Update Summary
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4">{updatePreview.totalProcessed}</Typography>
                    <Typography variant="caption">Total Items</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">{updatePreview.totalRemoved}</Typography>
                    <Typography variant="caption">Items to Remove</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">{updatePreview.totalMoved}</Typography>
                    <Typography variant="caption">Items to Move</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {Object.keys(updatePreview.categoryMoves).length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Category Moves
                  </Typography>
                  <List dense>
                    {Object.entries(updatePreview.categoryMoves).map(([move, count]) => (
                      <ListItem key={move}>
                        <ListItemText
                          primary={move}
                          secondary={`${count} item${count > 1 ? 's' : ''}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Files to be Updated
              </Typography>
              <List dense>
                {updatePreview.updatedFiles.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={file.filename}
                      secondary={`${file.originalCount} → ${file.updatedCount} items (${file.removedCount} removed, ${file.movedCount} moved)`}
                    />
                  </ListItem>
                ))}
              </List>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> This will download updated CSV files to your computer. 
                  You'll need to manually replace the files in your project's public/data/ directory.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setPreviewDialogOpen(false);
              handleDownloadUpdatedCSVs();
            }}
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
          >
            Download Updates
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message Dialog */}
      <Dialog 
        open={!!successMessage} 
        onClose={() => setSuccessMessage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          ✅ {successMessage?.title}
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            {successMessage?.message}
          </Typography>
          {successMessage?.insights && successMessage.insights.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Learned Patterns
              </Typography>
              <List>
                {successMessage.insights.map((insight, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={insight.pattern}
                      secondary={insight.recommendation}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessMessage(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Message Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        message={errorMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setErrorMessage(null)}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        }
      />

      {/* Pattern Confirmation Dialog */}
      <Dialog
        open={!!pendingPatterns}
        onClose={() => setPendingPatterns(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          🤔 Review New Content Patterns
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            The concierge agent has identified the following patterns from your recent content reassignments. 
            Please review and approve the patterns you'd like the agent to learn from:
          </Typography>
          
          <List>
            {pendingPatterns?.patterns.map((pattern, index) => (
              <ListItem key={index}>
                <ListItemButton onClick={() => {
                  const selectedPatterns = selectedPatternsRef.current;
                  if (selectedPatterns.includes(pattern.pattern)) {
                    selectedPatternsRef.current = selectedPatterns.filter(p => p !== pattern.pattern);
                  } else {
                    selectedPatternsRef.current = [...selectedPatterns, pattern.pattern];
                  }
                  setSelectedCount(prev => selectedPatterns.includes(pattern.pattern) ? prev - 1 : prev + 1);
                }}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedPatternsRef.current.includes(pattern.pattern)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">{pattern.pattern}</Typography>
                        <Chip 
                          size="small" 
                          label={`${(pattern.confidence * 100).toFixed(0)}% confidence`}
                          color={pattern.confidence > 0.7 ? 'success' : 'warning'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {pattern.recommendation}
                        </Typography>
                        {pattern.examples.length > 0 && (
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            Examples: {pattern.examples.slice(0, 3).join(', ')}
                            {pattern.examples.length > 3 && ` and ${pattern.examples.length - 3} more`}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingPatterns(null)}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              if (pendingPatterns?.onConfirm) {
                pendingPatterns.onConfirm(selectedPatternsRef.current);
                setPendingPatterns(null);
              }
            }}
            disabled={selectedCount === 0}
          >
            Approve Selected Patterns
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentReviewAdmin; 