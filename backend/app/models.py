from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

Base = declarative_base()


# SQLAlchemy Models
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    content = Column(Text, nullable=False)
    source = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_good = Column(Boolean, nullable=True)


class Annotation(Base):
    __tablename__ = "annotations"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    start_offset = Column(Integer, nullable=False)
    end_offset = Column(Integer, nullable=False)
    selected_text = Column(Text, nullable=False)
    annotation_text = Column(Text, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    category = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(100), nullable=True)


# Pydantic Models for API
class DocumentBase(BaseModel):
    title: str
    content: str
    source: Optional[str] = None


class DocumentCreate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_good: Optional[bool] = None

    class Config:
        from_attributes = True


class AnnotationBase(BaseModel):
    document_id: int
    start_offset: int
    end_offset: int
    selected_text: str
    annotation_text: Optional[str] = None
    is_correct: Optional[bool] = None
    category: Optional[str] = None
    created_by: Optional[str] = None


class AnnotationCreate(AnnotationBase):
    pass


class AnnotationResponse(AnnotationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AnnotationFilter(BaseModel):
    document_id: Optional[int] = None
    is_correct: Optional[bool] = None
    category: Optional[str] = None
    created_by: Optional[str] = None
