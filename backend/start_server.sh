#!/bin/bash

# Start the FastAPI server
cd /home/ubuntu/text-annotation-tool/backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
