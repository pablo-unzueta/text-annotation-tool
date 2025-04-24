import React, { useState } from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { FaSort, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp } from 'react-icons/fa';

function AnnotationSorter({ onSortChange, sortField: sortFieldFromParent, sortDirection: sortDirectionFromParent }) {
  const handleSortCriteriaChange = (field) => {
    let newDirection = 'asc';
    if (field === sortFieldFromParent) {
      // Toggle direction if same field
      newDirection = sortDirectionFromParent === 'asc' ? 'desc' : 'asc';
    }
    // Call the parent's handler with the new field and direction
    onSortChange(field, newDirection);
  };

  const getSortIcon = (field) => {
    // Use props for comparison
    if (sortFieldFromParent !== field) return <FaSort />;

    switch (field) {
      case 'created_at':
        // Use props for direction
        return sortDirectionFromParent === 'asc' ? <FaSortNumericDown /> : <FaSortNumericUp />;
      case 'selected_text':
      case 'annotation_text':
        // Use props for direction
        return sortDirectionFromParent === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />;
      case 'is_correct':
        // Use props for direction
        return sortDirectionFromParent === 'asc' ? <FaSortNumericDown /> : <FaSortNumericUp />;
      default:
        return <FaSort />;
    }
  };

  return (
    <div className="mb-3">
      <Dropdown as={ButtonGroup}>
        <Button variant="outline-secondary" size="sm" disabled>
          Sort by: {sortFieldFromParent.replace('_', ' ')} {sortDirectionFromParent === 'asc' ? '↑' : '↓'}
        </Button>
        <Dropdown.Toggle split variant="outline-secondary" size="sm" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSortCriteriaChange('created_at')}>
            {getSortIcon('created_at')} Date Created
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortCriteriaChange('selected_text')}>
            {getSortIcon('selected_text')} Selected Text
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortCriteriaChange('annotation_text')}>
            {getSortIcon('annotation_text')} Annotation Text
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortCriteriaChange('is_correct')}>
            {getSortIcon('is_correct')} Feedback Status
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default AnnotationSorter;
