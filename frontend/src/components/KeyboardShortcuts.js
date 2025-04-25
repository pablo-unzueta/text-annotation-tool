import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function KeyboardShortcuts({ 
  annotations, 
  selectedAnnotation, 
  setSelectedAnnotation, 
  provideFeedback,
  createAnnotation,
  updateAnnotation,
  selectedText,
  deleteAnnotation,
  navigateToNextDocument,
  navigateToPreviousDocument,
  updateDocumentStatus
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Navigation between annotations
      if (e.key === 'j' || e.key === 'J') {
        // J -> Next Document
        if (navigateToNextDocument) {
          navigateToNextDocument();
        }
        e.preventDefault();
      } else if (e.key === 'k' || e.key === 'K') {
        // K -> Previous Document
        if (navigateToPreviousDocument) {
          navigateToPreviousDocument();
        }
        e.preventDefault();
      } else if (e.key === 'Tab') {
        // Tab -> Cycle through annotations
        if (annotations.length > 0) {
          if (!selectedAnnotation) {
            setSelectedAnnotation(annotations[0]);
          } else {
            const currentIndex = annotations.findIndex(a => a.id === selectedAnnotation.id);
            const nextIndex = (currentIndex + 1) % annotations.length;
            setSelectedAnnotation(annotations[nextIndex]);
          }
        }
        e.preventDefault();
      }

      // Save annotation
      if (selectedAnnotation) {
        if (e.key === 'd' || e.key === 'D') {
          // Delete annotation
          if (deleteAnnotation && window.confirm('Are you sure you want to delete this annotation?')) {
            deleteAnnotation(selectedAnnotation.id);
          }
          e.preventDefault();
        }
      } else {
        // Document-level shortcuts (only when no annotation is selected)
        if ((e.key === 'c' || e.key === 'C') && updateDocumentStatus) {
            updateDocumentStatus(true); // Thumbs Up
            e.preventDefault();
        } else if ((e.key === 'x' || e.key === 'X') && updateDocumentStatus) {
            updateDocumentStatus(false); // Thumbs Down
            e.preventDefault();
        }
      }

      // Escape to cancel selection
      if (e.key === 'Escape') {
        if (selectedAnnotation) {
          setSelectedAnnotation(null);
        }
        window.getSelection().removeAllRanges();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    annotations, 
    selectedAnnotation, 
    setSelectedAnnotation, 
    provideFeedback, 
    createAnnotation, 
    updateAnnotation, 
    selectedText,
    deleteAnnotation,
    navigateToNextDocument,
    navigateToPreviousDocument,
    updateDocumentStatus,
    navigate
  ]);

  return null; // This component doesn't render anything
}

export default KeyboardShortcuts;
