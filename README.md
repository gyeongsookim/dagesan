# 다계산 - 구글 애드센스 수익형 웹 도구 모음 사이트

2026년 최신 세법, 노무법, 부동산 규정을 완벽하게 반영한 **고단가(High CPC) 타깃 실생활 업무·금융 계산기 포털**입니다.
구글 애드센스의 '가치 없는 콘텐츠(Low Value Content)' 거절을 완벽히 방어할 수 있도록 **[도구 기능 + 상세 가이드 + 법적 근거 + FAQ 아코디언 + Schema.org 구조화 데이터]**가 유기적으로 결합되어 제작되었습니다.

---

## 📁 주요 파일 및 구조

```
├── index.html                   # 메인 포털 허브 (실시간 검색, 카테고리별 그리드)
├── salary-calculator.html       # [인기 1위] 2026 연봉 실수령액 계산기
├── hourly-wage-calculator.html  # [알바 필수] 주휴수당 & 알바 시급 계산기
├── severance-calculator.html    # [직장인] 법정 퇴직금 모의 계산기
├── unemployment-calculator.html # [정부지원] 2026 실업급여 모의 계산기
├── real-estate-fee.html         # [고단가] 부동산 중개보수(복비) 계산기
├── text-counter.html            # [취준/문서] 글자수 세기 & 바이트 분석기
├── about.html                   # 사이트 소개 (E-E-A-T 신뢰도 필수 페이지)
├── contact.html                 # 문의하기 (고객지원 및 의견 제안)
├── privacy.html                 # 개인정보처리방침 (애드센스 승인 필수!)
├── terms.html                   # 서비스 이용약관 및 법적 면책 고지
├── robots.txt                   # 검색엔진 크롤링 지침
├── sitemap.xml                  # 구글 서치 콘솔용 사이트맵
├── css/
│   └── custom.css               # 맞춤 스타일링 및 광고 플레이스홀더 규격
└── js/
    ├── calculations.js          # 6대 핵심 알고리즘 연산 엔진
    └── common.js                # 메뉴 토글, 검색, 클립보드 복사, 콤마 서식
```

---

## 🚀 1. 로컬에서 사이트 바로 실행해보기

별도의 설치나 서버 실행 과정이 필요 없습니다!
1. 탐색기에서 본 폴더(`새 폴더`)로 이동합니다.
2. `index.html` 파일을 **더블 클릭**하면 크롬, 엣지 등 기본 웹 브라우저에서 사이트가 즉시 열립니다.
3. 모든 계산기, 검색창, 복사 기능, 반응형 모바일 화면이 100% 작동합니다.

---

## 🌐 2. 무료로 전 세계에 배포하기 (1분 완성)

개인 도메인 연결 및 SSL(HTTPS) 인증서가 무료로 제공되는 정적 웹 호스팅을 추천합니다:

### 방법 A: Cloudflare Pages (가장 추천 - 속도 최상, 완전 무료)
1. [Cloudflare](https://dash.cloudflare.com/)에 회원가입 후 로그인합니다.
2. **Workers & Pages** 메뉴 > **Create Application** > **Pages** 탭을 클릭합니다.
3. **Upload assets**(직접 업로드)를 선택하고, 프로젝트 이름을 입력합니다.
4. 이 폴더 내의 모든 파일(폴더 포함)을 드래그 앤 드롭으로 올리고 **Deploy site**를 누르면 끝!
   - `https://your-site.pages.dev` 형태의 무료 주소가 생성됩니다.

### 방법 B: Vercel 또는 Netlify
- Vercel이나 Netlify 사이트 접속 후 폴더를 드래그 앤 드롭(Drop to deploy)하면 30초 만에 전 세계에 무료 배포됩니다.

---

## 💰 3. 구글 애드센스 신청 및 승인 꿀팁

### Step 1. 저렴한 도메인 연결 (강력 권장)
- 무료 서브도메인(`.pages.dev` 등)보다 **개인 도메인(예: `worktool.kr`, `worktool.site`, `worktool.com`)**을 1~2만 원대에 구매하여 연결하면 애드센스 승인 확률이 90% 이상 높아집니다.
- 가비아, 호스팅케이알, Cloudflare Registrar 등에서 구매 후 Cloudflare Pages에 연동하면 됩니다.

### Step 2. 검색엔진 등록 (크롤링 유도)
- **Google Search Console(구글 서치 콘솔)**에 내 도메인을 등록합니다.
- `sitemap.xml` 제출 메뉴에서 `https://내도메인/sitemap.xml`을 등록하여 구글봇이 모든 페이지를 긁어가도록 합니다.
- **네이버 서치어드바이저**에도 동일하게 등록합니다.

### Step 3. 애드센스 승인 심사 신청
1. [Google AdSense](https://www.google.com/adsense/)에 로그인 후 사이트 추가.
2. 각 HTML 파일의 `<head>` 태그 내에 있는 본인의 애드센스 스크립트 주석을 해제하고 `ca-pub-XXXXXXXXXXXX`를 본인 코드로 교체:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-본인ID" crossorigin="anonymous"></script>
   ```
3. 사이트 검토 요청을 누르고 3일~2주 정도 기다리면 승인 완료 메일이 도착합니다.

---

## 🎯 4. 실제 광고 코드로 교체하는 방법

승인 완료 후, HTML 파일들에 미리 마련되어 있는 회색 점선 박스(`.adsense-placeholder`)를 구글 애드센스에서 발급받은 반응형 디스플레이 광고 코드로 교체하시면 됩니다.

**[교체 전]**
```html
<div class="adsense-placeholder adsense-leaderboard">
  ... 안내 문구 ...
</div>
```

**[교체 후]**
```html
<div class="my-6 text-center">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-본인ID"
       data-ad-slot="광고단위슬롯ID"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

---

## 📈 5. 수익 극대화 및 트래픽 증대 전략
1. **블로그/SNS 연계**: 블로그나 스레드, 인스타그램 등에 "2026 내 연봉 실수령액 계산해보기", "주휴수당 놓치지 않는 법" 등의 포스팅을 올리며 사이트 링크를 첨부합니다.
2. **새로운 도구 확장**: 연차 계산기, 대출 이자 계산기, 적금 이자 계산기 등 필요에 따라 페이지를 계속 확장할 수 있습니다.
