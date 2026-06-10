# HANA STAY — 예약현황 앱 (JnJ booking)

전체 규칙: `vagabond840717-wq/hana-stay` 저장소의 CLAUDE.md 참고.

---

## 이 앱 정보
- **테마**: 라이트 `#f4f6fb` / 네이비 강조
- **배포**: GitHub Pages (이 저장소 루트 index.html)
- **백엔드**: `https://ical-proxy.vagabond1984.workers.dev`

## 핵심 기능
- 멀티 플랫폼 달력 (✈ Airbnb / 🏨 Booking.com / 🌐 Trip.com / 🏡 리브애니웨어)
- 오버부킹 감지 `.c-overbooking`
- 블락 처리 `.c-ab-block`
- 비밀번호/메모 관리
- PWA + 푸시 알림
- 통계 뷰 (월별 점유율/매출)

## 데이터 구조 핵심
```js
// Room 객체
{ name, url, bkUrl, trUrl, lvUrl, color }

// Booking 객체
{ cinY, cinM, cinD, coutY, coutM, coutD }
// ⚠ cinM/coutM 은 0-indexed (5 = 6월)

// bkKey 형식
`${roomName}|${cinY}${MM}${DD}`  // Booking.com: +_bk / Trip.com: +_tr / LV: +_lv
```

## 수정 시 필수 체크
- [ ] 청소 앱(jnjhana)도 같이 수정 필요한지 확인
- [ ] iCal 필터: Airbnb는 `not available`/`airbnb (not available)` 제외, 나머지는 `not available`/`closed`/`''` 제외
- [ ] render() 후 attachCellClicks() 체인 유지
- [ ] 월 값 0-indexed 확인

## 작업 원칙
- 큰 기능: 설계 먼저 → 사용자 승인 후 구현
- 승인 없이 다음 단계 진행 금지
- 설명은 코딩 용어 말고 일상 비유로
- 작업 완료 후 hana-stay 저장소의 STATUS.md 업데이트 요청할 것
