# 🚐 차량 운행 일지 — 배포 가이드

길음종합사회복지관 차량 운행 일지 웹앱입니다.

---

## 📱 주요 기능

- 9개 차량별 운행 기록 관리
- 최초 키로수 등록 → 이후 자동 누적
- 최종 키로수 입력 → 운행 거리 자동 계산
- Google Sheets 실시간 연동 (팀원 모두 공유)
- 모바일 최적화 (PWA 지원)
- CSV 내보내기

---

## 🚀 Vercel 배포 방법 (5분)

### 1단계: GitHub에 올리기

```bash
# 이 폴더(vehicle-log)를 GitHub 새 저장소로 업로드
# GitHub.com → New repository → "vehicle-log"
# 파일 업로드 또는 git push
```

### 2단계: Vercel 배포

1. [vercel.com](https://vercel.com) 접속 → GitHub으로 로그인
2. **Add New Project** → 방금 만든 `vehicle-log` 저장소 선택
3. **Deploy** 버튼 클릭
4. 완료! `https://vehicle-log-xxx.vercel.app` 링크 생성

---

## 📊 Google Sheets 연동 방법

### 1단계: Google Sheets 새 문서 생성

[sheets.new](https://sheets.new) 에서 새 스프레드시트 생성

### 2단계: Apps Script 코드 입력

Sheets에서 **확장 프로그램 → Apps Script** 열기

아래 코드를 전체 붙여넣기 후 저장(💾):

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = data.vehicle || "기록";
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        'No','날짜','부서','탑승자',
        '이전km','최종km','운행거리(km)','특이사항','저장시각'
      ]);
      sheet.getRange(1,1,1,9).setBackground('#1a3a6b')
        .setFontColor('#ffffff').setFontWeight('bold');
    }
    sheet.appendRow([
      data.no, data.date, data.team, data.rider,
      data.prevKm, data.finalKm, data.dist,
      data.note || '', new Date().toLocaleString('ko-KR')
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({result:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({result:'error',msg:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3단계: 웹앱으로 배포

1. Apps Script에서 **배포 → 새 배포** 클릭
2. 유형: **웹앱** 선택
3. 설명: `차량운행일지`
4. 실행 계정: **나**
5. 액세스 권한: **모든 사용자**
6. **배포** 클릭
7. 나타나는 **웹앱 URL** 복사

### 4단계: 앱에서 URL 입력

1. 배포된 웹앱 접속
2. 상단 **Sheets 연동** 버튼 탭
3. 복사한 URL 붙여넣기 → 저장

이후 기록 추가 시 Google Sheets에 자동 저장됩니다! ✅

---

## 📁 파일 구조

```
vehicle-log/
├── index.html      ← 메인 앱 (이것만 있어도 동작)
├── manifest.json   ← PWA 설정
├── icon-192.png    ← 앱 아이콘
├── icon-512.png    ← 앱 아이콘
└── README.md       ← 이 파일
```

---

## 🏢 길음종합사회복지관

- 팀: 기획운영 / 마을동행 / 마을돌봄 / 마을성장 / 마을공동체
- 차량: 포터, 구모닝(5834), 26모닝(1539), 민트레이(복지관), 스타렉스(복지관), 레이(이목), 레이(길음실버사업단), 레이(센터), 스타렉스(복지센터)
