// JavaScript Document
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

            // صورة افتراضية إذا لم توجد صورة
            const projectImage = project.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

            // تقصير الوصف إذا كان طويلاً
            const shortDescription = truncateText(project.description, 70);

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
          
          <div class="project-content">
            <h3>${project.title}</h3>
            
            <div class="project-details">
              <p>${shortDescription}</p>
              
              <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join("")}
              </div>
            </div>
            
            <!-- تأثير التحميل للمشاريع غير المكتملة -->
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
            // تحديد ما إذا كان الكورس غير مكتمل
            const isInProgress = course.status === "In Progress" || course.progress < 100;
            const progress = course.progress || (isInProgress ? "50" : "100");
            const expectedDate = course.expectedDate || "Under Development";
            // تعيين الكلاسات بناءً على حالة الكورس
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
              <span><i class="fas ${isInProgress ? 'fa-sync-alt' : 'fa-book-open'}"></i> ${isInProgress ? 'In Progress' : 'View '}</span>
            </div>
          </div>
          
          <!-- معلومات الكورس -->
          <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
            <h3 style="font-size: 1.1rem; margin-bottom: 8px;">${course.title}</h3>
            <p style="font-size: 0.85rem; margin-bottom: 8px;"><strong>Platform:</strong> ${course.platform}</p>
            
            <!-- مواضيع الكورس -->
<ul style="margin-top: 5px; max-height: 150px; overflow-y: auto; font-size: 0.85rem; line-height: 1.4; padding-left: 15px;">
  ${course.topics.slice(0, 6).map(topic => `<li style="margin-bottom: 4px; padding: 2px 0; color: #ccc;">${topic}</li>`).join("")}
  ${course.topics.length > 6 ? `<li style="font-style: italic; color: #aaa;">... and ${course.topics.length - 6} more topics</li>` : ''}
</ul>
            
            <!-- تأثير التحميل للكورسات غير المكتملة -->
            ${isInProgress ? `
              <div class="loading-animation" style="margin-top: 10px;">
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
                  <span style="font-size: 0.8rem;">Expected: ${expectedDate}</span>
                </div>
              </div>
            ` : `
              <!-- رابط الكورس المكتمل -->
             ${''}
            `}
          </div>
        `;
//يتحط بدل هاد السطر:${''}
        // ${course.link ? `
           //     <a href="${course.link}" target="_blank" class="contact-link" style="margin-top: 10px; font-size: 0.85rem; padding: 6px 12px;">
             //     <i class="fas fa-external-link-alt"></i> View Certificate
            //    </a>
             // ` : ''}

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

          // إنشاء كروت الشهادات ديناميكياً
          data.certificates.forEach((cert, index) => {
            const card = document.createElement("div");
            const colorClass = certificateColors[index % certificateColors.length] || 'color-1';

            const isInProgress = cert.status === "In Progress";
            const progress = cert.progress || "50";
            const expectedDate = cert.expectedDate || "Under Development";

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

    // دالة لعرض الرسائل
    function showMessage(message, type) {
      const messageDiv = document.createElement('div');
      messageDiv.textContent = message;
      messageDiv.className = `form-message ${type}`;
      messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 15px 20px;
    border-radius: 10px;
    font-weight: bold;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    animation: fadeIn 0.3s ease;
  `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 300);
      }, 3000);
    }

