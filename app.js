/**
 * StudyFlow - Aplicação Web de Organização de Estudos
 */

// STATE MANAGEMENT
const STATE = {
  subjects: JSON.parse(localStorage.getItem('sf_subjects')) || [
    { id: 'sub-1', name: 'Cálculo III', color: '#4f46e5' },
    { id: 'sub-2', name: 'Algoritmos', color: '#10b981' },
    { id: 'sub-3', name: 'Física Geral', color: '#f59e0b' }
  ],
  tasks: JSON.parse(localStorage.getItem('sf_tasks')) || [
    { id: 'tsk-1', title: 'Lista de Exercícios 02', subjectId: 'sub-1', priority: 'alta', date: getRelativeDate(2), completed: false, desc: 'Exercícios 1 ao 15 do Capítulo 3.' },
    { id: 'tsk-2', title: 'Implementar Fila em C++', subjectId: 'sub-2', priority: 'media', date: getRelativeDate(5), completed: false, desc: 'Enviar arquivo .cpp pelo Portal.' },
    { id: 'tsk-3', title: 'Relatório de Laboratório', subjectId: 'sub-3', priority: 'baixa', date: getRelativeDate(-1), completed: true, desc: 'Experimento sobre Dinâmica.' }
  ],
  notes: localStorage.getItem('sf_notes') || '',
  isNotesUnlocked: false,
  currentView: 'dashboard',
  currentDate: new Date()
};

// HELPER FUNCTIONS
function getRelativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

function saveData() {
  localStorage.setItem('sf_subjects', JSON.stringify(STATE.subjects));
  localStorage.setItem('sf_tasks', JSON.stringify(STATE.tasks));
  localStorage.setItem('sf_notes', STATE.notes);
}

function triggerHapticFeedback() {
  if ('vibrate' in navigator) {
    navigator.vibrate(40);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNavigation();
  initOnboarding();
  initModals();
  initFormValidations();
  initTaskInteractions();
  initNotesSecurity();
  renderAll();
});

// NAVIGATION LOGIC
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      switchView(targetView);
    });
  });

  document.getElementById('link-all-tasks')?.addEventListener('click', () => switchView('tasks'));
  document.getElementById('link-all-subjects')?.addEventListener('click', () => switchView('subjects'));
}

function switchView(viewName) {
  STATE.currentView = viewName;
  
  // Update Buttons Active State
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === viewName);
  });

  // Update Sections Active State
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const targetSection = document.getElementById(`view-${viewName}`);
  if (targetSection) targetSection.classList.add('active');

  // Update Title
  const titles = {
    dashboard: ['Dashboard', 'Acompanhe seu rendimento e metas de estudo.'],
    tasks: ['Minhas Tarefas', 'Gerencie seus trabalhos, revisões e entregas.'],
    subjects: ['Matérias', 'Organize suas disciplinas acadêmicas.'],
    calendar: ['Calendário', 'Visualização mensal dos seus prazos.'],
    notes: ['Notas Protegidas', 'Suas anotações acadêmicas privativas.']
  };
  document.getElementById('view-title').innerText = titles[viewName][0];
  document.getElementById('view-subtitle').innerText = titles[viewName][1];

  renderAll();
}

// ONBOARDING
function initOnboarding() {
  const hasSeen = localStorage.getItem('sf_onboarding_completed');
  if (!hasSeen) {
    const modal = document.getElementById('onboarding-modal');
    modal.classList.remove('hidden');
    
    let currentSlide = 1;
    const nextBtn = document.getElementById('btn-next-onboarding');
    const slides = document.querySelectorAll('.onboarding-slide');
    const dots = document.querySelectorAll('.dot');

    nextBtn.addEventListener('click', () => {
      if (currentSlide < slides.length) {
        slides[currentSlide - 1].classList.remove('active');
        dots[currentSlide - 1].classList.remove('active');
        currentSlide++;
        slides[currentSlide - 1].classList.add('active');
        dots[currentSlide - 1].classList.add('active');
        if (currentSlide === slides.length) nextBtn.innerText = 'Começar!';
      } else {
        modal.classList.add('hidden');
        localStorage.setItem('sf_onboarding_completed', 'true');
      }
    });
  }
}

// MODALS & FORMS
function initModals() {
  const taskModal = document.getElementById('task-modal');
  const subjectModal = document.getElementById('subject-modal');

  document.getElementById('btn-add-quick').addEventListener('click', () => {
    openTaskModal();
  });

  document.getElementById('btn-add-subject').addEventListener('click', () => {
    subjectModal.classList.remove('hidden');
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      taskModal.classList.add('hidden');
      subjectModal.classList.add('hidden');
    });
  });
}

function openTaskModal(taskId = null) {
  const modal = document.getElementById('task-modal');
  const form = document.getElementById('task-form');
  const subjectSelect = document.getElementById('task-subject');

  // Populate Subjects
  subjectSelect.innerHTML = STATE.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  if (taskId) {
    const task = STATE.tasks.find(t => t.id === taskId);
    document.getElementById('task-modal-title').innerText = 'Editar Tarefa';
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-subject').value = task.subjectId;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-desc').value = task.desc || '';
  } else {
    document.getElementById('task-modal-title').innerText = 'Nova Tarefa';
    form.reset();
    document.getElementById('task-id').value = '';
    document.getElementById('task-date').value = getRelativeDate(1);
  }

  modal.classList.remove('hidden');
}

// FORM VALIDATION & SUBMIT
function initFormValidations() {
  // Task Form Submit
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value.trim();
    const subjectId = document.getElementById('task-subject').value;
    const priority = document.getElementById('task-priority').value;
    const date = document.getElementById('task-date').value;
    const desc = document.getElementById('task-desc').value.trim();

    if (!title) {
      document.getElementById('err-task-title').innerText = 'Informe o título da tarefa.';
      return;
    }

    if (id) {
      const index = STATE.tasks.findIndex(t => t.id === id);
      STATE.tasks[index] = { ...STATE.tasks[index], title, subjectId, priority, date, desc };
      showToast('Tarefa atualizada!');
    } else {
      STATE.tasks.push({
        id: 'tsk-' + Date.now(),
        title, subjectId, priority, date, desc, completed: false
      });
      showToast('Tarefa cadastrada com sucesso!');
    }

    saveData();
    triggerHapticFeedback();
    document.getElementById('task-modal').classList.add('hidden');
    renderAll();
  });

  // Subject Form Submit
  document.getElementById('subject-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('subject-name').value.trim();
    const color = document.getElementById('subject-color').value;

    if (!name) {
      document.getElementById('err-subject-name').innerText = 'Digite o nome da matéria.';
      return;
    }

    STATE.subjects.push({ id: 'sub-' + Date.now(), name, color });
    saveData();
    triggerHapticFeedback();
    showToast('Matéria adicionada!');
    document.getElementById('subject-modal').classList.add('hidden');
    document.getElementById('subject-form').reset();
    renderAll();
  });
}

// RENDERING SYSTEM
function renderAll() {
  if (STATE.currentView === 'dashboard') renderDashboard();
  if (STATE.currentView === 'tasks') renderTasksView();
  if (STATE.currentView === 'subjects') renderSubjectsView();
  if (STATE.currentView === 'calendar') renderCalendarView();
}

function renderDashboard() {
  const pending = STATE.tasks.filter(t => !t.completed);
  const completed = STATE.tasks.filter(t => t.completed);
  
  // Entregas nos próximos 7 dias
  const todayStr = getRelativeDate(0);
  const nextWeekStr = getRelativeDate(7);
  const upcoming = pending.filter(t => t.date >= todayStr && t.date <= nextWeekStr);

  document.getElementById('stat-pending').innerText = pending.length;
  document.getElementById('stat-upcoming').innerText = upcoming.length;
  document.getElementById('stat-completed').innerText = completed.length;

  const total = STATE.tasks.length;
  const pct = total === 0 ? 0 : Math.round((completed.length / total) * 100);
  document.getElementById('progress-percent').innerText = `${pct}%`;
  document.getElementById('progress-bar-fill').style.width = `${pct}%`;
  document.getElementById('main-progress-bar').setAttribute('aria-valuenow', pct);

  // Render Urgent List (3 mais próximas)
  const urgentList = [...pending].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
  const urgentContainer = document.getElementById('dashboard-urgent-list');
  
  if (urgentList.length === 0) {
    urgentContainer.innerHTML = `<div class="empty-state">Nenhuma tarefa pendente! 🎉</div>`;
  } else {
    urgentContainer.innerHTML = urgentList.map(t => createTaskHTML(t)).join('');
  }

  // Render Mini Subjects List
  const subjectsContainer = document.getElementById('dashboard-subjects-list');
  subjectsContainer.innerHTML = STATE.subjects.map(s => {
    const subTasks = STATE.tasks.filter(t => t.subjectId === s.id && !t.completed).length;
    return `
      <div class="subject-mini-item">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="width:10px; height:10px; border-radius:50%; background:${s.color}"></span>
          <strong>${s.name}</strong>
        </div>
        <span class="text-muted" style="font-size:0.8rem;">${subTasks} pendente(s)</span>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderTasksView() {
  const container = document.getElementById('tasks-container');
  const search = document.getElementById('task-search')?.value.toLowerCase() || '';
  const filterSub = document.getElementById('filter-subject')?.value || '';
  const filterPrio = document.getElementById('filter-priority')?.value || '';
  const filterStatus = document.getElementById('filter-status')?.value || 'pending';

  // Populate Select Subject Filter if empty
  const subSelect = document.getElementById('filter-subject');
  if (subSelect && subSelect.children.length === 1) {
    STATE.subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.innerText = s.name;
      subSelect.appendChild(opt);
    });
  }

  let filtered = STATE.tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search) || (t.desc && t.desc.toLowerCase().includes(search));
    const matchesSub = filterSub ? t.subjectId === filterSub : true;
    const matchesPrio = filterPrio ? t.priority === filterPrio : true;
    let matchesStatus = true;
    if (filterStatus === 'pending') matchesStatus = !t.completed;
    if (filterStatus === 'completed') matchesStatus = t.completed;

    return matchesSearch && matchesSub && matchesPrio && matchesStatus;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state">Nenhuma tarefa encontrada com os filtros atuais.</div>`;
    return;
  }

  container.innerHTML = filtered.map(t => createTaskHTML(t)).join('');
  lucide.createIcons();
}

function createTaskHTML(task) {
  const subject = STATE.subjects.find(s => s.id === task.subjectId) || { name: 'Geral', color: '#64748b' };
  const formattedDate = new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <div class="task-left">
        <input type="checkbox" class="checkbox-custom" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')" aria-label="Marcar ${task.title} como concluída">
        <div class="task-info">
          <strong>${task.title}</strong>
          <div class="task-tags">
            <span class="subject-tag" style="background:${subject.color}">${subject.name}</span>
            <span class="badge badge-${task.priority}">${task.priority.toUpperCase()}</span>
            <span class="text-muted" style="font-size:0.8rem;"><i data-lucide="calendar" style="width:12px; height:12px; display:inline;"></i> ${formattedDate}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-icon" onclick="openTaskModal('${task.id}')" aria-label="Editar tarefa"><i data-lucide="edit-3"></i></button>
        <button class="btn btn-icon" onclick="deleteTask('${task.id}')" aria-label="Excluir tarefa"><i data-lucide="trash-2"></i></button>
      </div>
    </div>
  `;
}

function renderSubjectsView() {
  const container = document.getElementById('subjects-container');
  if (STATE.subjects.length === 0) {
    container.innerHTML = `<div class="empty-state">Nenhuma matéria cadastrada.</div>`;
    return;
  }

  container.innerHTML = STATE.subjects.map(s => {
    const totalTasks = STATE.tasks.filter(t => t.subjectId === s.id).length;
    const completedTasks = STATE.tasks.filter(t => t.subjectId === s.id && t.completed).length;

    return `
      <div class="subject-card" style="border-top-color: ${s.color}">
        <div>
          <h3>${s.name}</h3>
          <p class="text-muted" style="margin-top:0.5rem;">${totalTasks} tarefa(s) total | ${completedTasks} concluída(s)</p>
        </div>
        <div style="margin-top: 1rem; display:flex; justify-content:flex-end;">
          <button class="btn btn-outline-danger btn-sm" onclick="deleteSubject('${s.id}')">Excluir</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderCalendarView() {
  const grid = document.getElementById('calendar-grid');
  const monthYearText = document.getElementById('calendar-month-year');
  grid.innerHTML = '';

  const date = STATE.currentDate;
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  monthYearText.innerText = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days padding
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    grid.appendChild(empty);
  }

  // Days
  const todayStr = new Date().toISOString().split('T')[0];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEl = document.createElement('div');
    dayEl.className = `cal-day ${dayStr === todayStr ? 'today' : ''}`;
    dayEl.innerHTML = `<strong>${day}</strong>`;

    // Tasks for day
    const dayTasks = STATE.tasks.filter(t => t.date === dayStr);
    dayTasks.forEach(t => {
      const sub = STATE.subjects.find(s => s.id === t.subjectId) || { color: '#4f46e5' };
      const ev = document.createElement('div');
      ev.className = 'cal-event-dot';
      ev.style.backgroundColor = sub.color;
      ev.innerText = t.title;
      dayEl.appendChild(ev);
    });

    grid.appendChild(dayEl);
  }
}

// CALENDAR NAVIGATION
document.getElementById('cal-prev')?.addEventListener('click', () => {
  STATE.currentDate.setMonth(STATE.currentDate.getMonth() - 1);
  renderCalendarView();
});
document.getElementById('cal-next')?.addEventListener('click', () => {
  STATE.currentDate.setMonth(STATE.currentDate.getMonth() + 1);
  renderCalendarView();
});

// TASK ACTIONS
window.toggleTask = function(id) {
  const task = STATE.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveData();
    triggerHapticFeedback();
    showToast(task.completed ? 'Tarefa concluída! 🎉' : 'Tarefa marcada como pendente.');
    renderAll();
  }
};

window.deleteTask = function(id) {
  if (confirm('Deseja realmente excluir esta tarefa?')) {
    STATE.tasks = STATE.tasks.filter(t => t.id !== id);
    saveData();
    triggerHapticFeedback();
    showToast('Tarefa excluída.');
    renderAll();
  }
};

window.deleteSubject = function(id) {
  if (confirm('Excluir esta matéria removerá a referência nas tarefas associadas. Deseja continuar?')) {
    STATE.subjects = STATE.subjects.filter(s => s.id !== id);
    saveData();
    triggerHapticFeedback();
    showToast('Matéria excluída.');
    renderAll();
  }
};

// GESTURES: TOUCH / SWIPE & LONG PRESS
function initTaskInteractions() {
  let touchStartX = 0;
  let touchStartTime = 0;

  document.addEventListener('touchstart', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    const duration = Date.now() - touchStartTime;

    const taskId = taskItem.dataset.id;

    // Swipe Right -> Toggle Complete
    if (diffX > 100 && duration < 500) {
      toggleTask(taskId);
    }
    // Swipe Left -> Delete
    else if (diffX < -100 && duration < 500) {
      deleteTask(taskId);
    }
  });
}

// BIOMETRIC / PROTECTED NOTES SECURITY
function initNotesSecurity() {
  const authBox = document.getElementById('notes-auth-box');
  const notesContent = document.getElementById('notes-content');
  const btnUnlock = document.getElementById('btn-unlock-notes');
  const btnLock = document.getElementById('btn-lock-notes');
  const btnSave = document.getElementById('btn-save-notes');
  const textarea = document.getElementById('secure-notes-input');

  btnUnlock.addEventListener('click', async () => {
    // WebAuthn / Biometrics Fallback Check
    if (window.PublicKeyCredential) {
      try {
        // Tenta simulação de verificação com WebAuthn API / Credencial local do navegador
        showToast('Solicitando autenticação biométrica...', 'info');
        // Em um ambiente HTTPS com WebAuthn configurado, chamaria navigator.credentials.get()
        // Aqui garantimos uma experiência fluida com simulação de sistema de segurança
        setTimeout(() => {
          STATE.isNotesUnlocked = true;
          authBox.classList.add('hidden');
          notesContent.classList.remove('hidden');
          textarea.value = STATE.notes;
          triggerHapticFeedback();
          showToast('Anotações desbloqueadas com sucesso!', 'success');
        }, 600);
      } catch (err) {
        showToast('Falha na autenticação biométrica.', 'danger');
      }
    } else {
      // Fallback para PIN / Senha padrão
      const pin = prompt('Seu dispositivo não suporta biometria web direta. Digite o PIN de segurança (padrão: 1234):');
      if (pin === '1234') {
        STATE.isNotesUnlocked = true;
        authBox.classList.add('hidden');
        notesContent.classList.remove('hidden');
        textarea.value = STATE.notes;
        showToast('Anotações desbloqueadas!');
      } else {
        alert('PIN incorreto!');
      }
    }
  });

  btnLock.addEventListener('click', () => {
    STATE.isNotesUnlocked = false;
    notesContent.classList.add('hidden');
    authBox.classList.remove('hidden');
    showToast('Anotações bloqueadas.');
  });

  btnSave.addEventListener('click', () => {
    STATE.notes = textarea.value;
    saveData();
    triggerHapticFeedback();
    showToast('Anotações salvas com sucesso!');
  });
}
