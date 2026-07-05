# routes/student.py - Student-facing API endpoints
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student

student_bp = Blueprint('student', __name__)


@student_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user = User.query.get(int(get_jwt_identity()))
    if not user or not user.student:
        return jsonify({'message': 'Student profile not found'}), 404
    return jsonify({'student': user.student.to_dict()})


@student_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    """Return demo progress data (would come from DB in production)."""
    return jsonify({
        'subjects': [
            {'name': 'Mathematics', 'score': 88},
            {'name': 'Science', 'score': 82},
            {'name': 'English', 'score': 76},
            {'name': 'Social Studies', 'score': 91},
            {'name': 'Hindi', 'score': 79},
        ],
        'attendance': {
            'current': 88,
            'monthly': [94, 88, 80, 92, 90, 94]
        },
        'grade': 'A-',
        'completion': 74
    })


@student_bp.route('/scholarships', methods=['GET'])
@jwt_required()
def get_scholarships():
    return jsonify({
        'scholarships': [
            {'name': 'National Merit Scholarship', 'amount': 12000, 'status': 'eligible'},
            {'name': 'SDMS Retention Award', 'amount': 15000, 'status': 'awarded'},
            {'name': 'State Girls Education Scheme', 'amount': 8000, 'status': 'under-review'},
        ]
    })


@student_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    return jsonify({
        'notifications': [
            {'type': 'warning', 'title': 'Attendance Alert', 'message': 'Below 85%', 'time': '2h ago'},
            {'type': 'info', 'title': 'Counseling', 'message': 'Friday 2:00 PM', 'time': '1d ago'},
            {'type': 'success', 'title': 'Scholarship', 'message': 'Rs 15,000 approved', 'time': '3d ago'},
        ]
    })
