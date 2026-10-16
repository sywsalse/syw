(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // 같은 폴더의 JSON을 비동기로 불러온다 (AJAX)
  function getJSON(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(path + ' ' + res.status);
      return res.json();
    });
  }

  var toastTimer;
  function toast(message) {
    var el = $('toast');
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 3200);
  }

  /* ---------- 렌더링 ---------- */

  function renderProfile(p) {
    document.title = p.name + ' | 포트폴리오';
    $('greeting').innerHTML = esc(p.greeting) + ' <span aria-hidden="true">👋</span>';
    $('tagline').textContent = p.tagline;

    var meta = [];
    if (p.location) meta.push(esc(p.location) + ' 거주');
    if (p.email) meta.push('<a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a>');
    $('meta').innerHTML = meta.join(' · ');

    var avatar = $('avatar');
    if (p.photo) {
      avatar.style.backgroundImage = 'url("' + p.photo + '")';
    } else {
      avatar.textContent = p.name.charAt(0);
    }

    $('mailBtn').href = 'mailto:' + p.email;
    $('footMail').innerHTML = '문의 <a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a>';

    var resume = $('resumeBtn');
    resume.href = p.resume;
    resume.addEventListener('click', function (e) {
      e.preventDefault();
      // 이력서 파일이 올라와 있는지 비동기로 확인한 뒤 내려받는다
      fetch(p.resume, { method: 'HEAD' }).then(function (res) {
        if (!res.ok) throw new Error('missing');
        var a = document.createElement('a');
        a.href = p.resume;
        a.download = p.name + '_이력서.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }).catch(function () {
        toast('이력서 파일을 준비 중입니다. 문의하기로 연락 주세요.');
      });
    });

    $('highlights').innerHTML = p.highlights.map(function (h, i) {
      return '<li><a href="#' + esc(h.target) + '">' +
        '<div class="hl-num">0' + (i + 1) + '</div>' +
        '<div class="hl-title">' + esc(h.title) + '</div>' +
        '<div class="hl-sum">' + esc(h.summary) + '</div></a></li>';
    }).join('');
  }

  function points(list) {
    return '<ul class="points">' + list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  function tags(list) {
    return '<ul class="tags">' + list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  function renderCareer(list) {
    $('careerList').innerHTML = list.map(function (j) {
      return '<article class="job' + (j.current ? ' current' : '') + '">' +
        '<div class="job-head">' +
          '<h3 class="job-title">' + esc(j.company) + ' <span>' + esc(j.role) + '</span>' +
            (j.current ? '<span class="badge">재직 중</span>' : '') + '</h3>' +
          '<div class="job-period">' + esc(j.period) + '</div>' +
        '</div>' +
        '<p class="job-sum">' + esc(j.summary) + '</p>' +
        (j.brands && j.brands.length ? '<p class="brand-label">취급 브랜드</p>' + tags(j.brands) : '') +
        points(j.bullets) +
        (j.tags && j.tags.length ? tags(j.tags) : '') +
      '</article>';
    }).join('');
  }

  var certData = [];
  function renderCerts(filter) {
    var items = certData.filter(function (c) { return filter === '전체' || c.category === filter; });
    $('certList').innerHTML = items.map(function (c) {
      return '<li class="cert">' +
        '<div class="cert-cat">' + esc(c.category) + '</div>' +
        '<div class="cert-name">' + esc(c.name) + '</div>' +
        (c.detail ? '<div class="cert-detail">' + esc(c.detail) + '</div>' : '') +
        (c.date ? '<div class="cert-date">' + esc(c.date) + '</div>' : '') +
      '</li>';
    }).join('');
  }

  function setupCertFilters() {
    var box = $('certFilters');
    box.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      Array.prototype.forEach.call(box.querySelectorAll('.chip'), function (c) {
        var on = c === btn;
        c.classList.toggle('active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      renderCerts(btn.getAttribute('data-filter'));
    });
  }

  function thumbs(images) {
    if (!images || !images.length) return '';
    return '<div class="thumbs' + (images.length === 1 ? ' single' : '') + '">' + images.map(function (im, i) {
      return '<button class="thumb" type="button" data-src="' + esc(im.src) + '" data-cap="' + esc(im.caption || '') + '" aria-label="' + esc(im.caption || '이미지 크게 보기') + '">' +
        '<img src="' + esc(im.src) + '" alt="' + esc(im.caption || '') + '" loading="lazy" decoding="async"></button>';
    }).join('') + '</div>';
  }

  function renderEducation(e) {
    $('eduHead').innerHTML = '<strong>' + esc(e.school) + '</strong> · ' + esc(e.period);
    $('eduCards').innerHTML = e.cards.map(function (c) {
      return '<article class="card">' +
        '<div class="card-label">' + esc(c.label) + '</div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        points(c.bullets) +
        thumbs(c.images) +
      '</article>';
    }).join('');
    $('courseList').innerHTML = e.courses.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
  }

  function renderProjects(list) {
    var box = $('projectList');
    if (!list.length) {
      box.innerHTML = '<div class="placeholder">AI로 만든 프로그램을 곧 소개할 예정입니다.</div>';
      return;
    }
    box.innerHTML = list.map(function (p) {
      return simpleCard(p);
    }).join('');
  }

  function linkList(links) {
    if (!links || !links.length) return '';
    return '<div class="links">' + links.map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ↗</a>';
    }).join('') + '</div>';
  }

  // 프로젝트·활동 공통 카드. 배경/기능 같은 긴 내용은 "자세히 보기"로 접어 둔다.
  function simpleCard(p) {
    var more = '';
    if (p.background || (p.sections && p.sections.length)) {
      more = '<details class="more"><summary>자세히 보기</summary>' +
        (p.background ? '<h4>개발 배경</h4><p>' + esc(p.background) + '</p>' : '') +
        (p.sections || []).map(function (s) {
          return '<h4>' + esc(s.heading) + '</h4>' + points(s.items);
        }).join('') +
        (p.images && p.images.length ? '<h4>화면 예시</h4>' + thumbs(p.images) : '') +
      '</details>';
    }
    var chips = p.tags || p.tech;
    return '<article class="card">' +
      '<div class="card-label">' + esc(p.label || 'AI 프로그램') + '</div>' +
      '<h3>' + esc(p.title) + '</h3>' +
      (p.description ? '<p class="desc">' + esc(p.description) + '</p>' : '') +
      (p.bullets ? points(p.bullets) : '') +
      (chips && chips.length ? tags(chips) : '') +
      (more ? '' : thumbs(p.images)) +
      more +
      linkList(p.links) +
    '</article>';
  }

  function renderActivities(list) {
    $('activityList').innerHTML = list.map(simpleCard).join('');
  }

  /* ---------- 이미지 확대 ---------- */

  function setupLightbox() {
    var box = $('lightbox');
    var lastFocus = null;

    function close() {
      box.hidden = true;
      if (lastFocus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('.thumb');
      if (t) {
        lastFocus = t;
        $('lbImg').src = t.getAttribute('data-src');
        $('lbImg').alt = t.getAttribute('data-cap');
        $('lbCap').textContent = t.getAttribute('data-cap');
        box.hidden = false;
        $('lbClose').focus();
        return;
      }
      if (e.target === box || e.target.closest('#lbClose')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) close();
    });
  }

  /* ---------- 현재 위치 메뉴 강조 ---------- */

  function setupNavHighlight() {
    var links = {};
    Array.prototype.forEach.call(document.querySelectorAll('.nav a'), function (a) {
      links[a.getAttribute('data-target')] = a;
    });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        var a = links[en.target.id];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = $(id);
      if (s) io.observe(s);
    });
  }

  /* ---------- 시작 ---------- */

  function showLoadError() {
    var msg = '<p class="empty">내용을 불러오지 못했습니다. 파일을 더블클릭해서 연 경우 데이터가 막힐 수 있습니다. ' +
      'GitHub Pages 주소로 보거나, 이 폴더에서 <code>python -m http.server</code> 실행 후 ' +
      '<code>http://localhost:8000</code>으로 열어주세요.</p>';
    ['careerList', 'eduCards', 'projectList', 'activityList'].forEach(function (id) { $(id).innerHTML = msg; });
    $('certList').innerHTML = '';
  }

  Promise.all([
    getJSON('data/profile.json'),
    getJSON('data/career.json'),
    getJSON('data/certs.json'),
    getJSON('data/education.json'),
    getJSON('data/projects.json'),
    getJSON('data/activities.json')
  ]).then(function (r) {
    renderProfile(r[0]);
    renderCareer(r[1]);
    certData = r[2].items;
    renderCerts('전체');
    $('toolList').innerHTML = r[2].tools.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    renderEducation(r[3]);
    renderProjects(r[4]);
    renderActivities(r[5]);
  }).catch(function (err) {
    console.error(err);
    showLoadError();
  });

  setupCertFilters();
  setupLightbox();
  setupNavHighlight();
})();
