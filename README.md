# Detailing Log — Vercel 배포 패키지

세차 디테일링 세션 플래너 PWA. 정적 파일만으로 동작(백엔드 없음). 데이터는 브라우저 IndexedDB에 저장.

## 파일 구성

```
index.html      배포용 — 빈 상태로 시작 (실사용자용)
demo.html       데모 — 샘플 데이터 자동 시드 (체험/소개용, /demo 로 접근)
manifest.json   PWA manifest
sw.js           Service Worker (오프라인 캐싱)
icon.svg        앱 아이콘 (벡터)
icon-192.png    앱 아이콘 192
icon-512.png    앱 아이콘 512 (maskable)
vercel.json     Vercel 헤더/라우팅 설정
```

## 배포 방법

### A. Vercel 대시보드 (드래그앤드롭, 가장 쉬움)
1. https://vercel.com → New Project → 이 폴더를 통째로 업로드(또는 GitHub 연결)
2. Framework Preset: **Other** (정적). 빌드 명령·출력 디렉터리 비워둠.
3. Deploy. 끝.

### B. Vercel CLI
```bash
npm i -g vercel
cd 이폴더
vercel            # 미리보기 배포
vercel --prod     # 프로덕션 배포
```

배포 후:
- `/` → 빈 상태 앱(실사용)
- `/demo` → 데모 데이터 앱 (cleanUrls=true 라 .html 생략 가능)

## 동작 메모

- **오프라인**: Service Worker가 앱 셸을 캐시 → 첫 방문 이후 오프라인에서도 구동. 단, 날씨(Open-Meteo)·리포트 PNG(html2canvas CDN)·지도는 온라인 필요.
- **홈 화면 설치**: 모바일 브라우저에서 "홈 화면에 추가" → standalone 앱으로 실행.
- **데이터 위치**: 전부 기기 로컬(IndexedDB). 기기·브라우저가 바뀌면 설정→백업(JSON)으로 옮길 것.
- **demo와 index는 별도 DB**를 사용(`detaillog_demo` vs `detaillog`). 데모를 체험해도 실사용 데이터에 영향 없음.

## 커스텀 도메인
Vercel 프로젝트 → Settings → Domains 에서 연결. manifest의 start_url/scope는 `/` 기준이라 도메인 무관하게 동작.
