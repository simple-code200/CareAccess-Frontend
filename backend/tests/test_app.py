import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


def test_app_exists():
    """Test that the Flask app exists."""
    assert app is not None


def test_app_is_testing():
    """Test app configuration."""
    app.config['TESTING'] = True
    assert app.config['TESTING'] is True


def test_login_route_exists():
    """Test that the login route is accessible."""
    with app.test_client() as client:
        response = client.post('/login', json={'username': 'admin', 'password': 'admin123'})
        assert response.status_code == 200


def test_doctors_route_exists():
    """Test that the doctors route is accessible."""
    with app.test_client() as client:
        response = client.get('/doctors')
        assert response.status_code == 200
        assert isinstance(response.json, dict)
