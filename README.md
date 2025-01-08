# 🐾 mung with me

<img src="https://github.com/user-attachments/assets/a2ec542f-7dc3-4a97-b016-6f5a3c5ff414" width="600" />

## 기술 스택

<img src="https://github.com/user-attachments/assets/0b988f20-3481-426a-8377-8ea4e0381cd6" width="600" />

## 폴더 구조

```dotnetcli
📦src
 ┣ 📂app
    # 앱에 전반적으로 영향을 미치는 요소를 담은 레이어
 ┣ 📂entities
     # 앱이 다루는 도메인들의 실제 개념들을 담은 레이어
 ┃ ┣ 📂map
      # 지도 관련 모든 로직을 담당하는 슬라이스 (비즈니스 도메인)
 ┃ ┃ ┣ 📂@x # 같은 레이어에서 서로 다른 슬라이스에서 사용 가능한 타입을 담은 세그먼트
 ┃ ┃ ┃ ┣ 📜auth.ts # 파일명은 사용하는 다른 도메인의 이름으로 선언
 ┃ ┃ ┃ ┗ 📜marking.ts
 ┃ ┃ ┣ 📂api # 백엔드와 상호작용 하는 함수 파일들을 담은 세그먼트
 ┃ ┃ ┣ 📂constants # 도메인에서 사용하는 상수를 담은 세그먼트
 ┃ ┃ ┣ 📂lib # 비즈니스 도메인 로직을 담은 훅, 메소드를 담은 세그먼트
 ┃ ┃ ┣ 📂types # 해당 슬라이스 혹은 상위 레이어에서 사용하는 타입을 담은 세그먼트
 ┃ ┃ ┗ 📂ui # UI와 관련된 모든 것을 담은 세그먼트
 ┣ 📂features
     # 특정 기능을 구현하는 독립적인 단위로 유저와 앱의 상호작용을 이루는 요소의 레이어
 ┣ 📂pages
   # 특정 페이지를 구성하는 컴포넌트들의 레이어
   # 중첩 라우터 구조 형태로 구성
 ┣ 📂shared
     # 여러 곳에서 공통적으로 사용되는 컴포넌트, 상태 관리 저장소, 유틸리티 함수 등을 담은 레이어
 ┣ 📂widgets
     # 재사용 가능한 하위 레이어들의 집합으로 구성된 UI를 담은 레이어
 ┣ 📂mocks
     # 개발 환경에서 사용되는 가짜 데이터 및 API 핸들러
 ┃ ┣ 📂data # msw 목킹용 예제 데이터
 ┃ ┣ 📂handlers # msw 목킹용 api 핸들러
 ┣ 📜declare.ts # TypeScript의 글로벌 타입 선언
 ┣ 📜global.css # 글로벌 CSS 스타일
 ┣ 📜main.tsx # 앱의 시작점으로 렌더링 루트 제공
```

[FSD (Feature Sliced Design)](https://feature-sliced.design/kr/docs) 아키텍쳐의 폴더구조를 사용했습니다.

- Layer
  레이어 구조는 [FSD-레이어](https://feature-sliced.design/kr/docs/get-started/overview#layers) 에서 정의한 레이어 구조를 따릅니다.

- Slice
  사용 한 슬라이스 (비즈니스 도메인) 들은 다음과 같습니다.
  | 슬라이스명 | 주요 기능 | 상세 설명 |
  | ----------- | --------------- | ---------------------------------------------------------------------------------------- |
  | **auth** | 인증, 권한 관리 | 로그인, 로그아웃, 회원가입,이메일 인증, 권한 확인 등 사용자 계정 관리와 관련된 모든 기능 |
  | **follow** | 팔로우 기능 | 사용자 간 팔로우/언팔로우, 팔로워/팔로잉 목록 조회 등 소셜 기능 관련 기능 |
  | **map** | 지도 관련 기능 | 지도 표시, 지도 내 마커 클러스터링 등 지도 관련 기능 |
  | **marking** | 마킹 기능 | 마킹 추가, 조회, 수정 및 삭제 등 마킹 관련 기능 |
  | **profile** | 프로필 관리 | 사용자 프로필 정보 조회, 수정, 업로드 등 개인 정보 관리 기능 |
  | **setting** | 설정 관리 | 닉네임 변경 등과 관련된 유저 정보 설정 관리 기능 |
- Segment
  세그먼트는 [FSD-세그먼트](https://feature-sliced.design/kr/docs/get-started/overview#segments) 에서 정의 된 세그먼트들과 [FSD-타입선언](https://feature-sliced.design/docs/guides/examples/types#business-entities-and-their-cross-references) 에서 정의한 `cross-import` 구조를 통해 동일 레이어 다른 슬라이스 별 타입을 공유 하는 구조로 구성되어 있습니다.
