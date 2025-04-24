# Text Annotation Tool - User Guide

This guide provides detailed instructions on how to use the Text Annotation Tool for annotating LLM outputs and other text data.

## Getting Started

### Installation

1. Ensure you have Python 3.10+ and Node.js 14+ installed on your system
2. Clone the repository and navigate to the project directory
3. Install backend dependencies:
   ```
   cd backend
   pip install fastapi uvicorn sqlalchemy pydantic python-multipart
   ```
4. Install frontend dependencies:
   ```
   cd ..
   npm install
   ```

### Starting the Application

Run the application using the provided start script:
```
./start.sh
```

This will start both the backend server (on port 8000) and the frontend development server (on port 3000).

Access the application at: http://localhost:3000

## Core Functionality

### Document Management

1. **Viewing Documents**
   - The home page displays all available documents
   - Use the search bar to find specific documents
   - Sort documents by title or date using the sort buttons

2. **Adding Documents**
   - Click "Add New Document" on the home page or "Add Document" in the navigation bar
   - Fill in the document title and content (e.g., LLM output to be annotated)
   - Optionally add a source reference
   - Click "Create Document" to save

### Text Annotation

1. **Creating Annotations**
   - Open a document by clicking "View & Annotate"
   - Select text by highlighting it with your mouse or touch
   - Enter your annotation in the sidebar form
   - Optionally select a category for the annotation
   - Click "Save Annotation" or press Ctrl+S

2. **Managing Annotations**
   - Edit: Click the edit icon on an existing annotation
   - Delete: Click the trash icon to remove an annotation
   - View: All annotations are listed in the sidebar and highlighted in the text

3. **Providing Feedback**
   - For each annotation, use the "Correct" or "Incorrect" buttons
   - Annotations are color-coded based on feedback status:
     - Yellow: Pending feedback
     - Green: Marked as correct
     - Red: Marked as incorrect

### Advanced Features

1. **Filtering Annotations**
   - Use the filter bar to narrow down annotations by:
     - Status (Correct/Incorrect/All)
     - Category
     - Creator

2. **Sorting Annotations**
   - Click the sort dropdown to order annotations by:
     - Date created
     - Selected text
     - Annotation text
     - Feedback status

3. **Keyboard Navigation**
   - The application supports extensive keyboard shortcuts for efficient annotation:
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

## Best Practices

1. **Efficient Annotation Workflow**
   - Use keyboard shortcuts to navigate between annotations
   - Provide immediate feedback using the correct/incorrect buttons
   - Add detailed annotations for nuanced issues
   - Use categories consistently to enable effective filtering

2. **Team Collaboration**
   - Establish consistent annotation guidelines
   - Use the category field to standardize annotation types
   - Review annotations marked as incorrect to identify patterns

3. **Data Analysis**
   - Use the filtering and sorting capabilities to identify trends
   - Export annotation data for further analysis (via API)
   - Track annotation statistics over time

## Troubleshooting

1. **Application Not Starting**
   - Ensure all dependencies are installed
   - Check if ports 8000 and 3000 are available
   - Review server logs for error messages

2. **Annotation Issues**
   - If text selection isn't working, try clicking outside and selecting again
   - If annotations aren't saving, check the browser console for errors
   - Refresh the page if the application becomes unresponsive

3. **API Connection Problems**
   - Verify the backend server is running
   - Check network connectivity between frontend and backend
   - Ensure CORS settings are properly configured

## Getting Help

For additional assistance or to report issues, please contact the development team or refer to the project repository.

---

This tool was designed to make the annotation process as efficient and user-friendly as possible. We welcome your feedback to continue improving the application.
