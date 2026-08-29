const DOCTORS = [
  { name: 'Dr. Ibnat', specialty: 'Dermatologist — Scalp & Hair Loss', blurb: 'Specializes in scalp inflammation, dandruff, and pattern hair loss.' },
  { name: 'Dr. Nipa', specialty: 'Trichologist', blurb: 'Focuses on hair fiber health, breakage, and porosity-related damage.' },
  { name: 'Dr. Aryan', specialty: 'Dermatologist — General', blurb: 'General scalp and skin concerns, including persistent itch and irritation.' },
  { name: 'Dr. Amisha', specialty: 'Dermatologist — Pediatric & Adult', blurb: 'Sees both children and adults for scalp conditions and hair thinning.' },
];

function renderDoctors() {
  const list = document.getElementById('doctor-list');
  list.innerHTML = DOCTORS.map((doc, i) => `
    <div class="card">
      <p class="tag-pill">${doc.specialty}</p>
      <h3>${doc.name}</h3>
      <p>${doc.blurb}</p>
      <button class="btn btn-ghost" style="margin-top:12px" data-doctor-index="${i}">Book appointment</button>
    </div>`).join('');

  list.querySelectorAll('[data-doctor-index]').forEach((btn) => {
    btn.addEventListener('click', () => openBookingModal(DOCTORS[btn.dataset.doctorIndex]));
  });
}

let activeDoctor = null;

function openBookingModal(doctor) {
  if (!KYH.getToken()) {
    alert('Please log in first so we can confirm the appointment under your account.');
    return;
  }
  activeDoctor = doctor;
  document.getElementById('booking-doctor-specialty').textContent = doctor.specialty;
  document.getElementById('booking-doctor-name').textContent = doctor.name;
  document.getElementById('booking-form').reset();
  document.getElementById('booking-form').style.display = 'block';
  document.getElementById('booking-success').style.display = 'none';
  document.getElementById('booking-error').textContent = '';
  document.getElementById('booking-modal').classList.add('open');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderDoctors();

  document.getElementById('booking-close').addEventListener('click', closeBookingModal);
  document.getElementById('booking-modal').addEventListener('click', (e) => {
    if (e.target.id === 'booking-modal') closeBookingModal();
  });

  document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('booking-error');
    errorEl.textContent = '';

    const payload = {
      doctorName: activeDoctor.name,
      doctorSpecialty: activeDoctor.specialty,
      preferredDate: document.getElementById('booking-date').value,
      contactEmail: document.getElementById('booking-email').value,
      reason: document.getElementById('booking-reason').value,
    };

    const res = await KYH.api.bookAppointment(payload);
    if (res.msg && !res._id) {
      errorEl.textContent = res.msg;
      return;
    }
    document.getElementById('booking-form').style.display = 'none';
    document.getElementById('booking-success').style.display = 'block';
  });
});
