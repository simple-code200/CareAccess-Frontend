import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MOCK_PATIENT_NAME = "Aarav Patel";

const patientProfile = {
  patientId: "PT-1001",
  age: 34,
  bloodGroup: "B+",
  primaryGoal: "Keep cardiac symptoms under control and stay on schedule with reviews.",
  insurancePlan: "Family Shield Plus",
  allergies: ["Penicillin"],
  medications: ["Amlodipine 5mg", "Atorvastatin 10mg"],
  careTips: [
    "Track chest tightness episodes and bring the notes to each visit.",
    "Take evening medication on time and avoid skipping doses.",
    "Book a follow-up quickly if breathlessness feels worse than usual.",
  ],
};

const appointmentDetailsById = {
  1: {
    appointmentDate: "Today",
    appointmentTime: "10:30 AM",
    visitType: "Follow-up consultation",
    concern: "Chest discomfort and shortness of breath",
    doctorNote:
      "Discuss symptom triggers, confirm medication adherence, and consider ECG follow-up if discomfort continues.",
    clinicDesk: "Cardiac Care Wing, Floor 2",
  },
  2: {
    appointmentDate: "11 Apr 2026",
    appointmentTime: "2:15 PM",
    visitType: "Dermatology review",
    concern: "Persistent skin irritation",
    doctorNote: "Review skin response to the prescribed topical routine.",
    clinicDesk: "Skin & Allergy Desk, Floor 1",
  },
  3: {
    appointmentDate: "07 Apr 2026",
    appointmentTime: "4:00 PM",
    visitType: "Diabetes review",
    concern: "Diabetes review and medication adjustment",
    doctorNote: "Bring the last seven days of sugar readings to the next check-in.",
    clinicDesk: "Metabolic Care, Floor 3",
  },
};

const createFallbackAppointmentDetails = (appointment) => ({
  appointmentDate: "Upcoming",
  appointmentTime: "To be confirmed",
  visitType: `${appointment.specialization} consultation`,
  concern: `${appointment.specialization} follow-up`,
  doctorNote: "Arrive 15 minutes early so the front desk can confirm your details.",
  clinicDesk: "Main reception",
});

function PatientPage() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPatientDashboard = async () => {
      try {
        const [doctorResponse, appointmentResponse] = await Promise.all([
          fetch("/doctors"),
          fetch("/appointments"),
        ]);

        const doctorData = await doctorResponse.json();
        const appointmentData = await appointmentResponse.json();

        if (!doctorResponse.ok || !doctorData.success) {
          throw new Error(doctorData.message || "Failed to load doctors");
        }

        if (!appointmentResponse.ok || !appointmentData.success) {
          throw new Error(appointmentData.message || "Failed to load appointments");
        }

        const normalizedAppointments = appointmentData.appointments
          .filter((appointment) => appointment.patientName === MOCK_PATIENT_NAME)
          .map((appointment) => ({
            ...appointment,
            ...(appointmentDetailsById[appointment.id] ??
              createFallbackAppointmentDetails(appointment)),
          }));

        setDoctors(doctorData.doctors);
        setAppointments(normalizedAppointments);
        setSelectedAppointmentId(normalizedAppointments[0]?.id ?? null);
      } catch (error) {
        setIsError(true);
        setMessage(error.message || "Unable to load patient dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientDashboard();
  }, []);

  const selectedAppointment = useMemo(
    () =>
      appointments.find((appointment) => appointment.id === selectedAppointmentId) ??
      appointments[0] ??
      null,
    [appointments, selectedAppointmentId]
  );

  const recommendedDoctors = useMemo(
    () =>
      doctors
        .filter(
          (doctor) =>
            doctor.specialization === selectedAppointment?.specialization ||
            doctor.availability === "Available"
        )
        .slice(0, 4),
    [doctors, selectedAppointment]
  );

  return (
    <div className="page-shell">
      <div className="dashboard-layout">
        <div className="page-header">
          <div>
            <p className="eyebrow">Patient Dashboard</p>
            <h1>{MOCK_PATIENT_NAME}</h1>
            <p className="subtitle">
              Track appointments, review payment status, and keep your care plan in one
              patient-friendly workspace.
            </p>
          </div>
          <Link to="/" className="secondary-link">
            Logout
          </Link>
        </div>

        {message ? (
          <p
            className={
              isError
                ? "feedback error-message banner-message"
                : "feedback success-message banner-message"
            }
          >
            {message}
          </p>
        ) : null}

        <div className="dashboard-grid patient-grid">
          <section className="panel-card">
            <div className="panel-title-row">
              <div>
                <h2>Profile & Care Plan</h2>
                <p className="muted-text">
                  Your personal summary and important care reminders.
                </p>
              </div>
            </div>

            <div className="patient-profile-card">
              <div className="patient-avatar" aria-hidden="true">
                {MOCK_PATIENT_NAME.split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="patient-profile-copy">
                <h3>{MOCK_PATIENT_NAME}</h3>
                <p>{patientProfile.primaryGoal}</p>
                <div className="doctor-meta">
                  <span>{patientProfile.patientId}</span>
                  <span>{patientProfile.age} years</span>
                  <span>{patientProfile.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="summary-grid patient-summary-grid">
              <div>
                <span>Insurance</span>
                <strong>{patientProfile.insurancePlan}</strong>
              </div>
              <div>
                <span>Current Focus</span>
                <strong>Symptom review</strong>
              </div>
              <div>
                <span>Allergies</span>
                <strong>{patientProfile.allergies.join(", ")}</strong>
              </div>
              <div>
                <span>Active Medicines</span>
                <strong>{patientProfile.medications.join(", ")}</strong>
              </div>
            </div>

            <div className="patient-care-card">
              <h3>Care Tips</h3>
              <div className="patient-tip-list">
                {patientProfile.careTips.map((tip) => (
                  <p key={tip}>{tip}</p>
                ))}
              </div>
            </div>
          </section>

          <section className="panel-card">
            <div className="panel-title-row">
              <div>
                <h2>Appointments</h2>
                <p className="muted-text">
                  Review the next visit and inspect your appointment timeline.
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="muted-text">Loading dashboard...</p>
            ) : appointments.length === 0 ? (
              <p className="muted-text">
                No appointments are attached to this mock patient account yet.
              </p>
            ) : (
              <div className="patient-appointment-layout">
                <aside className="patient-records-sidebar">
                  {appointments.map((appointment) => (
                    <button
                      type="button"
                      key={appointment.id}
                      className={
                        appointment.id === selectedAppointment?.id
                          ? "sidebar-patient-item active"
                          : "sidebar-patient-item"
                      }
                      onClick={() => setSelectedAppointmentId(appointment.id)}
                    >
                      <div className="sidebar-patient-head">
                        <div>
                          <p className="patient-summary-name">{appointment.doctorName}</p>
                          <span className="patient-summary-meta">
                            {appointment.specialization}
                          </span>
                        </div>
                        <span className="summary-badge">{appointment.paymentStatus}</span>
                      </div>
                      <p className="sidebar-patient-subtitle">{appointment.concern}</p>
                      <span className="status-pill status-neutral">
                        {appointment.appointmentStatus}
                      </span>
                    </button>
                  ))}
                </aside>

                {selectedAppointment ? (
                  <div className="patient-detail-shell">
                    <div className="patient-detail-hero">
                      <div>
                        <p className="eyebrow patient-detail-tag">Next Appointment</p>
                        <h3>{selectedAppointment.doctorName}</h3>
                        <p className="subtitle compact">
                          {selectedAppointment.appointmentDate},{" "}
                          {selectedAppointment.appointmentTime}
                        </p>
                      </div>
                      <span className="status-pill available">
                        {selectedAppointment.paymentStatus}
                      </span>
                    </div>

                    <div className="summary-grid">
                      <div>
                        <span>Visit Type</span>
                        <strong>{selectedAppointment.visitType}</strong>
                      </div>
                      <div>
                        <span>Specialization</span>
                        <strong>{selectedAppointment.specialization}</strong>
                      </div>
                      <div>
                        <span>Clinic Desk</span>
                        <strong>{selectedAppointment.clinicDesk}</strong>
                      </div>
                      <div>
                        <span>Payment Method</span>
                        <strong>{selectedAppointment.paymentMethod}</strong>
                      </div>
                    </div>

                    <div className="medical-info-grid">
                      <article className="medical-info-card">
                        <h3>Visit Preparation</h3>
                        <p>
                          Concern: <strong>{selectedAppointment.concern}</strong>
                        </p>
                        <p>
                          Status: <strong>{selectedAppointment.appointmentStatus}</strong>
                        </p>
                        <p>
                          UPI ID:{" "}
                          <strong>
                            {selectedAppointment.upiId || "Not required for this visit"}
                          </strong>
                        </p>
                      </article>

                      <article className="medical-info-card">
                        <h3>Doctor Note</h3>
                        <p className="muted-text">{selectedAppointment.doctorNote}</p>
                      </article>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>

        <section className="dashboard-grid patient-lower-grid">
          <div className="panel-card">
            <div className="panel-title-row">
              <div>
                <h2>Billing Snapshot</h2>
                <p className="muted-text">
                  Quick confirmation that your latest visit payment is settled.
                </p>
              </div>
            </div>

            {selectedAppointment ? (
              <div className="billing-strip">
                <div>
                  <span>Latest Payment</span>
                  <strong>{selectedAppointment.paymentStatus}</strong>
                </div>
                <div>
                  <span>Method</span>
                  <strong>{selectedAppointment.paymentMethod}</strong>
                </div>
                <div>
                  <span>Doctor</span>
                  <strong>{selectedAppointment.doctorName}</strong>
                </div>
                <div>
                  <span>Appointment State</span>
                  <strong>{selectedAppointment.appointmentStatus}</strong>
                </div>
              </div>
            ) : (
              <p className="muted-text">Payment details will appear when an appointment is selected.</p>
            )}
          </div>

          <div className="panel-card">
            <div className="panel-title-row">
              <div>
                <h2>Recommended Doctors</h2>
                <p className="muted-text">
                  Similar or available doctors you may want for the next booking.
                </p>
              </div>
            </div>

            <div className="recommended-doctor-list">
              {recommendedDoctors.map((doctor) => (
                <article className="mini-doctor-card" key={doctor.id}>
                  <div className="doctor-avatar" aria-hidden="true">
                    {doctor.name
                      .replace("Dr. ", "")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3>{doctor.name}</h3>
                    <p className="muted-text">
                      {doctor.specialization} • {doctor.experience}
                    </p>
                  </div>
                  <span
                    className={
                      doctor.availability === "Available"
                        ? "status-pill available"
                        : "status-pill busy"
                    }
                  >
                    {doctor.availability}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PatientPage;
