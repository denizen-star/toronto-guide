import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { SearchableContent, PAGE_MAPPINGS } from '../utils/globalSearch';

interface ContentReassignmentDialogProps {
  open: boolean;
  onClose: () => void;
  content: SearchableContent | null;
  onConfirm: (newPageCategory: string) => void;
  loading?: boolean;
}

const ContentReassignmentDialog: React.FC<ContentReassignmentDialogProps> = ({
  open,
  onClose,
  content,
  onConfirm,
  loading = false
}) => {
  const [selectedPageCategory, setSelectedPageCategory] = useState('');
  const [confirmationStep, setConfirmationStep] = useState(false);

  const handleClose = () => {
    setSelectedPageCategory('');
    setConfirmationStep(false);
    onClose();
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedPageCategory(newCategory);
    setConfirmationStep(false);
  };

  const handleProceedToConfirmation = () => {
    if (selectedPageCategory && selectedPageCategory !== content?.pageCategory) {
      setConfirmationStep(true);
    }
  };

  const handleConfirmReassignment = () => {
    if (selectedPageCategory) {
      onConfirm(selectedPageCategory);
      handleClose();
    }
  };

  const getCurrentPageMapping = () => {
    return PAGE_MAPPINGS.find(mapping => mapping.pageCategory === content?.pageCategory);
  };

  const getNewPageMapping = () => {
    return PAGE_MAPPINGS.find(mapping => mapping.pageCategory === selectedPageCategory);
  };

  if (!content) return null;

  const currentPageMapping = getCurrentPageMapping();
  const newPageMapping = getNewPageMapping();
  const isSameCategory = selectedPageCategory === content.pageCategory;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <SwapIcon />
          Reassign Content to Different Page
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {!confirmationStep ? (
          <Box>
            {/* Current Content Info */}
            <Typography variant="h6" gutterBottom>
              {content.title || (content as any).name || 'Untitled Content'}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" paragraph>
              {content.description?.substring(0, 150)}
              {content.description && content.description.length > 150 ? '...' : ''}
            </Typography>

            {/* Current Category */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="body2">
                <strong>Current Page:</strong>
              </Typography>
              <Chip 
                label={currentPageMapping?.displayName || content.pageCategory}
                size="small"
                color="primary"
              />
              <Typography variant="body2" color="textSecondary">
                ({content.contentType})
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Category Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Move to Page</InputLabel>
              <Select
                value={selectedPageCategory}
                label="Move to Page"
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {PAGE_MAPPINGS.map((mapping) => (
                  <MenuItem 
                    key={mapping.pageCategory} 
                    value={mapping.pageCategory}
                    disabled={mapping.pageCategory === content.pageCategory}
                  >
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <span>{mapping.displayName}</span>
                      {mapping.pageCategory === content.pageCategory && (
                        <span style={{ fontStyle: 'italic', color: 'gray' }}>(current)</span>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedPageCategory && !isSameCategory && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  This will move the content from <strong>{currentPageMapping?.displayName}</strong> to{' '}
                  <strong>{newPageMapping?.displayName}</strong>. The change will be applied to the current session.
                </Typography>
              </Alert>
            )}

            {isSameCategory && selectedPageCategory && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Content is already in the selected page category.
                </Typography>
              </Alert>
            )}
          </Box>
        ) : (
          <Box>
            {/* Confirmation Step */}
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Confirm Content Reassignment
              </Typography>
            </Alert>

            <Typography variant="body1" paragraph>
              Are you sure you want to move this content?
            </Typography>

            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Content:</strong> {content.title || (content as any).name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>From:</strong> {currentPageMapping?.displayName} page
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>To:</strong> {newPageMapping?.displayName} page
              </Typography>
            </Box>

            <Alert severity="info">
              <Typography variant="body2">
                <strong>Important:</strong> This change will be applied to the current session only. 
                To make it permanent, you&apos;ll need to manually update the corresponding CSV files 
                as instructed after the operation completes.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        
        {!confirmationStep ? (
          <Button 
            onClick={handleProceedToConfirmation}
            disabled={!selectedPageCategory || isSameCategory || loading}
            variant="contained"
            color="primary"
          >
            Next
          </Button>
        ) : (
          <>
            <Button 
              onClick={() => setConfirmationStep(false)}
              disabled={loading}
            >
              Back
            </Button>
            <Button 
              onClick={handleConfirmReassignment}
              disabled={loading}
              variant="contained"
              color="warning"
              startIcon={<SwapIcon />}
            >
              {loading ? 'Moving...' : 'Confirm Move'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ContentReassignmentDialog; 