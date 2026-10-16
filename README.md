# 우서영 포트폴리오

HTML / CSS / JavaScript로 만든 정적 사이트입니다. 서버 없이 GitHub Pages에서 그대로 동작합니다.
내용은 `data/` 폴더의 JSON 파일을 `fetch()`로 불러와 화면에 그립니다.

## GitHub Pages로 올리기

1. GitHub에서 새 저장소(예: `portfolio`)를 만듭니다. (Public)
2. 이 폴더의 파일 전체를 저장소 맨 위에 올립니다. (`index.html`이 맨 위에 있어야 합니다)
3. 저장소의 **Settings → Pages**에서 Source를 `Deploy from a branch`, Branch를 `main` / `(root)`로 선택하고 Save 합니다.
4. 1~2분 뒤 `https://<GitHub아이디>.github.io/portfolio/` 주소로 접속됩니다.

## 내용 수정하기 (`data/` 폴더)

| 파일 | 내용 |
|---|---|
| `profile.json` | 이름, 한 줄 소개, 이메일, 프로필 사진 경로, 이력서 경로 |
| `career.json` | 경력 목록 |
| `certs.json` | 자격증·어학, 사용 Tool |
| `education.json` | 전공 정보, 졸업작품·R&D·대회 카드, 수강 과목 |
| `projects.json` | AI로 만든 프로그램 (지금은 비어 있어 "곧 소개할 예정" 문구가 보입니다) |

## 이미지·파일 추가하기

- **프로필 사진:** `assets/img/profile.jpg`로 올리고 `profile.json`의 `"photo"`를 `"assets/img/profile.jpg"`로 바꿉니다. (비워 두면 이름 첫 글자가 표시됩니다)
- **이력서 PDF:** `assets/resume.pdf` 이름으로 올립니다. 파일이 없으면 버튼을 눌렀을 때 "준비 중" 안내가 뜹니다.
- **졸업작품·CAE 이미지:** `assets/img/`에 올리고 `education.json`의 해당 카드 `"images"`에 아래처럼 적습니다. 썸네일로 보이고 클릭하면 크게 열립니다.

```json
"images": [
  { "src": "assets/img/graduation-1.jpg", "caption": "웨어러블 손가락 보조 로봇" }
]
```

- **AI 프로그램:** `projects.json`에 아래 형식으로 추가합니다.

```json
[
  {
    "label": "AI 프로그램",
    "title": "프로그램 이름",
    "description": "한두 문장 설명",
    "bullets": ["주요 기능 1", "주요 기능 2"],
    "images": [{ "src": "assets/img/program-1.png", "caption": "실행 화면" }],
    "links": [{ "label": "GitHub", "url": "https://github.com/..." }]
  }
]
```

이미지는 가로 1600px 이하의 JPG/WebP로 줄여서 올리면 모바일에서 더 빨리 열립니다.

## 내 컴퓨터에서 미리보기

`index.html`을 더블클릭하면 브라우저 보안 때문에 JSON을 불러오지 못합니다. 이 폴더에서 아래 명령을 실행한 뒤 `http://localhost:8000`으로 여세요.

```
python -m http.server 8000
```

## 개인정보

생년월일, 상세 주소, 전화번호는 사이트에 넣지 않았습니다. 공개 저장소에는 올리지 않는 것을 권장합니다.
