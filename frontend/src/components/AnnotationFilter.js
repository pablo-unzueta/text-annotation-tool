import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { FaFilter, FaSort } from 'react-icons/fa';

function AnnotationFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    isCorrect: null,
    category: '',
    createdBy: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // In a real application, you would fetch these from the API
  useEffect(() => {
    // Mock data for demonstration
    setCategories(['Grammar', 'Factual Error', 'Style', 'Clarity', 'Other']);
    setUsers(['User1', 'User2', 'User3']);
  }, []);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      isCorrect: null,
      category: '',
      createdBy: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="filter-bar p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0"><FaFilter className="me-2" />Filter Annotations</h5>
        <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
      
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={filters.isCorrect === null ? '' : filters.isCorrect.toString()}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('isCorrect', value === '' ? null : value === 'true');
              }}
            >
              <option value="">All</option>
              <option value="true">Correct</option>
              <option value="false">Incorrect</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Created By</Form.Label>
            <Form.Select
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
            >
              <option value="">All Users</option>
              {users.map((user, index) => (
                <option key={index} value={user}>{user}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}

export default AnnotationFilter;
