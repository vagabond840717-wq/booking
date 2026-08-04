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

// 경계 메모 (trCuts) — KV key: extra_tr_cuts
{ roomName, platform:'tr', y, m, d }   // "이 호실 · 이 날짜는 손님이 바뀌는 날"
```

### 경계 메모 규칙 (Trip.com 합쳐진 예약 분리)
- 트립이 연속된 두 예약을 한 덩어리로 보내면 중간 퇴실이 안 보인다 → 경계 메모로 잘라서 표시
- **날짜 하나만** 기억한다. 예약 기간을 조건으로 걸지 않는다
  (구버전 `tr_splits`는 `origCin~origCout` 완전일치를 요구해 예약이 연장·단축되면 메모가 폐기됨 → 재발 원인)
- 경계가 예약 **한가운데** 있을 때만 자른다. 입실일·퇴실일과 같으면 아무것도 하지 않는다
- **은퇴**: 그 날짜에 걸친 예약이 하나도 없을 때만 메모를 거둔다 (앞·뒤 모두 취소된 경우)
  · 지난 날짜 경계는 과거 화면 유지를 위해 보존 · 피드가 비면 판정 보류
- **⚠ 확인**: 직전 피드에 없던 예약에 경계가 걸치면 일단 나눠서 보여주고 🔔 알림으로 확인받는다
  (퇴실을 놓치는 쪽이 더 위험하므로 자르는 쪽이 기본)

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
