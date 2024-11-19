FROM python:3.12-alpine3.18

WORKDIR /app
COPY . .
ENV FLASK_APP=wsgi.py
ENV PYTHONPATH /app

RUN apk update && apk add --no-cache curl && chmod +x wait-for && chmod +x start-script-dev && chmod +x start-script-prod && chmod +x start-script-test && pip install -r requirements.txt && pip install gunicorn