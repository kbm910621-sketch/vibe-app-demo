// Data: Courses
const courses = [
  {
    id: 1,
    category: "it",
    categoryName: "IT·개발·AI",
    title: "풀스택 웹 & 클라우드 개발자 양성과정",
    summary: "React, Node.js, Spring Boot 및 AWS 기반의 실무 풀스택 포트폴리오 완성",
    duration: "6개월 (전일제)",
    badge: "국비 100% 무료",
    badgeType: "gov",
    level: "초급~중급",
    target: "비전공자/취업준비생",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    curriculum: ["HTML/CSS/JS 심화 & TypeScript", "React.js & Next.js 프론트엔드", "Java Spring Boot & REST API", "AWS 배포 & 팀 협업 프로젝트"]
  },
  {
    id: 2,
    category: "it",
    categoryName: "IT·개발·AI",
    title: "생성형 AI & 파이썬 데이터 분석 실무",
    summary: "ChatGPT API, LangChain 활용 실무 AI 앱 개발 및 빅데이터 시각화",
    duration: "4개월 (평일/주말)",
    badge: "인기과정",
    badgeType: "hot",
    level: "입문 가능",
    target: "직무전환/데이터분석",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
    curriculum: ["Python 기초 및 데이터 핸들링(Pandas)", "머신러닝 & 딥러닝 핵심", "LLM & LangChain AI 앱 제작", "실전 데이터 인사이트 프로젝트"]
  },
  {
    id: 3,
    category: "design",
    categoryName: "디자인·영상",
    title: "UI/UX 웹디자인 & 피그마 포트폴리오",
    summary: "사용자 경험 리서치부터 Figma 프로토타이핑, 반응형 웹 코딩까지 완벽 마스터",
    duration: "5개월 (전일제)",
    badge: "국비 100% 무료",
    badgeType: "gov",
    level: "초급 가능",
    target: "디자이너 취업/이직",
    image: "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80",
    curriculum: ["디자인 기초 & Photoshop/Illustrator", "UI/UX 리서치 기법 & Wireframing", "Figma 오토레이아웃 & 컴포넌트 시스템", "개인 맞춤 취업 포트폴리오 웹사이트"]
  },
  {
    id: 4,
    category: "design",
    categoryName: "디자인·영상",
    title: "모션그래픽 & 유튜브 영상편집 전문가",
    summary: "프리미어 프로, 애프터이펙트, 3D 시네마4D를 활용한 하이엔드 영상 제작",
    duration: "4개월 (평일/주말)",
    badge: "취업률 96%",
    badgeType: "hot",
    level: "초급~중급",
    target: "영상 크리에이터/PD",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    curriculum: ["Premiere Pro 컷편집 & 사운드 디자인", "After Effects 모션그래픽 & 특수효과", "트렌디 숏폼/유튜브 브랜딩 영상", "실무 광고 영상 포트폴리오 제작"]
  },
  {
    id: 5,
    category: "cert",
    categoryName: "세무·회계·자격증",
    title: "전산세무 1·2급 + 전산회계 1급 종합",
    summary: "케이렙(KcLep) 실무 프로그램 실습 및 단기 국가공인 자격증 동시 취득",
    duration: "3개월 (단기완성)",
    badge: "자격증 취득 1위",
    badgeType: "hot",
    level: "입문 가능",
    target: "사무직/경리회계 취업",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    curriculum: ["재무회계 및 원가회계 원리", "부가가치세 & 원천제세 실무", "법인세 세무조정(전산세무1급)", "기출문제 풀이 및 모의고사 집중반"]
  },
  {
    id: 6,
    category: "cert",
    categoryName: "세무·회계·자격증",
    title: "컴퓨터활용능력 1·2급 단기 합격반",
    summary: "부산 공기업·대기업 채용 가산점 필수! 엑셀·액세스 실기 100% 합격 전략",
    duration: "4주~8주 (단기속성)",
    badge: "가산점 필수",
    badgeType: "",
    level: "누구나 가능",
    target: "공기업/대기업 취준생",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    curriculum: ["컴활 필기 핵심 압축 특강", "스프레드시트(Excel) 고급 함수 & 매크로", "데이터베이스(Access) 실전 쿼리", "최신 상시시험 기출 복원 완벽대비"]
  }
];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderCourses("all");
  initTheme();
  setupFilterTabs();
  setupConsultForm();
  setupModal();
  setupCampusTabs();
  setupScrollEvents();
});

// Render Courses
function renderCourses(filter) {
  const container = document.getElementById("courseContainer");
  if (!container) return;

  const filtered = filter === "all" ? courses : courses.filter(c => c.category === filter);

  container.innerHTML = filtered.map(item => `
    <div class="course-card" data-category="${item.category}">
      <div class="course-thumb">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="course-badge ${item.badgeType}">${item.badge}</div>
      </div>
      <div class="course-content">
        <span class="course-category">${item.categoryName}</span>
        <h4 class="course-title">${item.title}</h4>
        <p class="course-summary">${item.summary}</p>
        <div class="course-meta">
          <span><i class="bi bi-clock"></i> ${item.duration}</span>
          <span><i class="bi bi-bar-chart"></i> ${item.level}</span>
        </div>
        <div class="course-footer">
          <button class="btn btn-secondary btn-sm" onclick="openCourseDetail(${item.id})">상세보기</button>
          <button class="btn btn-primary btn-sm" onclick="quickApply('${item.title}')">상담신청</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Filter Tabs
function setupFilterTabs() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderCourses(category);
    });
  });
}

// Modal handling
function setupModal() {
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("modalClose");
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
}

function openCourseDetail(courseId) {
  const item = courses.find(c => c.id === courseId);
  if (!item) return;

  const titleEl = document.getElementById("modalTitle");
  const bodyEl = document.getElementById("modalBody");
  const overlay = document.getElementById("modalOverlay");

  titleEl.innerHTML = `<span style="color:var(--primary); font-size:0.9rem; display:block;">${item.categoryName}</span>${item.title}`;
  
  bodyEl.innerHTML = `
    <div style="margin-bottom: 20px;">
      <img src="${item.image}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:14px;">
      <p style="color:var(--text-sub); line-height:1.6; margin-bottom:14px;">${item.summary}</p>
      
      <div style="background:var(--bg-main); padding:14px; border-radius:10px; margin-bottom:16px; font-size:0.9rem;">
        <div style="margin-bottom:6px;"><strong>⏱ 교육 기간:</strong> ${item.duration}</div>
        <div style="margin-bottom:6px;"><strong>🎯 추천 대상:</strong> ${item.target}</div>
        <div><strong>🏆 난이도:</strong> ${item.level}</div>
      </div>

      <h5 style="font-size:1rem; font-weight:700; margin-bottom:10px;">📋 주요 커리큘럼</h5>
      <ul style="list-style:disc; padding-left:20px; color:var(--text-sub); line-height:1.8; font-size:0.9rem; margin-bottom:20px;">
        ${item.curriculum.map(c => `<li>${c}</li>`).join("")}
      </ul>

      <button class="btn btn-primary" style="width:100%;" onclick="quickApply('${item.title}'); document.getElementById('modalOverlay').classList.remove('active');">
        이 과정 실시간 수강/국비지원 상담 신청
      </button>
    </div>
  `;

  overlay.classList.add("active");
}

function quickApply(courseName) {
  const select = document.getElementById("consultCourse");
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.includes(courseName) || courseName.includes(select.options[i].value)) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  const consultSection = document.getElementById("consultSection");
  if (consultSection) {
    consultSection.scrollIntoView({ behavior: "smooth" });
  }
  showToast(`"${courseName}" 상담이 선택되었습니다.`);
}

// Consult Form
function setupConsultForm() {
  const form = document.getElementById("consultForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("consultName").value.trim();
    const phone = document.getElementById("consultPhone").value.trim();
    const course = document.getElementById("consultCourse").value;
    const campus = document.getElementById("consultCampus").value;

    if (!name || !phone) {
      alert("이름과 연락처를 입력해주세요.");
      return;
    }

    // Save to localStorage simulation
    const consultation = {
      name, phone, course, campus, date: new Date().toLocaleString()
    };
    const list = JSON.parse(localStorage.getItem("busan_consultations") || "[]");
    list.push(consultation);
    localStorage.setItem("busan_consultations", JSON.stringify(list));

    showToast("🎉 상담 신청이 성공적으로 접수되었습니다! 전문 상담사가 곧 연락드립니다.");
    form.reset();
  });
}

// Tuition Calculator
function calculateSubsidy() {
  const type = document.getElementById("calcUserType").value;
  const priceDisplay = document.getElementById("calcPriceResult");
  const descDisplay = document.getElementById("calcDescResult");

  if (type === "unemployed" || type === "national") {
    priceDisplay.innerHTML = "0원 <span style='font-size:1rem; font-weight:normal;'>(100% 전액 지원)</span>";
    descDisplay.innerText = "국민내일배움카드 + K-Digital 지원으로 자부담금 0원 & 훈련장려금 월 최대 316,000원 지급!";
  } else if (type === "worker") {
    priceDisplay.innerHTML = "월 5~10만원대 <span style='font-size:1rem; font-weight:normal;'>(최대 85% 국비)</span>";
    descDisplay.innerText = "재직자 내일배움카드로 정규 수강료의 최대 85% 국비 지원 적용";
  } else {
    priceDisplay.innerHTML = "최대 40% 장학할인";
    descDisplay.innerText = "얼리버드 및 제휴 대학/취업준비생 특별 장학 혜택이 적용됩니다.";
  }
}

// Campus Tabs
function setupCampusTabs() {
  const btns = document.querySelectorAll(".campus-btn");
  const infoTitle = document.getElementById("campusTitle");
  const infoAddr = document.getElementById("campusAddr");
  const infoTel = document.getElementById("campusTel");
  const infoSubway = document.getElementById("campusSubway");

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const campus = btn.getAttribute("data-campus");

      if (campus === "seomyeon") {
        if(infoTitle) infoTitle.innerText = "부산 서면 본원 캠퍼스";
        if(infoAddr) infoAddr.innerText = "부산광역시 부산진구 중앙대로 700 (서면역 2번 출구 도보 2분)";
        if(infoTel) infoTel.innerText = "051-800-1000";
        if(infoSubway) infoSubway.innerText = "부산지하철 1·2호선 서면역 환승역 지하 연결통로 이용 가능";
      } else {
        if(infoTitle) infoTitle.innerText = "부산 센텀시티 IT/AI 캠퍼스";
        if(infoAddr) infoAddr.innerText = "부산광역시 해운대구 센텀중앙로 90 큐비E센텀 8층";
        if(infoTel) infoTel.innerText = "051-740-2000";
        if(infoSubway) infoSubway.innerText = "부산지하철 2호선 센텀시티역 / 동해선 센텀역 도보 5분";
      }
    });
  });
}

// Theme
function initTheme() {
  const toggleBtn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("busan_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("busan_theme", next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#themeToggle i");
  if (!icon) return;
  if (theme === "dark") {
    icon.className = "bi bi-sun-fill";
  } else {
    icon.className = "bi bi-moon-stars-fill";
  }
}

// Toast
function showToast(msg) {
  let toast = document.getElementById("toastBox");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastBox";
    toast.className = "toast-box";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="bi bi-check-circle-fill" style="color:var(--success);"></i> <span>${msg}</span>`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// Scroll Events
function setupScrollEvents() {
  const topBtn = document.getElementById("fabTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topBtn?.classList.add("show");
    } else {
      topBtn?.classList.remove("show");
    }
  });

  topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}