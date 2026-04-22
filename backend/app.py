import os

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

USERS = [
    {"username": "admin", "password": "admin123", "role": "Admin"},
    {"username": "doctor1", "password": "doc123", "role": "Doctor"},
    {"username": "patient1", "password": "pat123", "role": "Patient"},
]

DOCTORS = [
    {
        "id": 1,
        "name": "Dr. Aanya Sharma",
        "specialization": "Cardiology",
        "availability": "Available",
        "experience": "11 years",
    },
    {
        "id": 2,
        "name": "Dr. Rohan Mehta",
        "specialization": "Dermatology",
        "availability": "Busy",
        "experience": "9 years",
    },
    {
        "id": 3,
        "name": "Dr. Priya Nair",
        "specialization": "Neurology",
        "availability": "Available",
        "experience": "14 years",
    },
    {
        "id": 4,
        "name": "Dr. Arjun Kapoor",
        "specialization": "Orthopedics",
        "availability": "Busy",
        "experience": "8 years",
    },
    {
        "id": 5,
        "name": "Dr. Sneha Reddy",
        "specialization": "Pediatrics",
        "availability": "Available",
        "experience": "10 years",
    },
    {
        "id": 6,
        "name": "Dr. Vikram Iyer",
        "specialization": "General Medicine",
        "availability": "Available",
        "experience": "13 years",
    },
    {
        "id": 7,
        "name": "Dr. Kavya Rao",
        "specialization": "Gynecology",
        "availability": "Busy",
        "experience": "12 years",
    },
    {
        "id": 8,
        "name": "Dr. Siddharth Bose",
        "specialization": "ENT",
        "availability": "Available",
        "experience": "7 years",
    },
    {
        "id": 9,
        "name": "Dr. Neha Verma",
        "specialization": "Psychiatry",
        "availability": "Busy",
        "experience": "15 years",
    },
    {
        "id": 10,
        "name": "Dr. Aditya Singh",
        "specialization": "Pulmonology",
        "availability": "Available",
        "experience": "9 years",
    },
    {
        "id": 11,
        "name": "Dr. Ishita Das",
        "specialization": "Ophthalmology",
        "availability": "Available",
        "experience": "6 years",
    },
    {
        "id": 12,
        "name": "Dr. Karan Malhotra",
        "specialization": "Urology",
        "availability": "Busy",
        "experience": "10 years",
    },
    {
        "id": 13,
        "name": "Dr. Meera Joshi",
        "specialization": "Endocrinology",
        "availability": "Available",
        "experience": "16 years",
    },
    {
        "id": 14,
        "name": "Dr. Rahul Chawla",
        "specialization": "Oncology",
        "availability": "Busy",
        "experience": "18 years",
    },
    {
        "id": 15,
        "name": "Dr. Tanvi Kulkarni",
        "specialization": "Radiology",
        "availability": "Available",
        "experience": "8 years",
    },
    {
        "id": 16,
        "name": "Dr. Aman Gupta",
        "specialization": "Gastroenterology",
        "availability": "Available",
        "experience": "12 years",
    },
    {
        "id": 17,
        "name": "Dr. Pooja Menon",
        "specialization": "Nephrology",
        "availability": "Busy",
        "experience": "11 years",
    },
    {
        "id": 18,
        "name": "Dr. Yash Patil",
        "specialization": "Physiotherapy",
        "availability": "Available",
        "experience": "5 years",
    },
    {
        "id": 19,
        "name": "Dr. Ritu Bansal",
        "specialization": "Dental Surgery",
        "availability": "Available",
        "experience": "9 years",
    },
    {
        "id": 20,
        "name": "Dr. Nikhil Arora",
        "specialization": "Hepatology",
        "availability": "Busy",
        "experience": "13 years",
    },
]

APPOINTMENTS = [
    {
        "id": 1,
        "patientName": "Aarav Patel",
        "patientAge": "34",
        "doctorId": 1,
        "doctorName": "Dr. Aanya Sharma",
        "specialization": "Cardiology",
        "paymentMethod": "UPI",
        "paymentStatus": "Paid",
        "appointmentStatus": "Confirmed",
        "upiId": "aarav@upi",
    },
    {
        "id": 2,
        "patientName": "Diya Thomas",
        "patientAge": "27",
        "doctorId": 5,
        "doctorName": "Dr. Sneha Reddy",
        "specialization": "Pediatrics",
        "paymentMethod": "Cash",
        "paymentStatus": "Paid",
        "appointmentStatus": "Booked",
        "upiId": "",
    },
    {
        "id": 3,
        "patientName": "Manoj Kumar",
        "patientAge": "51",
        "doctorId": 13,
        "doctorName": "Dr. Meera Joshi",
        "specialization": "Endocrinology",
        "paymentMethod": "UPI",
        "paymentStatus": "Paid",
        "appointmentStatus": "Completed",
        "upiId": "manojk@okaxis",
    },
]


@app.get("/")
def health_check():
    return jsonify({"message": "Care Access backend is running"})


@app.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    matched_user = next(
        (
            user
            for user in USERS
            if user["username"] == username
            and user["password"] == password
        ),
        None,
    )

    if not matched_user:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify(
        {
            "success": True,
            "message": f"{matched_user['role']} login successful",
            "role": matched_user["role"],
        }
    )


@app.get("/doctors")
def get_doctors():
    return jsonify({"success": True, "doctors": DOCTORS})


@app.get("/appointments")
def get_appointments():
    return jsonify({"success": True, "appointments": APPOINTMENTS})


@app.post("/book-appointment")
def book_appointment():
    data = request.get_json(silent=True) or {}
    patient_name = data.get("patientName", "").strip()
    patient_age = str(data.get("patientAge", "")).strip()
    doctor_id = data.get("doctorId")
    payment_method = data.get("paymentMethod", "").strip()
    upi_id = data.get("upiId", "").strip()

    if not patient_name or not patient_age or doctor_id is None or not payment_method:
        return (
            jsonify(
                {
                    "success": False,
                    "message": (
                        "Patient name, patient age, doctor, and payment method are required"
                    ),
                }
            ),
            400,
        )

    if not patient_age.isdigit() or int(patient_age) <= 0:
        return jsonify({"success": False, "message": "Enter a valid patient age"}), 400

    doctor = next((item for item in DOCTORS if item["id"] == doctor_id), None)

    if doctor is None:
        return jsonify({"success": False, "message": "Doctor not found"}), 404

    if doctor["availability"] != "Available":
        return jsonify({"success": False, "message": "Doctor is currently busy"}), 400

    if payment_method not in {"Cash", "UPI"}:
        return jsonify({"success": False, "message": "Invalid payment method"}), 400

    if payment_method == "UPI" and not upi_id:
        return jsonify({"success": False, "message": "UPI ID is required for UPI payment"}), 400

    appointment = {
        "id": len(APPOINTMENTS) + 1,
        "patientName": patient_name,
        "patientAge": patient_age,
        "doctorId": doctor["id"],
        "doctorName": doctor["name"],
        "specialization": doctor["specialization"],
        "paymentMethod": payment_method,
        "paymentStatus": "Paid",
        "appointmentStatus": "Confirmed",
        "upiId": upi_id if payment_method == "UPI" else "",
    }
    APPOINTMENTS.insert(0, appointment)

    return jsonify(
        {
            "success": True,
            "message": (
                f"Appointment booked for {patient_name} with {doctor['name']} and payment marked as paid."
            ),
            "appointment": appointment,
        }
    )


if __name__ == "__main__":
    # Environment-driven settings let the same app run locally and inside Docker.
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(host=host, port=port, debug=debug, use_reloader=False)
