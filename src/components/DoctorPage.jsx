import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MOCK_DOCTOR_ID = 1;

const patientDetailsByAppointment = {
  1: {
    patientId: "PT-1001",
    appointmentDate: "Today",
    appointmentTime: "10:30 AM",
    concern: "Chest discomfort and shortness of breath",
    lastVisit: "18 Mar 2026",
    bloodGroup: "B+",
    height: "172 cm",
    weight: "76 kg",
    bloodPressure: "136/88 mmHg",
    heartRate: "92 bpm",
    temperature: "98.7 F",
    allergies: ["Penicillin"],
    conditions: ["Hypertension", "Borderline high cholesterol"],
    medications: ["Amlodipine 5mg", "Atorvastatin 10mg"],
    notes:
      "Patient reports intermittent chest tightness after climbing stairs. ECG follow-up recommended if symptoms persist.",
  },
  2: {
    patientId: "PT-1002",
    appointmentDate: "11 Apr 2026",
    appointmentTime: "2:15 PM",
    concern: "Persistent skin irritation",
    lastVisit: "05 Feb 2026",
    bloodGroup: "O+",
    height: "160 cm",
    weight: "58 kg",
    bloodPressure: "118/76 mmHg",
    heartRate: "78 bpm",
    temperature: "98.2 F",
    allergies: ["Dust"],
    conditions: ["Eczema"],
    medications: ["Topical steroid cream"],
    notes:
      "Follow-up on current treatment response and discuss long-term skincare routine.",
  },
  3: {
    patientId: "PT-1003",
    appointmentDate: "07 Apr 2026",
    appointmentTime: "4:00 PM",
    concern: "Diabetes review and medication adjustment",
    lastVisit: "12 Jan 2026",
    bloodGroup: "A-",
    height: "168 cm",
    weight: "81 kg",
    bloodPressure: "128/82 mmHg",
    heartRate: "80 bpm",
    temperature: "98.4 F",
    allergies: [],
    conditions: ["Type 2 diabetes"],
    medications: ["Metformin 500mg", "Glimepiride 1mg"],
    notes:
      "Recent fasting sugar readings remain above target. Monitor diet adherence and order HbA1c if needed.",
  },
};

const createFallbackDetails = (appointment) => ({
  patientId: `PT-${String(appointment.id).padStart(4, "0")}`,
  appointmentDate: "Today",
  appointmentTime: "11:00 AM",
  concern: `${appointment.specialization} follow-up consultation`,
  lastVisit: "First visit",
  bloodGroup: "Not recorded",
  height: "Not recorded",
  weight: "Not recorded",
  bloodPressure: "Pending vitals",
  heartRate: "Pending vitals",
  temperature: "Pending vitals",
  allergies: [],
  conditions: [],
  medications: [],
  notes: "Medical history will be updated after consultation begins.",
});

function DoctorPage() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [rescheduleDraft, setRescheduleDraft] = useState({
    date: "",
    time: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDoctorDashboard = async () => {
      try {
        const [doctorResponse, appointmentResponse] = await Promise.all([
          fetch("/doctors"),
          fetch("/appointments"),
        ]);

        const doctorData = await doctorResponse.json();
        const appointmentData = await appointmentResponse.json();

        if (!doctorResponse.ok || !doctorData.success) {
          throw new Error(doctorData.message || "Failed to load doctor profile");
        }

        if (!appointmentResponse.ok || !appointmentData.success) {
          throw new Error(appointmentData.message || "Failed to load appointments");
        }

        const currentDoctor = doctorData.doctors.find(
          (item) => item.id === MOCK_DOCTOR_ID
        );

        if (!currentDoctor) {
          throw new Error("Doctor profile not found");
        }

        const doctorAppointments = appointmentData.appointments
          .filter((appointment) => appointment.doctorId === currentDoctor.id)
          .map((appointment, index) => {
            const details =
              patientDetailsByAppointment[appointment.id] ??
              createFallbackDetails(appointment);

            return {
              ...appointment,
              ...details,
              queueLabel: index === 0 ? "Next Up" : `Queue ${index + 1}`,
              consultationState:
                appointment.appointmentStatus === "Completed"
                  ? "Completed"
                  : appointment.appointmentStatus === "Cancelled"
                    ? "Cancelled"
                    : appointment.appointmentStatus === "Rescheduled"
                      ? "Rescheduled"
                      : "Scheduled",
            };
          });

        setDoctor(currentDoctor);
        setAppointments(doctorAppointments);
        setSelectedAppointmentId(doctorAppointments[0]?.id ?? null);
      } catch (error) {
        setIsError(true);
        setMessage(error.message || "Unable to load doctor dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctorDashboard();
  }, []);

  const selectedAppointment = useMemo(
    () =>
      appointments.find((appointment) => appointment.id === selectedAppointmentId) ??
      appointments[0] ??
      null,
    [appointments, selectedAppointmentId]
  );

  const setAppointmentState = (appointmentId, updates, successMessage) => {
    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              ...updates,
            }
          : appointment
      )
    );
    setIsError(false);
    setMessage(successMessage);
  };

  const handleStartConsultation = (appointmentId) => {
    setAppointmentState(
      appointmentId,
      {
        consultationState: "In Consultation",
        appointmentStatus: "In Consultation",
      },
      "Consultation started. Patient chart is ready for review."
    );
  };

  const handleMarkCompleted = (appointmentId) => {
    setAppointmentState(
      appointmentId,
      {
        consultationState: "Completed",
        appointmentStatus: "Completed",
      },
      "Appointment marked as completed."
    );
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointmentState(
      appointmentId,
      {
        consultationState: "Cancelled",
        appointmentStatus: "Cancelled",
      },
      "Appointment cancelled and removed from the active queue."
    );
  };

  const handleOpenReschedule = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    setRescheduleDraft({
      date: appointment.appointmentDate === "Today" ? "" : appointment.appointmentDate,
      time: appointment.appointmentTime || "",
    });
    setIsError(false);
    setMessage("");
  };

  const handleRescheduleSubmit = (event) => {
    event.preventDefault();

    if (!selectedAppointment) {
      setIsError(true);
      setMessage("Select an appointment before rescheduling.");
      return;
    }

    if (!rescheduleDraft.date.trim() || !rescheduleDraft.time.trim()) {
      setIsError(true);
      setMessage("Choose a new date and time to reschedule this appointment.");
      return;
    }

    setAppointmentState(
      selectedAppointment.id,
      {
        consultationState: "Rescheduled",
        appointmentStatus: "Rescheduled",
        appointmentDate: rescheduleDraft.date,
        appointmentTime: rescheduleDraft.time,
      },
      `Appointment moved to ${rescheduleDraft.date} at ${rescheduleDraft.time}.`
    );
  };

  const getStatusClassName = (status) => {
    if (status === "Completed") {
      return "status-pill paid";
    }

    if (status === "Cancelled") {
      return "status-pill cancelled";
    }

    if (status === "Rescheduled") {
      return "status-pill pending";
    }

    if (status === "In Consultation") {
      return "status-pill available";
    }

    return "status-pill status-neutral";
  };

  const nextPatient =
    appointments.find((appointment) => appointment.consultationState === "Scheduled") ??
    appointments.find((appointment) => appointment.consultationState === "In Consultation") ??
    appointments[0] ??
    null;

  const scheduledAppointments = appointments.filter(
    (appointment) =>
      appointment.consultationState !== "Completed" &&
      appointment.consultationState !== "Cancelled"
  );

  return (
    <div className="page-shell">
      <div className="dashboard-layout">
        <div className="page-header">
          <div>
            <p className="eyebrow">Doctor Dashboard</p>
            <h1>{doctor ? doctor.name : "Doctor Workspace"}</h1>
            <p className="subtitle">
              Manage your live queue, review patient records, and update appointments
              from a cleaner single-screen workspace.
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

        <div className="dashboard-grid doctor-grid">
          <section className="panel-card">
            <div className="panel-title-row">
              <div>
                <h2>Doctor Profile</h2>
                <p className="muted-text">
                  Logged in with the mock doctor account.
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="muted-text">Loading dashboard...</p>
            ) : doctor ? (
              <>
                <div className="doctor-overview-card">
                  <div className="doctor-avatar large" aria-hidden="true">
                    {doctor.name
                      .replace("Dr. ", "")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="doctor-overview-copy">
                    <h3>{doctor.name}</h3>
                    <p>{doctor.specialization}</p>
                    <div className="doctor-meta">
                      <span>{doctor.experience}</span>
                      <span>ID #{doctor.id}</span>
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
                  </div>
                </div>

                <div className="flow-card">
                  <h3>Next Patient</h3>
                  {nextPatient ? (
                    <div className="summary-grid doctor-summary-grid">
                      <div>
                        <span>Patient</span>
                        <strong>{nextPatient.patientName}</strong>
                      </div>
                      <div>
                        <span>Age</span>
                        <strong>{nextPatient.patientAge}</strong>
                      </div>
                      <div>
                        <span>Time</span>
                        <strong>{nextPatient.appointmentTime}</strong>
                      </div>
                      <div>
                        <span>Status</span>
                        <strong>{nextPatient.consultationState}</strong>
                      </div>
                    </div>
                  ) : (
                    <p className="muted-text">No patients assigned yet.</p>
                  )}
                </div>

                <div className="doctor-stats-strip">
                  <div>
                    <span>Active Queue</span>
                    <strong>{scheduledAppointments.length}</strong>
                  </div>
                  <div>
                    <span>Paid Visits</span>
                    <strong>
                      {
                        appointments.filter(
                          (appointment) => appointment.paymentStatus === "Paid"
                        ).length
                      }
                    </strong>
                  </div>
                  <div>
                    <span>Last Slot</span>
                    <strong>
                      {appointments[appointments.length - 1]?.appointmentTime ?? "No slots"}
                    </strong>
                  </div>
                </div>

                <div className="doctor-shift-card">
                  <div className="panel-title-row">
                    <div>
                      <h3>Shift Snapshot</h3>
                      <p className="muted-text">
                        A focused view of today&apos;s rhythm and patient flow.
                      </p>
                    </div>
                  </div>

                  <div className="summary-grid doctor-summary-grid">
                    <div>
                      <span>Current Availability</span>
                      <strong>{doctor.availability}</strong>
                    </div>
                    <div>
                      <span>Specialization</span>
                      <strong>{doctor.specialization}</strong>
                    </div>
                    <div>
                      <span>Next Review</span>
                      <strong>{nextPatient?.patientName ?? "No patient queued"}</strong>
                    </div>
                    <div>
                      <span>Next Slot</span>
                      <strong>{nextPatient?.appointmentTime ?? "No slots"}</strong>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

          </section>

          <section className="panel-card">
            <div className="panel-title-row">
              <div>
                <h2>Appointment Actions</h2>
                <p className="muted-text">
                  Start consultations, complete visits, cancel, or reschedule from the
                  doctor queue.
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="muted-text">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="muted-text">No appointments assigned yet.</p>
            ) : (
              <div className="appointment-action-list">
                {appointments.map((appointment) => (
                  <article className="appointment-action-card" key={appointment.id}>
                    <div className="appointment-action-head">
                      <div>
                        <h3>{appointment.patientName}</h3>
                        <p className="muted-text">
                          {appointment.specialization} | {appointment.appointmentDate},{" "}
                          {appointment.appointmentTime}
                        </p>
                      </div>
                      <span className={getStatusClassName(appointment.consultationState)}>
                        {appointment.consultationState}
                      </span>
                    </div>

                    <div className="summary-grid compact-summary-grid">
                      <div>
                        <span>Concern</span>
                        <strong>{appointment.concern}</strong>
                      </div>
                      <div>
                        <span>Payment</span>
                        <strong>{appointment.paymentStatus}</strong>
                      </div>
                    </div>

                    <div className="action-button-row">
                      <button
                        type="button"
                        className="dashboard-action primary"
                        onClick={() => handleStartConsultation(appointment.id)}
                        disabled={appointment.consultationState === "Completed"}
                      >
                        Start Consultation
                      </button>
                      <button
                        type="button"
                        className="dashboard-action success"
                        onClick={() => handleMarkCompleted(appointment.id)}
                      >
                        Mark Completed
                      </button>
                      <button
                        type="button"
                        className="dashboard-action warning"
                        onClick={() => handleOpenReschedule(appointment)}
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        className="dashboard-action danger"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="dashboard-action ghost"
                        onClick={() => setSelectedAppointmentId(appointment.id)}
                      >
                        View Patient
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="doctor-section-block">
              <div className="doctor-workboard">
                <div className="panel-title-row">
                  <div>
                    <h2>Today&apos;s Workboard</h2>
                    <p className="muted-text">
                      See the queue by stage before opening full patient records.
                    </p>
                  </div>
                </div>

                {appointments.length > 0 ? (
                  <div className="doctor-workboard-grid">
                    <article className="workboard-column">
                      <h3>Waiting</h3>
                      <div className="workboard-list">
                        {appointments
                          .filter(
                            (appointment) =>
                              appointment.consultationState === "Scheduled" ||
                              appointment.consultationState === "Rescheduled"
                          )
                          .map((appointment) => (
                            <div className="workboard-item" key={`waiting-${appointment.id}`}>
                              <strong>{appointment.patientName}</strong>
                              <span>
                                {appointment.appointmentDate}, {appointment.appointmentTime}
                              </span>
                            </div>
                          ))}
                        {appointments.some(
                          (appointment) =>
                            appointment.consultationState === "Scheduled" ||
                            appointment.consultationState === "Rescheduled"
                        ) ? null : (
                          <p className="muted-text">No one is waiting right now.</p>
                        )}
                      </div>
                    </article>

                    <article className="workboard-column">
                      <h3>In Progress</h3>
                      <div className="workboard-list">
                        {appointments
                          .filter(
                            (appointment) =>
                              appointment.consultationState === "In Consultation"
                          )
                          .map((appointment) => (
                            <div className="workboard-item" key={`progress-${appointment.id}`}>
                              <strong>{appointment.patientName}</strong>
                              <span>{appointment.concern}</span>
                            </div>
                          ))}
                        {appointments.some(
                          (appointment) =>
                            appointment.consultationState === "In Consultation"
                        ) ? null : (
                          <p className="muted-text">No consultation is currently live.</p>
                        )}
                      </div>
                    </article>

                    <article className="workboard-column">
                      <h3>Closed</h3>
                      <div className="workboard-list">
                        {appointments
                          .filter(
                            (appointment) =>
                              appointment.consultationState === "Completed" ||
                              appointment.consultationState === "Cancelled"
                          )
                          .map((appointment) => (
                            <div className="workboard-item" key={`closed-${appointment.id}`}>
                              <strong>{appointment.patientName}</strong>
                              <span>{appointment.consultationState}</span>
                            </div>
                          ))}
                        {appointments.some(
                          (appointment) =>
                            appointment.consultationState === "Completed" ||
                            appointment.consultationState === "Cancelled"
                        ) ? null : (
                          <p className="muted-text">No closed appointments yet.</p>
                        )}
                      </div>
                    </article>
                  </div>
                ) : (
                  <p className="muted-text">The workboard will populate when appointments load.</p>
                )}
              </div>

              <div className="panel-title-row">
                <div>
                  <h2>Patient Records</h2>
                  <p className="muted-text">
                    Open any patient from the list to review a roomier chart and make
                    schedule updates without leaving the dashboard.
                  </p>
                </div>
              </div>

              {appointments.length > 0 ? (
                <div className="patient-records-layout">
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
                            <p className="patient-summary-name">{appointment.patientName}</p>
                            <span className="patient-summary-meta">
                              {appointment.patientId} | {appointment.patientAge} yrs
                            </span>
                          </div>
                          <span className="summary-badge">{appointment.queueLabel}</span>
                        </div>
                        <p className="sidebar-patient-subtitle">{appointment.concern}</p>
                        <span className={getStatusClassName(appointment.consultationState)}>
                          {appointment.consultationState}
                        </span>
                      </button>
                    ))}
                  </aside>

                  {selectedAppointment ? (
                    <div className="patient-detail-shell">
                      <div className="patient-detail-hero">
                        <div>
                          <p className="eyebrow patient-detail-tag">Patient Record</p>
                          <h3>{selectedAppointment.patientName}</h3>
                          <p className="subtitle compact">
                            {selectedAppointment.patientId} | Last visit{" "}
                            {selectedAppointment.lastVisit}
                          </p>
                        </div>
                        <span className={getStatusClassName(selectedAppointment.consultationState)}>
                          {selectedAppointment.consultationState}
                        </span>
                      </div>

                      <div className="summary-grid">
                        <div>
                          <span>Primary Concern</span>
                          <strong>{selectedAppointment.concern}</strong>
                        </div>
                        <div>
                          <span>Blood Group</span>
                          <strong>{selectedAppointment.bloodGroup}</strong>
                        </div>
                        <div>
                          <span>Height / Weight</span>
                          <strong>
                            {selectedAppointment.height} / {selectedAppointment.weight}
                          </strong>
                        </div>
                        <div>
                          <span>Vitals</span>
                          <strong>
                            {selectedAppointment.bloodPressure}, {selectedAppointment.heartRate}
                          </strong>
                        </div>
                      </div>

                      <div className="patient-detail-stack">
                        <article className="medical-info-card">
                          <h3>Expanded Medical Info</h3>
                          <div className="detail-list">
                            <div className="detail-row">
                              <span>Temperature</span>
                              <strong>{selectedAppointment.temperature}</strong>
                            </div>
                            <div className="detail-row">
                              <span>Conditions</span>
                              <strong>
                                {selectedAppointment.conditions.length > 0
                                  ? selectedAppointment.conditions.join(", ")
                                  : "No chronic conditions recorded"}
                              </strong>
                            </div>
                            <div className="detail-row">
                              <span>Allergies</span>
                              <strong>
                                {selectedAppointment.allergies.length > 0
                                  ? selectedAppointment.allergies.join(", ")
                                  : "No known allergies"}
                              </strong>
                            </div>
                            <div className="detail-row">
                              <span>Medications</span>
                              <strong>
                                {selectedAppointment.medications.length > 0
                                  ? selectedAppointment.medications.join(", ")
                                  : "No active medications"}
                              </strong>
                            </div>
                          </div>
                        </article>

                        <article className="medical-info-card">
                          <h3>Clinical Notes</h3>
                          <p className="clinical-notes-copy">{selectedAppointment.notes}</p>
                        </article>

                        <form className="reschedule-card" onSubmit={handleRescheduleSubmit}>
                          <div className="panel-title-row">
                            <div>
                              <h3>Reschedule Appointment</h3>
                              <p className="muted-text">
                                Update the selected patient&apos;s next slot with a little
                                more room to work.
                              </p>
                            </div>
                          </div>

                          <div className="reschedule-grid">
                            <label>
                              <span>New Date</span>
                              <input
                                type="text"
                                placeholder="e.g. 12 Apr 2026"
                                value={rescheduleDraft.date}
                                onChange={(event) =>
                                  setRescheduleDraft((currentDraft) => ({
                                    ...currentDraft,
                                    date: event.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label>
                              <span>New Time</span>
                              <input
                                type="text"
                                placeholder="e.g. 3:30 PM"
                                value={rescheduleDraft.time}
                                onChange={(event) =>
                                  setRescheduleDraft((currentDraft) => ({
                                    ...currentDraft,
                                    time: event.target.value,
                                  }))
                                }
                              />
                            </label>
                          </div>

                          <button type="submit" className="dashboard-action warning submit">
                            Save Reschedule
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="muted-text">Select a patient to open the detail view.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DoctorPage;
