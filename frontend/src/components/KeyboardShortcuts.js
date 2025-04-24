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
  navigateToPreviousDocument
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
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        if (selectedAnnotation) {
          updateAnnotation();
        } else if (selectedText) {
          createAnnotation();
        }
        e.preventDefault();
      }

      // Provide feedback
      if (selectedAnnotation) {
        if (e.key === 'c' || e.key === 'C') {
          // Mark as correct
          provideFeedback(selectedAnnotation.id, true);
          e.preventDefault();
        } else if (e.key === 'x' || e.key === 'X') {
          // Mark as incorrect
          provideFeedback(selectedAnnotation.id, false);
          e.preventDefault();
        } else if (e.key === 'd' || e.key === 'D') {
          // Delete annotation
          if (deleteAnnotation && window.confirm('Are you sure you want to delete this annotation?')) {
            deleteAnnotation(selectedAnnotation.id);
          }
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
    navigate
  ]);

  return null; // This component doesn't render anything
}

export default KeyboardShortcuts;
