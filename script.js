// عدد العناصر المراد إظهارها أولاً في كل قسم
const visibleItems = {
  skills: 4,
  projects: 4,
  courses: 4,
  certificates: 4
};

// جلب البيانات من ملف JSON
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    /* ========== ABOUT ========== */
    if (data.aboutDescription) {
      // تحديث النص الوصفي
      const aboutDesc = document.getElementById("aboutDescription");
      if (aboutDesc) {
        aboutDesc.textContent = data.aboutDescription;
      }
    }

    if (data.aboutCards && data.aboutCards.length > 0) {
      const aboutContainer = document.getElementById("aboutCardsContainer");
      if (aboutContainer) {
        // إزالة أي محتوى ثابت موجود
        aboutContainer.innerHTML = '';

        // إنشاء الكروت ديناميكياً
        data.aboutCards.forEach((aboutCard, index) => {
          const card = document.createElement("div");

          // استخدام colorClass من البيانات أو إنشاء واحد تلقائي
          const colorClass = aboutCard.colorClass || `color-${(index % 8) + 1}`;
          card.className = `uniform-card ${colorClass}`;

          card.innerHTML = `
        <div class="card-icon">
          <i class="fas ${aboutCard.icon || 'fa-info-circle'}"></i>
        </div>
        <h3>${aboutCard.title || 'Title'}</h3>
        <p>${aboutCard.description || 'Description here'}</p>
        ${aboutCard.link ? `
          <a href="${aboutCard.link}" target="_blank" class="contact-link" style="margin-top: 10px;">
            Learn More <i class="fas fa-external-link-alt"></i>
          </a>
        ` : ''}
      `;

          aboutContainer.appendChild(card);
        });
      }
    }
    /* ========== SKILLS ========== */
    const skillsGrid = document.getElementById("skillsGrid");
    const allSkillsCards = [];
    const skillColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];

    data.skills.forEach((skill, index) => {
      if (!skill.title) return;

      const card = document.createElement("div");
      const colorClass = skillColors[index % skillColors.length] || 'color-1';
      card.className = `uniform-card ${colorClass} ${index < visibleItems.skills ? 'visible' : 'hidden'}`;

      card.innerHTML = `
            <div class="card-icon">
              <i class="fas ${skill.icon || 'fa-code'}"></i>
            </div>
            <h3>${skill.title}</h3>
            <ul>
              ${skill.items.map(item => `<li>${item}</li>`).join("")}
            </ul>
          `;
      skillsGrid.appendChild(card);
      allSkillsCards.push(card);
    });

    /* ========== PROJECTS ========== */
    const projectsGrid = document.getElementById("projectsGrid");
    const allProjectsCards = [];
    const projectColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];

    data.projects.forEach((project, index) => {
      const card = document.createElement("div");
      const colorClass = projectColors[index % projectColors.length] || 'color-1';

      // تحديد ما إذا كان المشروع غير مكتمل
      const isInProgress = project.status === "In Progress" || project.progress < 100;
      const progress = project.progress || 50;

      card.className = `uniform-card project-card ${colorClass} ${isInProgress ? 'loading-shimmer' : ''} ${index < visibleItems.projects ? 'visible' : 'hidden'}`;

      // صورة افتراضية إذا لم توجد صورة
      const projectImage = project.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

      card.innerHTML = `
            <!-- علامة التحميل للمشاريع غير المكتملة -->
            ${isInProgress ? `
              <div class="loading-badge project">
                <i class="fas fa-sync-alt"></i>
                In Progress
              </div>
            ` : ''}
            
            <div class="project-image-container">
              <img src="${projectImage}" alt="${project.title}" class="project-image">
              <div class="project-overlay">
                <span>${isInProgress ? 'Under Development' : 'View Details'}</span>
              </div>
            </div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
              ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join("")}
            </div>
            
            <!-- تأثير التحميل للمشاريع غير المكتملة -->
            ${isInProgress ? `
              <div class="loading-animation" style="margin-top: 15px;">
                <div class="spinner pulse"></div>
                <span class="loading-text">Progress: ${progress}%</span>
              </div>
              
              <!-- شريط التقدم -->
              <div style="width: 100%; margin-top: 10px;">
                <div class="progress-bar-small">
                  <div class="progress-fill-small" style="width: ${progress}%"></div>
                </div>
                <div class="expected-info" style="margin-top: 5px;">
                  <i class="fas fa-hourglass-half"></i>
                  <span>Expected: ${project.expectedDate || 'Under Development'}</span>
                </div>
              </div>
            ` : `
              <a href="${project.link || '#'}" target="_blank" class="contact-link">
                View Project <i class="fas fa-external-link-alt"></i>
              </a>
            `}
          `;
      projectsGrid.appendChild(card);
      allProjectsCards.push(card);
    });

    /* ========== COURSES ========== */
    const coursesGrid = document.getElementById("coursesGrid");
    const allCoursesCards = [];
    const courseColors = ['color-1', 'color-2', 'color-3', 'color-4'];

    data.courses.forEach((course, index) => {
      const card = document.createElement("div");
      const colorClass = courseColors[index % courseColors.length] || 'color-1';

      const isInProgress = course.status === "In Progress" || course.progress < 100;
      const progress = course.progress || (isInProgress ? "50" : "100");
      const expectedDate = course.expectedDate || "قيد الإنجاز";

      card.className = `uniform-card course-card ${colorClass} ${isInProgress ? 'loading-shimmer' : ''} ${index < visibleItems.courses ? 'visible' : 'hidden'}`;

      // صور افتراضية للكورسات
      const courseDefaultImages = [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ];

      // استخدام صورة الكورس من البيانات أو صورة افتراضية
      const courseImage = course.image || courseDefaultImages[index % courseDefaultImages.length];

      card.innerHTML = `
    <!-- شارة الحالة -->
    <span class="certificate-status ${isInProgress ? 'status-inprogress' : 'status-completed'}">
      ${isInProgress ? 'In Progress' : 'Completed'}
    </span>
    
    <!-- علامة التحميل للكورسات غير المكتملة -->
    ${isInProgress ? `
      <div class="loading-badge course">
        <i class="fas fa-book-open"></i>
        Currently Learning
      </div>
    ` : ''}
    
    <!-- صورة الكورس -->
    <div class="course-image-container">
      <img src="${courseImage}" alt="${course.title}" class="course-image">
      <div class="course-overlay">
        <span><i class="fas ${isInProgress ? 'fa-sync-alt' : 'fa-book-open'}"></i> ${isInProgress ? 'In Progress' : 'View Course'}</span>
      </div>
    </div>
    
    <!-- معلومات الكورس -->
    <h3>${course.title}</h3>
    <p><strong>Platform:</strong> ${course.platform}</p>
    
    <!-- مواضيع الكورس -->
    <ul style="margin-top: 10px; max-height: 80px; overflow-y: auto;">
      ${course.topics.slice(0, 3).map(topic => `<li>${topic}</li>`).join("")}
      ${course.topics.length > 3 ? '<li>... and more</li>' : ''}
    </ul>
    
    <!-- تأثير التحميل للكورسات غير المكتملة -->
    ${isInProgress ? `
      <div class="loading-animation" style="margin-top: 15px;">
        <div class="spinner pulse"></div>
        <span class="loading-text">Progress: ${progress}%</span>
      </div>
      
      <!-- شريط التقدم -->
      <div style="width: 100%; margin-top: 10px;">
        <div class="progress-bar-small">
          <div class="progress-fill-small" style="width: ${progress}%"></div>
        </div>
        <div class="expected-info" style="margin-top: 5px;">
          <i class="fas fa-hourglass-half"></i>
          <span>Expected: ${expectedDate}</span>
        </div>
      </div>
    ` : `
      <!-- رابط الكورس المكتمل -->
      ${course.link ? `
        <a href="${course.link}" target="_blank" class="contact-link" style="margin-top: 15px;">
          <i class="fas fa-external-link-alt"></i> View Certificate
        </a>
      ` : ''}
    `}
  `;

      // إضافة حدث النقر على صورة الكورس
      const courseImageContainer = card.querySelector('.course-image-container');
      if (courseImageContainer && course.link) {
        courseImageContainer.addEventListener('click', function () {
          window.open(course.link, '_blank');
        });
      }

      coursesGrid.appendChild(card);
      allCoursesCards.push(card);
    });

    /* ========== CERTIFICATES ========== */
    const certGrid = document.getElementById("certificatesGrid");
    const allCertificatesCards = [];
    const certificateColors = ['color-1', 'color-2', 'color-3', 'color-4'];

    // صور افتراضية للشهادات
    const certificateDefaultImages = [
      "https://images.unsplash.com/photo-1550592704-6c76defa9985?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];

    data.certificates.forEach((cert, index) => {
      const card = document.createElement("div");
      const colorClass = certificateColors[index % certificateColors.length] || 'color-1';

      const isInProgress = cert.status === "In Progress";
      const progress = cert.progress || "50";
      const expectedDate = cert.expectedDate || "قيد الإنجاز";

      card.className = `uniform-card certificate-card ${colorClass} ${isInProgress ? 'loading-shimmer' : ''} ${index < visibleItems.certificates ? 'visible' : 'hidden'}`;

      // استخدام صورة الشهادة أو صورة افتراضية
      let certImage = cert.image;
      if (!certImage) {
        if (isInProgress) {
          certImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        } else {
          certImage = certificateDefaultImages[index % certificateDefaultImages.length];
        }
      }

      card.innerHTML = `
    <!-- علامة التحميل للشهادات غير المكتملة -->
    ${isInProgress ? `
      <div class="loading-badge course">
        <i class="fas fa-sync-alt"></i>
        In Progress
      </div>
    ` : ''}
    
    <!-- صورة الشهادة -->
    <div class="certificate-image-container">
      <img src="${certImage}" alt="${cert.title}" class="certificate-main-image">
      <div class="certificate-overlay">
        ${isInProgress ? `
          <span class="progress-badge">
            <i class="fas fa-sync-alt fa-spin"></i>
            جاري العمل: ${progress}%
          </span>
        ` : `
          <span><i class="fas fa-search-plus"></i> عرض الشهادة</span>
        `}
      </div>
      
      <!-- حالة الشهادة -->
      <div class="certificate-status-badge ${isInProgress ? 'in-progress' : 'completed'}">
        <i class="fas ${isInProgress ? 'fa-clock' : 'fa-check-circle'}"></i>
        ${isInProgress ? 'قيد التقدم' : 'مكتملة'}
      </div>
    </div>
    
    <!-- معلومات الشهادة -->
    <div class="certificate-content">
      <h3>${cert.title}</h3>
      <p class="certificate-provider">
        <i class="fas fa-building"></i> ${cert.provider}
      </p>
      <p class="certificate-year">
        <i class="fas fa-calendar-alt"></i> ${cert.year}
      </p>
      
      ${cert.credentialId ? `
        <p class="certificate-id">
          <i class="fas fa-id-card"></i> رقم المعرف: ${cert.credentialId}
        </p>
      ` : ''}
      
      <!-- تفاصيل إضافية -->
      <div class="certificate-details">
        ${isInProgress ? `
          <div class="progress-details">
            <div class="progress-info">
              <div class="progress-text">
                <i class="fas fa-chart-line"></i>
                <span>التقدم: <strong>${progress}%</strong></span>
              </div>
              <div class="progress-bar-small">
                <div class="progress-fill-small" style="width: ${progress}%"></div>
              </div>
            </div>
            <div class="expected-info">
              <i class="fas fa-hourglass-half"></i>
              <span>متوقع: ${expectedDate}</span>
            </div>
          </div>
        ` : `
          <div class="certificate-tags">
            <span class="cert-tag">
              <i class="fas fa-award"></i> شهادة معتمدة
            </span>
            <span class="cert-tag">
              <i class="fas fa-check"></i> ${cert.year}
            </span>
          </div>
        `}
      </div>
    </div>
  `;

      // إضافة حدث النقر على صورة الشهادة
      const certImageContainer = card.querySelector('.certificate-image-container');
      if (certImageContainer) {
        certImageContainer.addEventListener('click', function () {
          if (cert.image) {
            window.open(cert.image, '_blank');
          } else if (cert.link) {
            window.open(cert.link, '_blank');
          }
        });
      }

      certGrid.appendChild(card);
      allCertificatesCards.push(card);
    });

    /* ========== CONTACT ========== */
    const contact = data.contact;
    const contactDiv = document.getElementById("contactInfo");
    const contactColors = ['color-1', 'color-2', 'color-3', 'color-4'];

    // إنشاء كروت الاتصال بنفس الشكل
    contactDiv.innerHTML = `
          <div class="uniform-card ${contactColors[0]}">
            <div class="card-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <h3>Email</h3>
            <p>${contact.email}</p>
            <a href="mailto:${contact.email}" class="contact-link">Send Email</a>
          </div>
          
          <div class="uniform-card ${contactColors[1]}">
            <div class="card-icon">
              <i class="fas fa-phone"></i>
            </div>
            <h3>Phone</h3>
            <p>${contact.phone}</p>
            <a href="tel:${contact.phone.replace(/\s/g, '')}" class="contact-link">Call Now</a>
          </div>
          
          <div class="uniform-card ${contactColors[2]}">
            <div class="card-icon">
              <i class="fab fa-linkedin"></i>
            </div>
            <h3>LinkedIn</h3>
            <p>Professional Profile</p>
            <a href="${contact.linkedin}" target="_blank" class="contact-link">Visit Profile</a>
          </div>
          
          <div class="uniform-card ${contactColors[3]}">
            <div class="card-icon">
              <i class="fab fa-github"></i>
            </div>
            <h3>GitHub</h3>
            <p>Code Repository</p>
            <a href="${contact.github}" target="_blank" class="contact-link">Visit Profile</a>
          </div>
        `;

    /* ========== إدارة أزرار Show/Hide ========== */
    const showSkillsBtn = document.getElementById("showSkillsBtn");
    const showProjectsBtn = document.getElementById("showProjectsBtn");
    const showCoursesBtn = document.getElementById("showCoursesBtn");
    const showCertificatesBtn = document.getElementById("showCertificatesBtn");

    // حالة التوسيع لكل قسم
    const expandedState = {
      skills: false,
      projects: false,
      courses: false,
      certificates: false
    };

    // دالة عامة لتغيير حالة القسم
    function toggleSection(section, cards, button) {
      expandedState[section] = !expandedState[section];

      // إظهار/إخفاء الكروت المخفية
      cards.forEach((card, index) => {
        if (index >= visibleItems[section]) {
          if (expandedState[section]) {
            card.classList.remove("hidden");
            card.classList.add("visible");
          } else {
            card.classList.remove("visible");
            card.classList.add("hidden");
          }
        }
      });

      // تغيير نص الزر والأيقونة
      const icon = button.querySelector("i");
      if (expandedState[section]) {
        icon.className = "fas fa-chevron-up";
        button.innerHTML = `<i class="fas fa-chevron-up"></i> Show Less`;
      } else {
        icon.className = "fas fa-chevron-down";
        button.innerHTML = `<i class="fas fa-chevron-down"></i> Show More ${section.charAt(0).toUpperCase() + section.slice(1)}`;
      }
    }

    // إضافة أحداث النقر للأزرار
    showSkillsBtn.addEventListener("click", () =>
      toggleSection("skills", allSkillsCards, showSkillsBtn));

    showProjectsBtn.addEventListener("click", () =>
      toggleSection("projects", allProjectsCards, showProjectsBtn));

    showCoursesBtn.addEventListener("click", () =>
      toggleSection("courses", allCoursesCards, showCoursesBtn));

    showCertificatesBtn.addEventListener("click", () =>
      toggleSection("certificates", allCertificatesCards, showCertificatesBtn));

    // إخفاء الزر إذا لم يكن هناك عناصر مخفية
    if (allSkillsCards.length <= visibleItems.skills) showSkillsBtn.style.display = "none";
    if (allProjectsCards.length <= visibleItems.projects) showProjectsBtn.style.display = "none";
    if (allCoursesCards.length <= visibleItems.courses) showCoursesBtn.style.display = "none";
    if (allCertificatesCards.length <= visibleItems.certificates) showCertificatesBtn.style.display = "none";

  })
  .catch(error => {
    console.error('Error loading data:', error);
    document.getElementById("skillsGrid").innerHTML = "<p>Error loading data. Please check the data.json file.</p>";
  });

/* ========== باقي كود JavaScript ========== */
const canvas = document.getElementById("network-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let nodes = [];
  const numNodes = 70;
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach((node, i) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      let hue = (Date.now() / 20 + i * 10) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fill();
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);
faders.forEach(fader => { appearOnScroll.observe(fader); });

const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
const observerOptions = { threshold: 0.6 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
      if (activeLink) { activeLink.classList.add('active'); }
    }
  });
}, observerOptions);
sections.forEach(section => { sectionObserver.observe(section); });

const hamburger = document.querySelector('.hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}

const typingElement = document.getElementById('home-subtitle');
if (typingElement) {
  const text = typingElement.textContent;
  typingElement.textContent = '';
  setTimeout(() => {
    typingElement.classList.add('typing-effect');
    typingElement.textContent = text;
  }, 1000);
}