from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from . import models, database
from .database import engine, get_db
from .models import (
    DocumentCreate,
    DocumentResponse,
    AnnotationCreate,
    AnnotationResponse,
    AnnotationFilter,
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Text Annotation Tool API")

# Add CORS middleware to allow frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Document endpoints
@app.post("/documents/", response_model=DocumentResponse)
def create_document(document: DocumentCreate, db: Session = Depends(get_db)):
    db_document = models.Document(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


@app.get("/documents/", response_model=List[DocumentResponse])
def get_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documents = db.query(models.Document).offset(skip).limit(limit).all()
    return documents


@app.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    document = (
        db.query(models.Document).filter(models.Document.id == document_id).first()
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


# Pydantic model for updating document status
class DocumentStatusUpdate(BaseModel):
    is_good: bool


@app.put("/documents/{document_id}/status", response_model=DocumentResponse)
def update_document_status(
    document_id: int, status_update: DocumentStatusUpdate, db: Session = Depends(get_db)
):
    document = (
        db.query(models.Document).filter(models.Document.id == document_id).first()
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    document.is_good = status_update.is_good
    db.commit()
    db.refresh(document)
    return document


@app.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    document = (
        db.query(models.Document).filter(models.Document.id == document_id).first()
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully"}


# Annotation endpoints
@app.post("/annotations/", response_model=AnnotationResponse)
def create_annotation(annotation: AnnotationCreate, db: Session = Depends(get_db)):
    # Verify document exists
    document = (
        db.query(models.Document)
        .filter(models.Document.id == annotation.document_id)
        .first()
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    db_annotation = models.Annotation(**annotation.dict())
    db.add(db_annotation)
    db.commit()
    db.refresh(db_annotation)
    return db_annotation


@app.get("/annotations/", response_model=List[AnnotationResponse])
def get_annotations(
    document_id: Optional[int] = None,
    is_correct: Optional[bool] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(models.Annotation)

    # Apply filters if provided
    if document_id is not None:
        query = query.filter(models.Annotation.document_id == document_id)
    if is_correct is not None:
        query = query.filter(models.Annotation.is_correct == is_correct)
    if category is not None:
        query = query.filter(models.Annotation.category == category)

    annotations = query.offset(skip).limit(limit).all()
    return annotations


@app.get("/annotations/{annotation_id}", response_model=AnnotationResponse)
def get_annotation(annotation_id: int, db: Session = Depends(get_db)):
    annotation = (
        db.query(models.Annotation)
        .filter(models.Annotation.id == annotation_id)
        .first()
    )
    if annotation is None:
        raise HTTPException(status_code=404, detail="Annotation not found")
    return annotation


@app.put("/annotations/{annotation_id}", response_model=AnnotationResponse)
def update_annotation(
    annotation_id: int, annotation: AnnotationCreate, db: Session = Depends(get_db)
):
    db_annotation = (
        db.query(models.Annotation)
        .filter(models.Annotation.id == annotation_id)
        .first()
    )
    if db_annotation is None:
        raise HTTPException(status_code=404, detail="Annotation not found")

    # Update annotation fields
    for key, value in annotation.dict().items():
        setattr(db_annotation, key, value)

    db.commit()
    db.refresh(db_annotation)
    return db_annotation


@app.delete("/annotations/{annotation_id}")
def delete_annotation(annotation_id: int, db: Session = Depends(get_db)):
    annotation = (
        db.query(models.Annotation)
        .filter(models.Annotation.id == annotation_id)
        .first()
    )
    if annotation is None:
        raise HTTPException(status_code=404, detail="Annotation not found")
    db.delete(annotation)
    db.commit()
    return {"message": "Annotation deleted successfully"}


# Quick feedback endpoint
@app.post("/annotations/{annotation_id}/feedback")
def provide_feedback(
    annotation_id: int,
    is_correct: bool = Query(..., description="Whether the annotation is correct"),
    db: Session = Depends(get_db),
):
    annotation = (
        db.query(models.Annotation)
        .filter(models.Annotation.id == annotation_id)
        .first()
    )
    if annotation is None:
        raise HTTPException(status_code=404, detail="Annotation not found")

    annotation.is_correct = is_correct
    db.commit()
    return {"message": "Feedback recorded successfully"}
