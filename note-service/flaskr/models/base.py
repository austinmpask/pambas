from flask_sqlalchemy import SQLAlchemy

# Init db
db = SQLAlchemy()

# Make base accessible to models
Base = db.Model
