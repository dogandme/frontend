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

## 기능

### 로그인 페이지 (/login)

- 이메일과 비밀번호를 입력하여 로그인합니다.

<img width="378" height="816" alt="스크린샷 2025-01-14 오후 4 39 28" src="https://github.com/user-attachments/assets/0cf801e2-d282-4e8a-accc-63f600076894" />

### 이메일로 회원가입 (/sign-up)

- 이메일과 비밀번호를 설정할 수 있습니다.
- 사용자는 입력한 이메일로 코드를 받게 됩니다.
- 이메일로 받은 코드를 입력하면, 이메일이 인증됩니다.

![이메일로 회원가입](https://github.com/user-attachments/assets/7064f315-569f-4c70-903e-3aed3ee30f9a)


### 기본정보 등록 (/sign-up/user-info)

- 닉네임, 성별, 연령대, 동네를 설정합니다.

![기본정보 등록](https://github.com/user-attachments/assets/a213cd2b-438a-4097-bc67-af8444da005e)


### 강아지 정보 등록 (/sign-up/pet-info)

- 강아지 이름, 종, 성격, 간단한 소개를 설정합니다.

![강아지 등록](https://github.com/user-attachments/assets/1c7effcf-22d7-4f04-b3f9-f642dd0c7f86)

### 동네 마킹 (/map)

![내위치](https://github.com/user-attachments/assets/8ee8d403-6bf1-4dc6-966a-80eb3580f6ff)

- 내 위치를 중심으로 하여 지도에 저장 된 마킹들을 조회 할 수 있습니다.

![동네마킹 서치 ](https://github.com/user-attachments/assets/d6ac41ba-63a8-4bb2-8d56-e504ea2d33ef)

- 현 지도에서 재검색을 통해 검색된 지도 바운더리 안에 존재하는 마킹들을 지도에서 마커, 바텀시트에서 썸네일 리스트 형태로 조회 가능 합니다.

![내 마킹 저장](https://github.com/user-attachments/assets/bb0b1de7-391f-4ce6-a374-581b9e4f4381)
![내 마킹 임시 저장](https://github.com/user-attachments/assets/bf4f301c-1dd9-43ee-b023-51b8272445ef)

- 마킹 하기 버튼을 눌러 원하는 위치에 자신의 반려견과 함께 한 사진과 내용을 저장, 임시저장 할 수 있습니다.

### 이 장소 마킹 (/map/place)

![동네마킹 - 이 장소 마킹](https://github.com/user-attachments/assets/0d317034-9981-48b9-aa8d-c825d50a2156)

- `/map` 경로에서 지도에 있는 마커 혹은 바텀시트에 존재하는 썸네일을 클릭하여 해당 마커가 존재하는 범위 100m 내에 존재하는 마킹들이 모여있는 이 장소 마킹들을 조회 할 수 있습니다.

 이 장소 마킹에선 다음과 같은 정보들을 포함합니다.


 - 유저 닉네임
 - 강아지 이름
 - 해당 장소에 마킹 된 사진 (최대 5장)
 - 좋아요, 북마크 개수
 - 마킹 내용
 - 마킹 일

 이 장소 마킹에선 다음과 같은 기능을 사용 할 수 있습니다.

 - 마킹 좋아요
 - 마킹 북마크
 - 유저 팔로우 신청 및 취소
 - 유저 프로필 페이지 접근

### 내 활동 (/map)

![내 활동 ](https://github.com/user-attachments/assets/5bae0567-29ef-46bc-b374-9e32ac78ad84)

- 내가 좋아요 , 북마크 한 게시글들을 확인 할 수 있습니다. 

### 내 마킹 (/map)

![내 마킹](https://github.com/user-attachments/assets/2aacee22-da02-4ed0-bc5d-998e7574140c)
![내 마킹 수정](https://github.com/user-attachments/assets/4a6d1dd9-1dcb-4801-ab11-3cda212b13a6)


- 내 마킹 보기 버튼을 눌러 내가 저장하였거나 임시 저장한 마킹들의 리스트를 볼 수 있습니다.
- 내 마킹을 수정하거나 삭제하는 기능이 사용 할 수 있습니다.
- 임시 저장된 마킹을 클릭하면 임시 저장 된 마킹들이 모여있는 페이지로 이동 합니다.

### 임시 저장된 마킹 (/temporary-marking)

![임시저장 마킹](https://github.com/user-attachments/assets/e0d130bf-c90a-492a-aa58-16f802e979d8)

- 임시 저장된 마킹을 모아둔 페이지입니다. 해당 페이지에서 마킹을 삭제하거나 저장하는 기능을 사용 할 수 있습니다.

### 프로필 (/@{nickname})

![프로필 페이지](https://github.com/user-attachments/assets/f88890ab-3ddd-465f-9809-82f8b934edf7)

- 내 정보와 마킹들이 모여있는 프로필 페이지 입니다.
- 임시 저장된 마킹 정보는 본인 외의 계정에선 나타나지 않습니다.

### 팔로잉, 팔로우 페이지 (/@{nickname}/followings , followers)

![팔로잉팔로우 진입](https://github.com/user-attachments/assets/98ae6206-9ed1-42c1-a9c9-57ea20f45c77)
![팔로잉팔로우 기능](https://github.com/user-attachments/assets/00005b7b-5541-451c-a98b-e94c36d10387)


- 팔로잉,팔로우 페이지에선 나를 팔로잉 하는 유저와 내가 팔로잉 하고 있는 유저를 확인 할 수 있습니다.
- 해당 페이지에서 특정 유저를 팔로잉 하거나 팔로잉 취소, 팔로워 삭제 등의 기능을 사용 할 수 있습니다.

![팔로잉팔로우 프로필 페이지 진입](https://github.com/user-attachments/assets/92393380-5940-4b4f-9ba7-26f3204141e7)

- 타 유저 프로필 페이지에서도 팔로잉, 팔로잉 취소 기능을 사용 할 수 있습니다.











### 내 정보 수정 (/setting/edit-info)

- 닉네임, 성별, 나이대, 동네를 변경할 수 있습니다.

![내 정보 수정](https://github.com/user-attachments/assets/e79b545f-5b56-4dac-ab31-807ebb0f90fc)

### 계정 관리 (/setting/manage-account)

- 비밀번호를 변경할 수 있습니다.
- 탈퇴할 수 있습니다.

![계정관리](https://github.com/user-attachments/assets/2c44eaa9-3cea-4180-818c-6fdc2eb60f16)
