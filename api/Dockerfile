FROM python:3.12-alpine3.18

WORKDIR /app
COPY . .
ENV FLASK_APP=wsgi.py
ENV FLASK_DEBUG=1

RUN chmod +x wait-for && chmod +x start-script && pip install -r requirements.txt
