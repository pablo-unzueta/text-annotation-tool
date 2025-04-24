import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DocumentForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/api/documents/', {
        title,
        content,
        source: source || null
      });
      
      setLoading(false);
      navigate(`/documents/${response.data.id}`);
    } catch (error) {
      setLoading(false);
      setError('Error creating document. Please try again.');
      console.error('Error creating document:', error);
    }
  };

  return (
    <div>
      <h2>Add New Document</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter document content (e.g., LLM output to be annotated)"
            required
          />
          <Form.Text className="text-muted">
            This is the text that will be annotated by domain experts.
          </Form.Text>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Source (Optional)</Form.Label>
          <Form.Control
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source information"
          />
        </Form.Group>
        
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate('/documents')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Document'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default DocumentForm;
