// Elements
const employeeForm = document.getElementById('employee-form');
const employeeTableBody = document.querySelector('#employee-table tbody');

// Load employees from localStorage or empty array
let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Function to render employee list
function renderEmployees() {
  employeeTableBody.innerHTML = '';

  employees.forEach((employee, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.email}</td>
      <td>${employee.department}</td>
      <td><button class="action-btn" data-index="${index}">Delete</button></td>
    `;

    employeeTableBody.appendChild(tr);
  });
}

// Add employee function
function addEmployee(employee) {
  employees.push(employee);
  localStorage.setItem('employees', JSON.stringify(employees));
  renderEmployees();
}

// Delete employee function
function deleteEmployee(index) {
  employees.splice(index, 1);
  localStorage.setItem('employees', JSON.stringify(employees));
  renderEmployees();
}

// Form submit handler
employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = employeeForm.name.value.trim();
  const email = employeeForm.email.value.trim();
  const department = employeeForm.department.value;

  if (!name || !email || !department) return alert('Please fill all fields!');

  // Basic email validation
  if (!validateEmail(email)) {
    return alert('Please enter a valid email!');
  }

  addEmployee({ name, email, department });

  // Reset form
  employeeForm.reset();
});

// Click event on table for delete buttons
employeeTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('action-btn')) {
    const index = e.target.dataset.index;
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(index);
    }
  }
});

// Email validation function
function validateEmail(email) {
  const re =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email.toLowerCase());
}

// Initial render
renderEmployees();
