import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { FaKeyboard } from 'react-icons/fa';

function KeyboardShortcutsGuide() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show the guide automatically the first time
    const hasSeenGuide = localStorage.getItem('hasSeenKeyboardGuide');
    if (!hasSeenGuide) {
      setShow(true);
      localStorage.setItem('hasSeenKeyboardGuide', 'true');
    }
  }, []);

  if (!show) {
    return (
      <Button 
        variant="outline-secondary" 
        size="sm" 
        className="position-fixed bottom-0 end-0 m-3"
        onClick={() => setShow(true)}
      >
        <FaKeyboard /> Keyboard Shortcuts
      </Button>
    );
  }

  return (
    <Alert 
      variant="info" 
      className="position-fixed bottom-0 end-0 m-3" 
      style={{ maxWidth: '400px', zIndex: 1050 }}
    >
      <Alert.Heading className="d-flex justify-content-between align-items-center">
        <span><FaKeyboard className="me-2" /> Keyboard Shortcuts</span>
        <Button variant="outline-secondary" size="sm" onClick={() => setShow(false)}>
          Close
        </Button>
      </Alert.Heading>
      <hr />
      <div className="d-flex flex-column">
        <div className="mb-2">
          <strong>Navigation:</strong>
          <div><kbd>J</kbd> - Next annotation</div>
          <div><kbd>K</kbd> - Previous annotation</div>
          <div><kbd>Tab</kbd> - Cycle through annotations</div>
          <div><kbd>Ctrl</kbd>+<kbd>←</kbd> - Back to document list</div>
          <div><kbd>Ctrl</kbd>+<kbd>→</kbd> - Next document (if available)</div>
        </div>
        <div className="mb-2">
          <strong>Annotation:</strong>
          <div><kbd>Ctrl</kbd>+<kbd>S</kbd> - Save annotation</div>
          <div><kbd>C</kbd> - Mark as correct</div>
          <div><kbd>X</kbd> - Mark as incorrect</div>
          <div><kbd>D</kbd> - Delete annotation</div>
          <div><kbd>Esc</kbd> - Cancel selection</div>
        </div>
      </div>
    </Alert>
  );
}

export default KeyboardShortcutsGuide;
