import React, { useState, useEffect } from 'react';
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
  ListItemText
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
  Preview as PreviewIcon
} from '@mui/icons-material';
import { quarantineManager } from '../utils/quarantineManager';
import { contentValidator } from '../utils/contentValidator';
import { conciergeAgent } from '../agents/conciergeAgent';
import { csvUpdater } from '../utils/csvUpdater';
import type { QuarantinedItem, ValidationIssue } from '../utils/contentValidator';
import type { CurationReport } from '../agents/conciergeAgent';
import type { UpdateSummary } from '../utils/csvUpdater';

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

  // Load quarantined items on component mount
  useEffect(() => {
    loadQuarantinedItems();
  }, []);

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
      // Optionally clear quarantine after successful download
      // quarantineManager.removeApprovedItems();
      // loadQuarantinedItems();
    } catch (error) {
      console.error('Failed to download updated CSVs:', error);
    } finally {
      setIsGeneratingUpdates(false);
    }
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Content Review Administration
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Review and manage quarantined content items for quality assurance
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Items
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Pending Review
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Approved
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Completion
              </Typography>
              <Typography variant="h4">
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

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button 
            variant="contained" 
            onClick={runValidation}
            disabled={validating}
            startIcon={<RefreshIcon />}
          >
            {validating ? 'Running Validation...' : 'Run New Validation'}
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            onClick={exportQuarantineData}
            startIcon={<ExportIcon />}
          >
            Export Data
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            onClick={() => generateCurationReport(selectedReportCategory)}
            disabled={loading}
            startIcon={<ReportIcon />}
          >
            {loading ? 'Generating...' : 'Concierge Report'}
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            onClick={handlePreviewUpdates}
            disabled={isGeneratingUpdates || stats.approved === 0}
            startIcon={<PreviewIcon />}
            color="info"
          >
            {isGeneratingUpdates ? 'Generating...' : 'Preview CSV Updates'}
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            onClick={handleDownloadUpdatedCSVs}
            disabled={isGeneratingUpdates || stats.approved === 0}
            startIcon={<DownloadIcon />}
            color="success"
          >
            {isGeneratingUpdates ? 'Generating...' : 'Download Updated CSVs'}
          </Button>
        </Grid>
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
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

      {validating && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <LinearProgress sx={{ mt: 1 }} />
          Running content validation across all CSV files...
        </Alert>
      )}

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
    </Box>
  );
};

export default ContentReviewAdmin; 