FROM python:3.12-alpine3.18

WORKDIR /app
COPY . .
ENV FLASK_APP=wsgi.py
ENV PYTHONPATH /app
ENV FLASK_ENV=development

RUN apk update && apk add --no-cache curl && chmod +x wait-for && chmod +x start-script && chmod +x start-script-test && pip install -r requirements.txt