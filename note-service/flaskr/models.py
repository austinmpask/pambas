from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import String, Integer, DateTime, Date, Boolean, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import re


db = SQLAlchemy()
