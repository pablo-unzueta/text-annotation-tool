import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaSort } from 'react-icons/fa';

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchDocuments();
  }, [sortBy, sortDirection]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/documents/');
      setDocuments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'created_at') {
      return sortDirection === 'asc'
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Documents</h2>
        <Button as={Link} to="/documents/new" variant="primary">Add New Document</Button>
      </div>

      <div className="filter-bar mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search documents..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
        <div className="mt-2">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="me-2"
            onClick={() => handleSort('title')}
          >
            <FaSort /> Title
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => handleSort('created_at')}
          >
            <FaSort /> Date
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : (
        <Row>
          {sortedDocuments.length > 0 ? (
            sortedDocuments.map(doc => (
              <Col md={4} key={doc.id} className="mb-4">
                <Card className="document-card h-100">
                  <Card.Body>
                    <Card.Title>{doc.title}</Card.Title>
                    <Card.Text>
                      {doc.content.length > 150 
                        ? `${doc.content.substring(0, 150)}...` 
                        : doc.content}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button 
                      as={Link} 
                      to={`/documents/${doc.id}`} 
                      variant="primary" 
                      size="sm"
                    >
                      View & Annotate
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No documents found. Add a new document to get started.</p>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
}

export default DocumentList;
