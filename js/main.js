/**
 * GUARNIERI ODONTOLOGIA E ESTÉTICA
 * Interatividade, status de funcionamento em tempo real e agendamento inteligente via WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  initClinicStatus();
  initHeaderScroll();
  initMobileNav();
  initServicesFilter();
  initFaqAccordion();
  initBookingForm();
  initSmoothScroll();
});

/**
 * 1. Verifica se a clínica está aberta no horário atual
 * Seg-Sex: 08:00 às 18:30 | Sáb: Hora marcada | Dom: Fechado
 */
function initClinicStatus() {
  const statusElement = document.getElementById('clinic-status-text');
  const dotElement = document.getElementById('clinic-status-dot');
  if (!statusElement) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentDecHour = hour + minute / 60;

  let isOpen = false;
  let statusText = '';

  if (day >= 1 && day <= 5) {
    // Segunda a Sexta: 08:00 às 18:30
    if (currentDecHour >= 8.0 && currentDecHour < 18.5) {
      isOpen = true;
      statusText = 'Aberto agora até às 18h30';
    } else if (currentDecHour < 8.0) {
      statusText = 'Abre hoje às 08h00';
    } else {
      statusText = 'Fechado agora • Atendimento online via WhatsApp';
    }
  } else if (day === 6) {
    // Sábado
    statusText = 'Atendimento exclusivo com agendamento prévio';
    isOpen = true;
  } else {
    // Domingo
    statusText = 'Fechado hoje • Agendamento online via WhatsApp';
  }

  statusElement.textContent = statusText;
  if (dotElement) {
    dotElement.style.backgroundColor = isOpen ? '#5bb381' : '#b6a58d';
    dotElement.style.boxShadow = isOpen 
      ? '0 0 0 2px rgba(91, 179, 129, 0.35)' 
      : '0 0 0 2px rgba(182, 165, 141, 0.25)';
  }
}

/**
 * 2. Efeito de scroll no cabeçalho
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 3. Menu Responsivo Mobile
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('primary-nav');
  if (!toggleBtn || !navMenu) return;

  const links = navMenu.querySelectorAll('.nav-link, .btn');

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/**
 * 4. Filtro interativo de serviços e procedimentos
 */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * 5. Acordeão de Dúvidas Frequentes (FAQ)
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq-item');
      const isOpen = parentItem.classList.contains('active');

      // Fecha todos os outros itens para um comportamento minimalista
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        parentItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 6. Formulário de Pré-Agendamento Inteligente com integração WhatsApp
 */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name')?.value.trim() || '';
    const phone = document.getElementById('client-phone')?.value.trim() || '';
    const procedure = document.getElementById('client-procedure')?.value || 'Não informado';
    const period = document.getElementById('client-period')?.value || 'Sem preferência';
    const message = document.getElementById('client-message')?.value.trim() || '';

    if (!name || !phone) {
      alert('Por favor, preencha seu nome e telefone para contato.');
      return;
    }

    // Monta a mensagem personalizada e educada para a recepção da Guarnieri Odontologia
    let text = `Olá! Gostaria de agendar uma consulta na *Guarnieri Odontologia e Estética*.\n\n`;
    text += `👤 *Nome:* ${name}\n`;
    text += `📱 *Telefone:* ${phone}\n`;
    text += `🦷 *Tratamento de Interesse:* ${procedure}\n`;
    text += `⏰ *Preferência de Horário:* ${period}\n`;

    if (message) {
      text += `💬 *Observação:* ${message}\n`;
    }

    text += `\nEnviado através do website oficial.`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5515996019128?text=${encodedText}`;

    // Abre o WhatsApp em nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Mensagem amigável de retorno
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `✓ Abrindo WhatsApp...`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    }
  });
}

/**
 * 7. Smooth Scroll com offset de compensação para cabeçalho fixo
 */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  const header = document.querySelector('.site-header');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
