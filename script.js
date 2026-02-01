
// رسم خلفية الشبكة المتحركة
const canvas = document.getElementById("network-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // إنشاء العقد العشوائية
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

  // عدد العناصر المراد إظهارها أولاً في كل قسم
  const visibleItems = {
    skills: 4,
    projects: 4,
    courses: 4,
    certificates: 4
  };

  // دالة لتقصير النص الطويل
  function truncateText(text, maxLength = 80) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  // جلب البيانات من ملف JSON
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      /* ========== ABOUT ========== */
      if (data.aboutDescription) {
        const aboutDesc = document.getElementById("aboutDescription");
        if (aboutDesc) {
          aboutDesc.textContent = data.aboutDescription;
        }
      }

      // إنشاء كروت الـ About ديناميكياً
      if (data.aboutCards && data.aboutCards.length > 0) {
        const aboutContainer = document.getElementById("aboutCardsContainer");
        if (aboutContainer) {
          aboutContainer.innerHTML = '';

          data.aboutCards.forEach((aboutCard, index) => {
            const card = document.createElement("div");
            const colorClass = aboutCard.colorClass || `color-${(index % 8) + 1}`;
            card.className = `uniform-card ${colorClass}`;

            card.innerHTML = `
              <div class="card-icon">
                <i class="fas ${aboutCard.icon || 'fa-info-circle'}"></i>
              </div>
              <h3>${aboutCard.title || 'Title'}</h3>
              <p>${truncateText(aboutCard.description || 'Description here', 100)}</p>
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

        // تقصير الوصف إذا كان طويلاً
        const shortDescription = truncateText(project.description, 70);

        // تحديد المحتوى بناءً على حالة المشروع
        let imageContent = '';
        if (isInProgress) {
          // أيقونة للمشاريع غير المكتملة
          imageContent = `
              <div class="project-icon">
                <i class="fas fa-tools"></i>
              </div>
            `;
        } else {
          // صورة للمشاريع المكتملة
          const projectImage = project.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
          imageContent = `
              <img 
  src="${projectImage}" 
  alt="${project.title}" 
  class="project-image clickable-image">

            `;
        }

        card.innerHTML = `
          ${isInProgress ? `
            <div class="loading-badge project">
              <i class="fas fa-sync-alt"></i>
              In Progress
            </div>
          ` : ''}
          
          <div class="project-image-container">
            ${imageContent}
            <div class="project-overlay">
              <span>${isInProgress ? 'Under Development' : 'View Details'}</span>
            </div>
          </div>
          
          <div class="project-content">
            <h3>${project.title}</h3>
            
            <div class="project-details">
              <p>${shortDescription}</p>
              
              <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join("")}
              </div>
            </div>
            
            ${isInProgress ? `
              <div style="margin-top: 10px;">
                <div class="loading-animation">
                  <div class="spinner pulse"></div>
                  <span class="loading-text">Progress: ${progress}%</span>
                </div>
                
                <!-- شريط التقدم -->
                <div style="width: 100%; margin-top: 8px;">
                  <div class="progress-bar-small">
                    <div class="progress-fill-small" style="width: ${progress}%"></div>
                  </div>
                  <div class="expected-info" style="margin-top: 5px;">
                    <i class="fas fa-hourglass-half"></i>
                    <span style="font-size: 0.8rem;">Expected: ${project.expectedDate || 'Under Development'}</span>
                  </div>
                </div>
              </div>
            ` : `
              <a href="${project.link || '#'}" target="_blank" class="contact-link">
                View Project <i class="fas fa-external-link-alt"></i>
              </a>
            `}
          </div>
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
        const progress = course.progress || (isInProgress ? 50 : 100);
        const expectedDate = course.expectedDate || "Under Development";

        card.className = `
    uniform-card 
    course-card 
    ${colorClass}
    ${isInProgress ? 'loading-shimmer' : ''}
    ${index < visibleItems.courses ? 'visible' : 'hidden'}
  `;

        /* تجهيز الصور */
        let images = [];
        if (Array.isArray(course.image)) {
          images = course.image;
        } else if (typeof course.image === "string" && course.image !== "#") {
          images = [course.image];
        }

        let imageContent = '';

        if (isInProgress) {
          // كورس غير مكتمل → أيقونة
          imageContent = `
      <div class="course-icon-container">
        <div class="course-icon">
          <i class="fas fa-book-open"></i>
        </div>
      </div>
    `;
        } else if (images.length > 0) {
          // كورس مكتمل → صور قابلة للتكبير
          const slidesHTML = images.map((img, i) => `
      <img 
        src="${img}" 
        alt="${course.title}"
        class="course-image clickable-image ${i === 0 ? 'active' : ''}">
    `).join("");

          imageContent = `
      <div class="slides">
        ${slidesHTML}
      </div>
    `;
        } else {
          imageContent = `
      <div class="course-icon-container">
        <div class="course-icon" style="color:#00ff66;">
          <i class="fas fa-graduation-cap"></i>
        </div>
      </div>
    `;
        }

        card.innerHTML = `
    <span class="certificate-status ${isInProgress ? 'status-inprogress' : 'status-completed'}">
      ${isInProgress ? 'In Progress' : 'Completed'}
    </span>

    ${isInProgress ? `
      <div class="loading-badge course">
        <i class="fas fa-book-open"></i>
        Currently Learning
      </div>
    ` : ''}

    <div class="course-image-container slider">
      ${imageContent}
      <div class="course-overlay">
        <span>${isInProgress ? 'In Progress' : 'View Image'}</span>
      </div>
    </div>

    <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
      <h3 style="font-size:1.1rem;">${course.title}</h3>
      <p style="font-size:0.85rem;">
        <strong>Platform:</strong> ${course.platform}
      </p>

      <ul style="font-size:0.85rem;">
        ${course.topics.slice(0, 6).map(t => `<li>${t}</li>`).join("")}
        ${course.topics.length > 6
            ? `<li style="font-style:italic;">... and ${course.topics.length - 6} more</li>`
            : ''}
      </ul>

      ${isInProgress ? `
        <div style="margin-top:10px;">
          <span>Progress: ${progress}%</span>
          <div class="progress-bar-small">
            <div class="progress-fill-small" style="width:${progress}%"></div>
          </div>
          <span>Expected: ${expectedDate}</span>
        </div>
      ` : ''}
    </div>
  `;

        // تفعيل السلايدر
        if (!isInProgress && images.length > 1) {
          initCourseSlider(card);
        }

        coursesGrid.appendChild(card);
        allCoursesCards.push(card);
      });
      /* ========== CERTIFICATES ========== */
      const certGrid = document.getElementById("certificatesGrid");
      const allCertificatesCards = [];
      const certificateColors = ['color-1', 'color-2', 'color-3', 'color-4'];

      // إنشاء كروت الشهادات ديناميكياً
      data.certificates.forEach((cert, index) => {
        const card = document.createElement("div");
        const colorClass = certificateColors[index % certificateColors.length] || 'color-1';

        const isInProgress = cert.status === "In Progress";
        const progress = cert.progress || "50";
        const expectedDate = cert.expectedDate || "Under Development";

        card.className = `uniform-card certificate-card ${colorClass} ${isInProgress ? 'loading-shimmer' : ''} ${index < visibleItems.certificates ? 'visible' : 'hidden'}`;

        // تحديد المحتوى بناءً على حالة الشهادة
        let imageContent = '';
        if (isInProgress) {
          // أيقونة للشهادات غير المكتملة
          imageContent = `
              <div class="certificate-icon">
                <i class="fas fa-certificate"></i>
              </div>
            `;
        } else if (cert.image) {
          // صورة للشهادات المكتملة
          imageContent = `
              <img src="${cert.image}" alt="${cert.title}" class="certificate-main-image">
            `;
        } else {
          // أيقونة افتراضية للشهادات المكتملة
          imageContent = `
              <div class="certificate-icon" style="color: #0ff;">
                <i class="fas fa-award"></i>
              </div>
            `;
        }

        card.innerHTML = `
              ${isInProgress ? `
                <div class="loading-badge course">
                  <i class="fas fa-sync-alt"></i>
                  In Progress
                </div>
              ` : ''}
              
              <!-- صورة/أيقونة الشهادة -->
              <div class="certificate-image-container">
                ${imageContent}
                <div class="certificate-overlay">
                  ${isInProgress ? `
                    <span class="progress-badge">
                      <i class="fas fa-sync-alt fa-spin"></i>
                      Progress: ${progress}%
                    </span>
                  ` : `
                    <span><i class="fas fa-search-plus"></i> View Certificate</span>
                  `}
                </div>
                
                <!-- حالة الشهادة -->
                <div class="certificate-status-badge ${isInProgress ? 'in-progress' : 'completed'}">
                  <i class="fas ${isInProgress ? 'fa-clock' : 'fa-check-circle'}"></i>
                  ${isInProgress ? 'In Progress' : 'Completed'}
                </div>
              </div>
              
              <!-- معلومات الشهادة -->
              <div class="certificate-content">
                <h3 style="font-size: 1.1rem; margin-bottom: 8px;">${cert.title}</h3>
                <p class="certificate-provider" style="font-size: 0.85rem;">
                  <i class="fas fa-building"></i> ${cert.provider}
                </p>
                <p class="certificate-year" style="font-size: 0.85rem;">
                  <i class="fas fa-calendar-alt"></i> ${cert.year}
                </p>
                
                ${cert.credentialId ? `
                  <p class="certificate-id" style="font-size: 0.85rem;">
                    <i class="fas fa-id-card"></i> ID: ${cert.credentialId}
                  </p>
                ` : ''}
                
                <!-- تفاصيل إضافية -->
                <div class="certificate-details">
                  ${isInProgress ? `
                    <div class="progress-details">
                      <div class="progress-info">
                        <div class="progress-text" style="font-size: 0.85rem;">
                          <i class="fas fa-chart-line"></i>
                          <span>Progress: <strong>${progress}%</strong></span>
                        </div>
                        <div class="progress-bar-small">
                          <div class="progress-fill-small" style="width: ${progress}%"></div>
                        </div>
                      </div>
                      <div class="expected-info" style="font-size: 0.8rem;">
                        <i class="fas fa-hourglass-half"></i>
                        <span>Expected: ${expectedDate}</span>
                      </div>
                    </div>
                  ` : `
                    <div class="certificate-tags">
                      <span class="cert-tag" style="font-size: 0.75rem; padding: 4px 10px;">
                        <i class="fas fa-award"></i> Certified
                      </span>
                      <span class="cert-tag" style="font-size: 0.75rem; padding: 4px 10px;">
                        <i class="fas fa-check"></i> ${cert.year}
                      </span>
                    </div>
                  `}
                </div>
              </div>
            `;

        // إضافة حدث النقر على حاوية الشهادة
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

      /* ========== إضافة بطاقات الاتصال مع الألوان الصحيحة ========== */
      const contactContainer = document.getElementById("contactCardsContainer");
      if (contactContainer) {
        contactContainer.innerHTML = '';

        // بطاقات الاتصال مع الألوان الصحيحة حسب النوع
        const contactCards = [
          {
            type: "email",
            title: "Email",
            value: "naderadel102@gmail.com",
            icon: "fas fa-envelope",
            link: "mailto:naderadel102@gmail.com",
            buttonIcon: "fas fa-paper-plane",
            buttonText: "Send Email"
          },
          {
            type: "whatsapp",
            title: "WhatsApp",
            value: "+20 155 622 3003",
            icon: "fab fa-whatsapp",
            link: "https://wa.me/201556223003",
            buttonIcon: "fab fa-whatsapp",
            buttonText: "Connect"
          },
          {
            type: "github",
            title: "GitHub",
            value: "Code Repository",
            icon: "fab fa-github",
            link: "https://github.com/nade-r",
            buttonIcon: "fab fa-github",
            buttonText: "View Projects"
          },
          {
            type: "linkedin",
            title: "LinkedIn",
            value: "Professional Profile",
            icon: "fab fa-linkedin",
            link: "https://www.linkedin.com/in/nader-adel",
            buttonIcon: "fab fa-linkedin",
            buttonText: "Connect"
          }
        ];

        contactCards.forEach((contactCard, index) => {
          const card = document.createElement("div");
          card.className = "contact-card";
          card.setAttribute('data-type', contactCard.type);

          card.innerHTML = `
                <div class="contact-icon">
                  <i class="${contactCard.icon}"></i>
                </div>
                <h3>${contactCard.title}</h3>
                <p>${contactCard.value}</p>
                <a href="${contactCard.link}" ${contactCard.type !== 'email' ? 'target="_blank"' : ''} class="contact-link">
                  <i class="${contactCard.buttonIcon}"></i> ${contactCard.buttonText}
                </a>
              `;

          contactContainer.appendChild(card);
        });
      }

      /* ========== CONTACT FORM SUBMISSION ========== */
      const contactForm = document.getElementById('contactForm');
      const formMessage = document.getElementById('formMessage');

      if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
          e.preventDefault();

          const submitBtn = this.querySelector('.submit-btn');
          const originalText = submitBtn.innerHTML;

          // عرض حالة التحميل
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          submitBtn.disabled = true;

          // محاكاة إرسال النموذج
          setTimeout(() => {
            // إعادة تعيين النموذج
            contactForm.reset();

            // عرض رسالة النجاح
            formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
            formMessage.className = 'form-message success';

            // إعادة زر الإرسال إلى حالته الأصلية
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // إخفاء الرسالة بعد 5 ثوان
            setTimeout(() => {
              formMessage.className = 'form-message';
            }, 5000);
          }, 1500);
        });
      }

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
      if (showSkillsBtn) {
        showSkillsBtn.addEventListener("click", () =>
          toggleSection("skills", allSkillsCards, showSkillsBtn));
      }

      if (showProjectsBtn) {
        showProjectsBtn.addEventListener("click", () =>
          toggleSection("projects", allProjectsCards, showProjectsBtn));
      }

      if (showCoursesBtn) {
        showCoursesBtn.addEventListener("click", () =>
          toggleSection("courses", allCoursesCards, showCoursesBtn));
      }

      if (showCertificatesBtn) {
        showCertificatesBtn.addEventListener("click", () =>
          toggleSection("certificates", allCertificatesCards, showCertificatesBtn));
      }

      // إخفاء الزر إذا لم يكن هناك عناصر مخفية
      if (allSkillsCards.length <= visibleItems.skills && showSkillsBtn) showSkillsBtn.style.display = "none";
      if (allProjectsCards.length <= visibleItems.projects && showProjectsBtn) showProjectsBtn.style.display = "none";
      if (allCoursesCards.length <= visibleItems.courses && showCoursesBtn) showCoursesBtn.style.display = "none";
      if (allCertificatesCards.length <= visibleItems.certificates && showCertificatesBtn) showCertificatesBtn.style.display = "none";

    })
    .catch(error => {
      console.error('Error loading data:', error);
      document.getElementById("skillsGrid").innerHTML = "<p>Error loading data. Please check the data.json file.</p>";

      // إضافة بطاقات الاتصال حتى لو فشل تحميل data.json
      const contactContainer = document.getElementById("contactCardsContainer");
      if (contactContainer) {
        contactContainer.innerHTML = `
              <div class="contact-card" data-type="email">
                <div class="contact-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>naderadel102@gmail.com</p>
                <a href="mailto:naderadel102@gmail.com" class="contact-link">
                  <i class="fas fa-paper-plane"></i> Send Email
                </a>
              </div>
              
              <div class="contact-card" data-type="whatsapp">
                <div class="contact-icon">
                  <i class="fab fa-whatsapp"></i>
                </div>
                <h3>WhatsApp</h3>
                <p>+20 155 622 3003</p>
                <a href="https://wa.me/201556223003" target="_blank" class="contact-link">
                  <i class="fab fa-whatsapp"></i> Connect
                </a>
              </div>
              
              <div class="contact-card" data-type="github">
                <div class="contact-icon">
                  <i class="fab fa-github"></i>
                </div>
                <h3>GitHub</h3>
                <p>Code Repository</p>
                <a href="https://github.com/nade-r" target="_blank" class="contact-link">
                  <i class="fab fa-github"></i> View Projects
                </a>
              </div>
              
              <div class="contact-card" data-type="linkedin">
                <div class="contact-icon">
                  <i class="fab fa-linkedin"></i>
                </div>
                <h3>LinkedIn</h3>
                <p>Professional Profile</p>
                <a href="https://www.linkedin.com/in/nader-adel" target="_blank" class="contact-link">
                  <i class="fab fa-linkedin"></i> Connect
                </a>
              </div>
            `;
      }
    });

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

// دالة لتهيئة السلايدر للكورسات
function initCourseSlider(card) {
  const slider = card.querySelector(".course-image-container.slider");
  if (!slider) return;

  const images = slider.querySelectorAll(".course-image");
  if (images.length <= 1) return;

  let index = 0;
  let intervalId = null;

  function startSlider() {
    intervalId = setInterval(() => {
      images[index].classList.remove("active");
      index = (index + 1) % images.length;
      images[index].classList.add("active");
    }, 3000);
  }

  function stopSlider() {
    clearInterval(intervalId);
  }

  startSlider();

  slider.addEventListener("mouseenter", stopSlider);
  slider.addEventListener("mouseleave", startSlider);
}

// تأثير التلاشي عند التمرير
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

// زر الرجوع للأعلى
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// تحديث الروابط النشطة أثناء التمرير
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

// التنقل في الجوال
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

// تأثير الكتابة للنص في الصفحة الرئيسية
const typingElement = document.getElementById('home-subtitle');
if (typingElement) {
  const text = typingElement.textContent;
  typingElement.textContent = '';
  setTimeout(() => {
    typingElement.classList.add('typing-effect');
    typingElement.textContent = text;
  }, 1000);
}

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeBtn = document.querySelector(".close-modal");
const nextBtn = document.querySelector(".modal-nav.next");
const prevBtn = document.querySelector(".modal-nav.prev");

let currentImages = [];
let currentIndex = 0;

// فتح المودال (كورسات + مشاريع + شهادات)
document.addEventListener("click", function (e) {
  const img = e.target;
  if (img.tagName !== "IMG" || !img.classList.contains("clickable-image")) return;

  // حاول تلاقي سلايدر (كورسات)
  const slider = img.closest(".slides");

  if (slider) {
    // ✅ كورس (صور متعددة)
    currentImages = Array.from(slider.querySelectorAll("img"));
    currentIndex = currentImages.indexOf(img);

    nextBtn.style.display = "block";
    prevBtn.style.display = "block";
  } else {
    // ✅ مشروع أو شهادة (صورة واحدة)
    currentImages = [img];
    currentIndex = 0;

    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
  }

  modalImg.src = img.src;
  modal.style.display = "flex";
});

// إغلاق
closeBtn.onclick = () => modal.style.display = "none";
modal.onclick = () => modal.style.display = "none";
modalImg.onclick = (e) => e.stopPropagation();

// التالي
nextBtn.onclick = (e) => {
  e.stopPropagation();
  if (currentImages.length <= 1) return;

  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex].src;
};

// السابق
prevBtn.onclick = (e) => {
  e.stopPropagation();
  if (currentImages.length <= 1) return;

  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex].src;
};
