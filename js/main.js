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
  initMapSwitcher();
  initVideoSound();
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

    const nameInput = document.getElementById('client-name');
    const phoneInput = document.getElementById('client-phone');
    const procedureSelect = document.getElementById('client-procedure');
    const periodSelect = document.getElementById('client-period');
    const messageInput = document.getElementById('client-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const procedure = procedureSelect ? procedureSelect.value : 'Avaliação Geral';
    const period = periodSelect ? periodSelect.value : 'Sem preferência';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !phone) {
      alert('Por favor, informe seu nome e telefone/WhatsApp.');
      return;
    }

    // Monta o texto formatado para o WhatsApp com quebras de linha limpas
    const lines = [
      'Olá! Gostaria de agendar uma consulta na *Guarnieri Odontologia e Estética*.',
      '',
      `👤 *Nome:* ${name}`,
      `📱 *Telefone:* ${phone}`,
      `🦷 *Tratamento:* ${procedure}`,
      `⏰ *Período:* ${period}`
    ];

    if (message) {
      lines.push(`💬 *Mensagem:* ${message}`);
    }

    lines.push('', 'Enviado pelo site oficial.');

    const text = lines.join('\n');
    const encodedText = encodeURIComponent(text);
    
    // api.whatsapp.com garante compatibilidade total no celular e desktop (WhatsApp Web)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5515996019128&text=${encodedText}`;

    // Dispara a abertura através de elemento link nativo (evita bloqueio de pop-up do navegador)
    const tempLink = document.createElement('a');
    tempLink.href = whatsappUrl;
    tempLink.target = '_blank';
    tempLink.rel = 'noopener noreferrer';
    document.body.appendChild(tempLink);
    tempLink.click();
    setTimeout(() => {
      tempLink.remove();
    }, 100);

    // Feedback visual imediato e botão de contingência se o navegador bloquear
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `✓ Abrindo WhatsApp...`;
      submitBtn.style.backgroundColor = '#25D366';
      submitBtn.style.color = '#FFFFFF';

      // Mostra mensagem de apoio com link caso o pop-up tenha sido bloqueado
      let feedbackEl = document.getElementById('whatsapp-feedback-msg');
      if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'whatsapp-feedback-msg';
        feedbackEl.style.marginTop = '1rem';
        feedbackEl.style.padding = '0.85rem';
        feedbackEl.style.borderRadius = '8px';
        feedbackEl.style.backgroundColor = 'rgba(37, 211, 102, 0.12)';
        feedbackEl.style.border = '1px solid #25D366';
        feedbackEl.style.fontSize = '0.875rem';
        feedbackEl.style.textAlign = 'center';
        form.appendChild(feedbackEl);
      }

      feedbackEl.innerHTML = `Mensagem gerada! Se o WhatsApp não abriu sozinho, <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="color: #128c7e; font-weight: 700; text-decoration: underline;">clique aqui para enviar</a>.`;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
      }, 4000);
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

/**
 * 8. Alternador entre Mapa Convencional e Tour Virtual 360° (VR)
 */
function initMapSwitcher() {
  const btnMap = document.getElementById('btn-show-map');
  const btnVr = document.getElementById('btn-show-vr');
  const iframe = document.getElementById('maps-iframe');
  const vrOverlay = document.getElementById('vr-overlay');

  if (!btnMap || !btnVr || !iframe) return;

  btnMap.addEventListener('click', () => {
    btnMap.classList.add('active');
    btnVr.classList.remove('active');
    iframe.style.display = '';
    if (vrOverlay) vrOverlay.classList.remove('visible');
  });

  btnVr.addEventListener('click', () => {
    btnVr.classList.add('active');
    btnMap.classList.remove('active');
    iframe.style.display = 'none';
    if (vrOverlay) vrOverlay.classList.add('visible');
  });
}


/**
 * 9. Controle de Som do Vídeo Hero
 * Alterna entre mudo e com áudio no botão de som do vídeo da hero section
 */
function initVideoSound() {
  const btn = document.getElementById('btn-toggle-sound');
  const video = document.getElementById('hero-video');
  const iconMuted = document.getElementById('icon-sound-muted');
  const iconOn = document.getElementById('icon-sound-on');
  const soundText = document.getElementById('sound-btn-text');

  if (!btn || !video) return;

  btn.addEventListener('click', () => {
    video.muted = !video.muted;

    if (video.muted) {
      // Voltou ao mudo
      if (iconMuted) iconMuted.style.display = '';
      if (iconOn) iconOn.style.display = 'none';
      if (soundText) soundText.textContent = 'Ativar Som';
      btn.setAttribute('aria-label', 'Ativar som do vídeo');
    } else {
      // Som ativado
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconOn) iconOn.style.display = '';
      if (soundText) soundText.textContent = 'Silenciar';
      btn.setAttribute('aria-label', 'Silenciar vídeo');

      // Garante que o vídeo está rodando ao ativar o som
      if (video.paused) video.play().catch(() => {});
    }
  });
}
