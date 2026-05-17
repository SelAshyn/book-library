#!/bin/bash
set -o errexit

# Install Python dependencies
pip install -r backend/requirements.txt

# Collect static files
python backend/manage.py collectstatic --noinput

# Run migrations
python backend/manage.py migrate
