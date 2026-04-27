import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialPatientForm = {
  patientName: "",
  patientAge: "",
};

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientForm, setPatientForm] = useState(initialPatientForm);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [upiId, setUpiId] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState("selectDoctor");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const doctorResponse = await fetch("/doctors");
        const doctorData = await doctorResponse.json();

        if (!doctorResponse.ok || !doctorData.success) {
          throw new Error(doctorData.message || "Failed to fetch doctors");
        }

        setDoctors(doctorData.doctors);
      } catch (error) {
        setIsError(true);
        setMessage(error.message || "Unable to load admin dashboard");
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDashboardData();
  }, []);

  const availableDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.availability === "Available"),
    [doctors]
  );

  const clearBookingState = () => {
    setSelectedDoctor(null);
    setPatientForm(initialPatientForm);
    setPaymentMethod("Cash");
    setUpiId("");
    setBookingStep("selectDoctor");
  };

  const startBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setPatientForm(initialPatientForm);
    setPaymentMethod("Cash");
    setUpiId("");
    setMessage("");
    setIsError(false);
    setBookingStep("patientDetails");
  };

  const handlePatientFieldChange = (event) => {
    const { name, value } = event.target;

    setPatientForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handlePatientDetailsSubmit = (event) => {
    event.preventDefault();

    if (!selectedDoctor) {
      setIsError(true);
      setMessage("Choose an available doctor first.");
      setBookingStep("selectDoctor");
      return;
    }

    if (!patientForm.patientName.trim() || !patientForm.patientAge.trim()) {
      setIsError(true);
      setMessage("Enter the patient's name and age to continue.");
      return;
    }

    if (Number.isNaN(Number(patientForm.patientAge)) || Number(patientForm.patientAge) <= 0) {
      setIsError(true);
      setMessage("Enter a valid patient age.");
      return;
    }

    setIsError(false);
    setMessage("");
    setBookingStep("payment");
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDoctor) {
      setIsError(true);
      setMessage("Choose an available doctor before booking.");
      setBookingStep("selectDoctor");
      return;
    }

    if (paymentMethod === "UPI" && !upiId.trim()) {
      setIsError(true);
      setMessage("Enter a UPI ID to complete payment.");
      return;
    }

    setIsBooking(true);
    setIsError(false);
    setMessage("");

    try {
      const response = await fetch("/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: patientForm.patientName,
          patientAge: patientForm.patientAge,
          doctorId: selectedDoctor.id,
          paymentMethod,
          upiId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Booking failed");
      }

      setMessage(data.message);
      setIsError(false);
      clearBookingState();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Unable to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="dashboard-layout">
        <div className="page-header">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1>Doctor Booking & Payment Control</h1>
            <p className="subtitle">
              Select an available doctor, enter patient details, and complete payment
              from one admin view.
            </p>
          </div>
          <Link to="/" className="secondary-link">
            Logout
          </Link>
        </div>

        {message ? (
          <p className={isError ? "feedback error-message banner-message" : "feedback success-message banner-message"}>
            {message}
          </p>
        ) : null}

        <div className="dashboard-grid admin-grid">
          <section className="panel-card">
            <div className="panel-title-row">
              <div>
                <h2>Doctor Profiles</h2>
                <p className="muted-text">20 mock doctors with live availability status.</p>
              </div>
            </div>

            {isLoadingDoctors ? (
              <p className="muted-text">Loading doctors...</p>
            ) : (
              <div className="doctor-card-list">
                {doctors.map((doctor) => {
                  const isAvailable = doctor.availability === "Available";

                  return (
                    <article className="doctor-card" key={doctor.id}>
                      <div className="doctor-avatar" aria-hidden="true">
                        {doctor.name
                          .replace("Dr. ", "")
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="doctor-card-content">
                        <div className="doctor-card-header">
                          <div>
                            <h3>{doctor.name}</h3>
                            <p>{doctor.specialization}</p>
                          </div>
                          <span
                            className={
                              isAvailable
                                ? "status-pill available"
                                : "status-pill busy"
                            }
                          >
                            {doctor.availability}
                          </span>
                        </div>
                        <div className="doctor-meta">
                          <span>{doctor.experience}</span>
                          <span>ID #{doctor.id}</span>
                        </div>
                        {isAvailable ? (
                          <button
                            type="button"
                            className="action-link"
                            onClick={() => startBooking(doctor)}
                          >
                            Book appointment
                          </button>
                        ) : (
                          <span className="muted-text">Booking unavailable while doctor is busy.</span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="panel-card booking-panel">
            <div className="panel-title-row">
              <div>
                <h2>Admin Booking Flow</h2>
                <p className="muted-text">
                  Step {bookingStep === "selectDoctor" ? "1" : bookingStep === "patientDetails" ? "2" : "3"} of 3
                </p>
              </div>
            </div>

            {bookingStep === "selectDoctor" ? (
              <div className="flow-card">
                <h3>Select an available doctor</h3>
                <p className="subtitle compact">
                  Use the booking link beside a doctor profile to begin the appointment.
                </p>
                {availableDoctors.length > 0 ? (
                  <div className="selection-list">
                    {availableDoctors.slice(0, 5).map((doctor) => (
                      <button
                        key={doctor.id}
                        type="button"
                        className="selection-chip"
                        onClick={() => startBooking(doctor)}
                      >
                        {doctor.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="muted-text">No doctors are marked available right now.</p>
                )}
              </div>
            ) : null}

            {bookingStep === "patientDetails" && selectedDoctor ? (
              <form onSubmit={handlePatientDetailsSubmit} className="panel-form">
                <div className="selected-doctor-box">
                  <span className="muted-text">Selected Doctor</span>
                  <strong>{selectedDoctor.name}</strong>
                  <p>{selectedDoctor.specialization}</p>
                </div>

                <label htmlFor="patientName">Patient Name</label>
                <input
                  id="patientName"
                  name="patientName"
                  type="text"
                  placeholder="Enter patient name"
                  value={patientForm.patientName}
                  onChange={handlePatientFieldChange}
                />

                <label htmlFor="patientAge">Patient Age</label>
                <input
                  id="patientAge"
                  name="patientAge"
                  type="number"
                  min="1"
                  placeholder="Enter patient age"
                  value={patientForm.patientAge}
                  onChange={handlePatientFieldChange}
                />

                <button type="submit">Continue to Payment</button>
              </form>
            ) : null}

            {bookingStep === "payment" && selectedDoctor ? (
              <form onSubmit={handlePaymentSubmit} className="panel-form">
                <div className="payment-page-card">
                  <h3>Payment Page</h3>
                  <p className="muted-text">
                    Review the patient appointment, then mark payment as completed.
                  </p>

                  <div className="summary-grid">
                    <div>
                      <span>Patient</span>
                      <strong>{patientForm.patientName}</strong>
                    </div>
                    <div>
                      <span>Age</span>
                      <strong>{patientForm.patientAge}</strong>
                    </div>
                    <div>
                      <span>Doctor</span>
                      <strong>{selectedDoctor.name}</strong>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>Ready for Payment</strong>
                    </div>
                  </div>
                </div>

                <label>Payment Method</label>
                <div className="payment-options">
                  <label className="payment-choice">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={paymentMethod === "Cash"}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <span>Cash</span>
                  </label>
                  <label className="payment-choice">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <span>UPI</span>
                  </label>
                </div>

                {paymentMethod === "UPI" ? (
                  <>
                    <label htmlFor="upiId">UPI ID</label>
                    <input
                      id="upiId"
                      type="text"
                      placeholder="Enter UPI ID"
                      value={upiId}
                      onChange={(event) => setUpiId(event.target.value)}
                    />
                  </>
                ) : (
                  <p className="muted-text">Cash payment will be marked as collected by admin.</p>
                )}

                <button type="submit" disabled={isBooking}>
                  {isBooking ? "Processing..." : "Confirm Booking & Payment"}
                </button>
              </form>
            ) : null}
          </section>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
