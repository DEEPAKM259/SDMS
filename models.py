# models.py - Database models
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='student')  # student, admin, mentor
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    student = db.relationship('Student', backref='user', uselist=False)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'email': self.email,
            'role': self.role, 'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_id = db.Column(db.String(20), unique=True)  # SDMS-2024-00142
    dob = db.Column(db.Date)
    phone = db.Column(db.String(15))
    guardian_contact = db.Column(db.String(15))
    address = db.Column(db.Text)
    stage = db.Column(db.String(30), nullable=False)
    class_name = db.Column(db.String(30), nullable=False)
    school = db.Column(db.String(150))
    attendance = db.Column(db.Float, default=0)
    grade = db.Column(db.String(5))
    status = db.Column(db.String(20), default='active')  # active, at-risk, dropout
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'student_id': self.student_id,
            'name': self.user.name if self.user else '',
            'stage': self.stage, 'class_name': self.class_name,
            'school': self.school, 'attendance': self.attendance,
            'grade': self.grade, 'status': self.status,
        }


class DropoutCause(db.Model):
    __tablename__ = 'dropout_causes'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    stage = db.Column(db.String(30))
    cause = db.Column(db.String(50))  # Financial, Family, Academic, etc.
    description = db.Column(db.Text)
    severity = db.Column(db.String(10), default='medium')
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'stage': self.stage,
            'cause': self.cause, 'severity': self.severity,
        }


class UploadedFile(db.Model):
    __tablename__ = 'uploaded_files'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255))
    category = db.Column(db.String(50))
    description = db.Column(db.Text)
    file_size = db.Column(db.Integer, default=0)
    gcs_url = db.Column(db.String(500))
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    uploader = db.relationship('User', backref='files')

    def to_dict(self):
        return {
            'id': self.id, 'filename': self.filename,
            'original_name': self.original_name,
            'category': self.category, 'file_size': self.file_size,
            'gcs_url': self.gcs_url,
            'uploaded_by': self.uploader.name if self.uploader else 'Unknown',
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None,
        }
