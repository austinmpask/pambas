FROM python:3.12-alpine3.18

WORKDIR /app
COPY . .
RUN chmod +x wait-for && pip install -r requirements.txt

ENV FLASK_APP=flaskr
ENV FLASK_DEBUG=1