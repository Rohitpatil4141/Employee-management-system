const employeeForm = document.getElementById('employee-form');
const employeeTableBody = document.querySelector('#employee-table tbody');
const alertBox = document.getElementById('alert');

let employees = JSON.parse(localStorage.getItem('employees')) || [];

function renderEmployees() {
  employeeTableBody.innerHTML = '';

  if (employees.length === 0) {
    employeeTableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; color:#7f8c8d; padding: 30px 0;">
          No employees found. Add some!
        </td>
      </tr>
    `;
    return;
  }

  employees.forEach((employee, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${sanitize(employee.name)}</td>
      <td>${sanitize(employee.email)}</td>
      <td>${sanitize(employee.department)}</td>
      <td>
        <button class="action-btn" data-index="${index}" aria-label="Delete ${sanitize(employee.name)}">
          <img src="https://img.icons8.com/ios-glyphs/24/ffffff/trash.png" alt="Delete icon" />
          Delete
        </button>
      </td>
    `;

    employeeTableBody.appendChild(tr);
  });
}

function addEmployee(employee) {
  employees.push(employee);
  saveEmployees();
  renderEmployees();
  showAlert(`Employee "${employee.name}" added successfully!`, 'success');
}

function deleteEmployee(index) {
  const removed = employees.splice(index, 1)[0];
  saveEmployees();
  renderEmployees();
  showAlert(`Employee "${removed.name}" deleted!`, 'success');
}

function saveEmployees() {
  localStorage.setItem('employees', JSON.stringify(employees));
}

employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = employeeForm.name.value.trim();
  const email = employeeForm.email.value.trim();
  const department = employeeForm.department.value;

  if (!name || !email || !department) {
    showAlert('Please fill in all fields.', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showAlert('Please enter a valid email address.', 'error');
    return;
  }

  // Check for duplicate email
  if (employees.some(emp => emp.email.toLowerCase() === email.toLowerCase())) {
    showAlert('An employee with this email already exists.', 'error');
    return;
  }

  addEmployee({ name, email, department });

  employeeForm.reset();
  employeeForm.name.focus();
});

employeeTableBody.addEventListener('click', (e) => {
  if (e.target.closest('.action-btn')) {
    const btn = e.target.closest('.action-btn');
    const index = btn.dataset.index;

    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(index);
    }
  }
});

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email.toLowerCase());
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Alert system with timeout
let alertTimeout;
function showAlert(message, type = 'success') {
  clearTimeout(alertTimeout);
  alertBox.textContent = message;

  if (type === 'success') {
    alertBox.style.backgroundColor = '#27ae60';
  } else {
    alertBox.style.backgroundColor = '#e74c3c';
  }

  alertBox.classList.add('show');

  alertTimeout = setTimeout(() => {
    alertBox.classList.remove('show');
  }, 3500);
}

// Initial render
renderEmployees();
