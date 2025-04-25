import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Form, Card, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaCheck, FaTimes, FaTrash, FaEdit, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import KeyboardShortcuts from './KeyboardShortcuts';
import AnnotationFilter from './AnnotationFilter';
import AnnotationSorter from './AnnotationSorter';
import './DocumentView.css';

function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [allDocuments, setAllDocuments] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [filteredAnnotations, setFilteredAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [annotationText, setAnnotationText] = useState('');
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [category, setCategory] = useState('');
  const textContentRef = useRef(null);
  const annotationInputRef = useRef(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch document, annotations, and all documents list
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError('');
        const [docResponse, annotationsResponse, allDocsResponse] = await Promise.all([
          axios.get(`/api/documents/${id}`),
          axios.get(`/api/annotations/?document_id=${id}`),
          axios.get('/api/documents/')
        ]);

        setDocument(docResponse.data);
        setAnnotations(annotationsResponse.data);
        setFilteredAnnotations(annotationsResponse.data);
        const sortedDocs = allDocsResponse.data.sort((a, b) => a.id - b.id);
        setAllDocuments(sortedDocs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 404) {
           setError(`Document with ID ${id} not found.`);
        } else {
           setError('Error loading data. Please try again.');
        }
        setLoading(false);
        setDocument(null);
        setAllDocuments([]);
      }
    };

    fetchAllData();
    return () => {
        setDocument(null);
        setAnnotations([]);
        setFilteredAnnotations([]);
        setSelectedAnnotation(null);
        setSelectedText('');
    }
  }, [id]);

  // Function to update document status (good/bad)
  const updateDocumentStatus = useCallback(async (isGood) => {
    if (!document) return;
    try {
      const response = await axios.put(`/api/documents/${id}/status`, { is_good: isGood });
      setDocument(response.data); // Update local state with the updated document
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error updating document status:', error);
      setError('Failed to update document status. Please try again.');
    }
  }, [id, document]);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textContent = textContentRef.current;
      
      if (textContent && textContent.contains(range.commonAncestorContainer)) {
        const content = document.content;
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(textContent);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;
        
        const selectedText = range.toString().trim();
        if (selectedText.length > 0) {
          setSelectedText(selectedText);
          setSelectionRange({ 
            start, 
            end: start + selectedText.length 
          });
          setSelectedAnnotation(null);
          setAnnotationText('');
        }
      }
    }
  };

  // Wrap functions passed to KeyboardShortcuts in useCallback
  const createAnnotation = useCallback(async () => {
    if (!selectedText || selectedText.length === 0) {
      return;
    }
    try {
      const response = await axios.post('/api/annotations/', {
        document_id: parseInt(id),
        start_offset: selectionRange.start,
        end_offset: selectionRange.end,
        selected_text: selectedText,
        annotation_text: annotationText,
        category: category || null
      });
      const newAnnotation = response.data;
      setAnnotations(prev => [...prev, newAnnotation]);
      setFilteredAnnotations(prev => [...prev, newAnnotation]);
      setSelectedText('');
      setAnnotationText('');
      setCategory('');
      window.getSelection().removeAllRanges();
    } catch (error) {
      console.error('Error creating annotation:', error);
      setError('Error creating annotation. Please try again.');
    }
  }, [id, selectionRange, selectedText, annotationText, category]);

  const updateAnnotation = useCallback(async () => {
    if (!selectedAnnotation) return;
    try {
      const response = await axios.put(`/api/annotations/${selectedAnnotation.id}`, {
        ...selectedAnnotation,
        annotation_text: annotationText,
        category: category || selectedAnnotation.category
      });
      const updatedAnnotation = response.data;
      const updateList = (list) => list.map(ann => ann.id === selectedAnnotation.id ? updatedAnnotation : ann);
      setAnnotations(updateList);
      setFilteredAnnotations(updateList);
      setSelectedAnnotation(null);
      setAnnotationText('');
      setCategory('');
    } catch (error) {
      console.error('Error updating annotation:', error);
      setError('Error updating annotation. Please try again.');
    }
  }, [selectedAnnotation, annotationText, category]);

  const deleteAnnotation = useCallback(async (annotationId) => {
    try {
      await axios.delete(`/api/annotations/${annotationId}`);
      const filterList = (list) => list.filter(ann => ann.id !== annotationId);
      setAnnotations(filterList);
      setFilteredAnnotations(filterList);
      if (selectedAnnotation && selectedAnnotation.id === annotationId) {
        setSelectedAnnotation(null);
        setAnnotationText('');
        setCategory('');
      }
    } catch (error) {
      console.error('Error deleting annotation:', error);
      setError('Error deleting annotation. Please try again.');
    }
  }, [selectedAnnotation]);

  const selectAnnotation = useCallback((annotation) => {
    setSelectedAnnotation(annotation);
    setAnnotationText(annotation?.annotation_text || '');
    setCategory(annotation?.category || '');
    setSelectedText('');
  }, []);

  // Define navigation functions
  const navigateToNextDocument = useCallback(() => {
    if (allDocuments.length === 0) return; // No list to navigate

    const currentIndex = allDocuments.findIndex(doc => doc.id === parseInt(id));
    if (currentIndex === -1) {
        console.error("Current document ID not found in the list.");
        return; // Should not happen if fetch is correct
    }

    // Check if it's not the last document
    if (currentIndex < allDocuments.length - 1) {
      const nextDocId = allDocuments[currentIndex + 1].id;
      navigate(`/documents/${nextDocId}`);
    } else {
      console.log("Already at the last document.");
      // Optionally, loop back to the first? navigate(`/documents/${allDocuments[0].id}`);
    }
  }, [allDocuments, id, navigate]); // Add dependencies

  const navigateToPreviousDocument = useCallback(() => {
    if (allDocuments.length === 0) return; // No list to navigate

    const currentIndex = allDocuments.findIndex(doc => doc.id === parseInt(id));
     if (currentIndex === -1) {
        console.error("Current document ID not found in the list.");
        return; // Should not happen if fetch is correct
    }

    // Check if it's not the first document
    if (currentIndex > 0) {
      const prevDocId = allDocuments[currentIndex - 1].id;
      navigate(`/documents/${prevDocId}`);
    } else {
      console.log("Already at the first document.");
      // Optionally, loop back to the last? navigate(`/documents/${allDocuments[allDocuments.length - 1].id}`);
    }
  }, [allDocuments, id, navigate]); // Add dependencies

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...annotations];
    
    if (filters.isCorrect !== null) {
      filtered = filtered.filter(ann => ann.is_correct === filters.isCorrect);
    }
    
    if (filters.category) {
      filtered = filtered.filter(ann => ann.category === filters.category);
    }
    
    if (filters.createdBy) {
      filtered = filtered.filter(ann => ann.created_by === filters.createdBy);
    }
    
    setFilteredAnnotations(filtered);
  };

  // Handle sort changes - now receives field and direction
  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Memoize the sorted and filtered annotations
  const sortedAndFilteredAnnotations = useMemo(() => {
    // Make a copy to sort
    const annotationsToSort = [...filteredAnnotations];

    // Sorting logic moved here from AnnotationSorter
    annotationsToSort.sort((a, b) => {
      let comparison = 0;
      const field = sortField; // Use state variable
      const direction = sortDirection; // Use state variable

      switch (field) {
        case 'created_at':
          comparison = new Date(a.created_at) - new Date(b.created_at);
          break;
        case 'selected_text':
          comparison = a.selected_text.localeCompare(b.selected_text);
          break;
        case 'annotation_text':
          const aText = a.annotation_text || '';
          const bText = b.annotation_text || '';
          comparison = aText.localeCompare(bText);
          break;
        case 'is_correct':
          if (a.is_correct === null && b.is_correct !== null) return 1;
          if (a.is_correct !== null && b.is_correct === null) return -1;
          if (a.is_correct === b.is_correct) return 0;
          comparison = a.is_correct ? -1 : 1; // true first
          break;
        default:
          comparison = 0;
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return annotationsToSort;
    // Dependencies: run only when these change
  }, [filteredAnnotations, sortField, sortDirection]);

  // Render document content with highlighted annotations
  const renderDocumentContent = () => {
    if (!document) return null;
    
    const content = document.content;
    const sortedAnnotations = [...annotations].sort((a, b) => a.start_offset - b.start_offset);
    
    let lastIndex = 0;
    const contentParts = [];
    
    sortedAnnotations.forEach((annotation, index) => {
      // Add text before the annotation
      if (annotation.start_offset > lastIndex) {
        contentParts.push(content.substring(lastIndex, annotation.start_offset));
      }
      
      // Add the highlighted annotation
      const highlightClass = `highlight ${selectedAnnotation && selectedAnnotation.id === annotation.id ? 'selected' : ''} ${annotation.is_correct === true ? 'correct' : ''} ${annotation.is_correct === false ? 'incorrect' : ''}`;
      
      contentParts.push(
        <span 
          key={`annotation-${annotation.id}`}
          className={highlightClass}
          onClick={() => selectAnnotation(annotation)}
          data-annotation-id={annotation.id}
        >
          {content.substring(annotation.start_offset, annotation.end_offset)}
        </span>
      );
      
      lastIndex = annotation.end_offset;
    });
    
    // Add remaining text
    if (lastIndex < content.length) {
      contentParts.push(content.substring(lastIndex));
    }
    
    return contentParts;
  };

  // Fix the useEffect to focus the textarea
  useEffect(() => {
    // If text has been selected and the input ref is available
    if (selectedText && annotationInputRef.current) {
      // Focus the textarea
      annotationInputRef.current.focus();
    }
    // Run this effect whenever selectedText changes
  }, [selectedText]);

  if (loading) {
    return <p>Loading document...</p>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!document) {
    return <Alert variant="warning">Document not found</Alert>;
  }

  return (
    <div>
      <KeyboardShortcuts
        annotations={sortedAndFilteredAnnotations}
        selectedAnnotation={selectedAnnotation}
        setSelectedAnnotation={selectAnnotation}
        createAnnotation={createAnnotation}
        updateAnnotation={updateAnnotation}
        selectedText={selectedText}
        annotationText={annotationText}
        deleteAnnotation={deleteAnnotation}
        navigateToNextDocument={navigateToNextDocument}
        navigateToPreviousDocument={navigateToPreviousDocument}
        updateDocumentStatus={updateDocumentStatus}
      />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
            <h2 className="me-3 mb-0">{document.title}</h2>
            <Button 
                variant={document.is_good === true ? "success" : "outline-success"} 
                size="sm" 
                onClick={() => updateDocumentStatus(true)}
                className="me-2"
                title="Mark document as good"
            >
                <FaThumbsUp />
            </Button>
            <Button 
                variant={document.is_good === false ? "danger" : "outline-danger"} 
                size="sm" 
                onClick={() => updateDocumentStatus(false)}
                title="Mark document as bad"
            >
                <FaThumbsDown />
            </Button>
        </div>
        <Button variant="secondary" onClick={() => navigate('/documents')}>
          Back to Documents
        </Button>
      </div>
      
      {document.source && (
        <p className="text-muted mb-4">
          Source: {document.source}
        </p>
      )}
      
      <Row>
        <Col md={8}>
          <div className="annotation-container mb-4">
            <div 
              ref={textContentRef}
              className="text-content"
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              {renderDocumentContent()}
            </div>
          </div>
        </Col>
        
        <Col md={4}>
          <div className="annotation-sidebar">
            {selectedText ? (
              <Card className="annotation-form mb-4">
                <Card.Body>
                  <Card.Title>New Annotation</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Selected text: "{selectedText}"
                  </Card.Subtitle>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Annotation</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={annotationText}
                      onChange={(e) => setAnnotationText(e.target.value)}
                      placeholder="Enter your annotation..."
                      ref={annotationInputRef}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Category (Optional)</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="Grammar">Grammar</option>
                      <option value="Factual Error">Factual Error</option>
                      <option value="Style">Style</option>
                      <option value="Clarity">Clarity</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      onClick={createAnnotation}
                    >
                      Save Annotation
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ) : selectedAnnotation ? (
              <Card className="annotation-form mb-4">
                <Card.Body>
                  <Card.Title>Edit Annotation</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Selected text: "{selectedAnnotation.selected_text}"
                  </Card.Subtitle>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Annotation</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={annotationText}
                      onChange={(e) => setAnnotationText(e.target.value)}
                      placeholder="Enter your annotation..."
                      ref={annotationInputRef}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Category (Optional)</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="Grammar">Grammar</option>
                      <option value="Factual Error">Factual Error</option>
                      <option value="Style">Style</option>
                      <option value="Clarity">Clarity</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setSelectedAnnotation(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={updateAnnotation}
                    >
                      Update Annotation
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ) : null}
            
            <AnnotationFilter onFilterChange={handleFilterChange} />
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Annotations ({sortedAndFilteredAnnotations.length})</h4>
              <AnnotationSorter
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
              />
            </div>
            
            {sortedAndFilteredAnnotations.length === 0 ? (
              <p className="text-muted">No annotations match the current filters.</p>
            ) : (
              sortedAndFilteredAnnotations.map(annotation => (
                <Card key={annotation.id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Badge 
                          bg={annotation.is_correct === true ? 'success' : annotation.is_correct === false ? 'danger' : 'secondary'}
                          className="me-2"
                        >
                          {annotation.is_correct === true ? 'Correct' : annotation.is_correct === false ? 'Incorrect' : 'Pending'}
                        </Badge>
                        {annotation.category && (
                          <Badge bg="info" className="me-2">
                            {annotation.category}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 me-2"
                          onClick={() => selectAnnotation(annotation)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 text-danger"
                          onClick={() => deleteAnnotation(annotation.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                    
                    <Card.Text className="mb-2">
                      <strong>Text:</strong> "{annotation.selected_text}"
                    </Card.Text>
                    
                    <Card.Text className="mb-3">
                      <strong>Annotation:</strong> {annotation.annotation_text || <em>No annotation provided</em>}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>

      <div className="keyboard-shortcut-box">
        <div className="text-muted">
          <small>
            <strong>Keyboard Shortcuts:</strong><br />
            <span>Next Doc: <kbd>J</kbd></span> |
            <span> Prev Doc: <kbd>K</kbd></span> |
            <span> Cycle Annotations: <kbd>Tab</kbd></span> |
            <span> Good Doc: <kbd>C</kbd></span> |
            <span> Bad Doc: <kbd>X</kbd></span> |
            <span> Delete Annotation: <kbd>D</kbd></span> |
            <span> Cancel/Deselect: <kbd>Esc</kbd></span>
          </small>
        </div>
      </div>

    </div>
  );
}

export default DocumentView;
