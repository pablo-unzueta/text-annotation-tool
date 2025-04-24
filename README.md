# Text Annotation Tool

A web-based tool for domain experts to annotate text data, particularly LLM outputs. This tool allows users to highlight specific text selections, add annotations, and provide feedback on the quality of the content.

## Features

- **Text Highlighting**: Select and highlight specific portions of text
- **Annotation System**: Add detailed annotations to highlighted text
- **One-Click Feedback**: Quickly mark annotations as correct or incorrect
- **Open-Ended Feedback**: Capture nuanced issues through detailed annotations
- **Filtering & Sorting**: Easily navigate through annotations by various criteria
- **Keyboard Shortcuts**: Navigate and annotate efficiently without clicking
- **Context Display**: All relevant information displayed in one place

## Technology Stack

- **Backend**: FastAPI with SQLite database
- **Frontend**: React with Bootstrap for styling
- **API**: RESTful API for document and annotation management

## Installation

### Prerequisites

- Python 3.10+
- Node.js 14+
- npm 6+

### Setup

1. Clone the repository:
```
git clone <repository-url>
cd text-annotation-tool
```

2. Install backend dependencies:
```
cd backend
pip install fastapi uvicorn sqlalchemy pydantic python-multipart
```

3. Install frontend dependencies:
```
cd ..
npm install
```

## Running the Application

You can start both the backend and frontend servers with a single command:

```
./start.sh
```

Alternatively, you can start them separately:

1. Start the backend server:
```
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

2. Start the frontend development server:
```
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Usage

### Adding Documents

1. Navigate to "Add Document" in the navigation bar
2. Enter a title and content (e.g., LLM output to be annotated)
3. Optionally add a source
4. Click "Create Document"

### Creating Annotations

1. Open a document from the document list
2. Select text by highlighting it with your mouse
3. Enter your annotation in the sidebar form
4. Optionally select a category
5. Click "Save Annotation" or press Ctrl+S

### Providing Feedback

1. For each annotation, use the "Correct" or "Incorrect" buttons
2. Alternatively, use keyboard shortcuts:
   - Press 'C' to mark as correct
   - Press 'X' to mark as incorrect

### Filtering and Sorting

1. Use the filter bar to filter annotations by status, category, or creator
2. Use the sort dropdown to sort annotations by different criteria

### Keyboard Shortcuts

- **J**: Navigate to next annotation
- **K**: Navigate to previous annotation
- **Tab**: Cycle through annotations
- **Ctrl+S**: Save current annotation
- **C**: Mark selected annotation as correct
- **X**: Mark selected annotation as incorrect
- **D**: Delete selected annotation
- **Esc**: Cancel selection
- **Ctrl+Left Arrow**: Navigate back to document list
- **Ctrl+Right Arrow**: Navigate to next document (if available)

## API Documentation

The API documentation is available at http://localhost:8000/docs when the backend server is running.

## License

[MIT License](LICENSE)
