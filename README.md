# RETRO CALC

핑크 계열 레트로 · 픽셀 게임 느낌의 일반 계산기.

## 스택

- **Next.js 16** (App Router, Turbopack) · **TypeScript** · **React 19**
- **decimal.js** — 부동소수점 오차 없는 사칙연산 / 퍼센트 / 메모리 연산
- **Tailwind CSS v4** + **tailwind-merge** — 그 외 스타일/UI 라이브러리 없음
- 서버·데이터베이스 없음. 클라이언트 `localStorage`에만 저장

## 기능

- 사칙연산, `=`, 소수점, `AC`, 백스페이스(`<-`), 부호 전환(`+/-`), 퍼센트(`%`)
- 반복 `=` (마지막 연산 재적용), 1,000 단위 구분(토글), 긴 결과는 지수 표기로 자동 전환
- 메모리 레지스터: `MC` `MR` `M+` `M-`
- 키보드 입력: 숫자, `. + - * /`, `Enter`/`=`, `Backspace`, `Esc`(AC), `%`
- 8비트 효과음 (토글, 기본 꺼짐 — WebAudio로 생성, 오디오 파일 없음)
- 계산 기록 패널: 항목 클릭 시 결과 불러오기, 개별/전체 삭제

## localStorage 키

| 키                      | 내용                                             |
| ----------------------- | ------------------------------------------------ |
| `retro-calc:history`    | 계산 기록 (최대 100개)                           |
| `retro-calc:memory`     | 메모리 레지스터 값                               |
| `retro-calc:last-state` | 마지막 화면 상태(입력값, 누적값, 연산자 등) 복원 |
| `retro-calc:settings`   | 사운드 / 자릿수 구분 / 기록 패널 표시 여부       |

## 실행

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```
