from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Configuration
from .models import db, Domain

# Config flask
app = Flask(__name__)
app.config.from_object(Configuration)

# Init DB
db.init_app(app)


@app.route("/")
def main():
    return "Flask API"


if __name__ == "__main__":
    app.run(debug=True)
