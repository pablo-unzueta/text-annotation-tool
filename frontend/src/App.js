import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import DocumentList from './components/DocumentList';
import DocumentView from './components/DocumentView';
import DocumentForm from './components/DocumentForm';

function App() {
  return (
    <div className="app">
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<DocumentList />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/documents/new" element={<DocumentForm />} />
          <Route path="/documents/:id" element={<DocumentView />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
