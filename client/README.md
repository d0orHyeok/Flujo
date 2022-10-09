# [**Wave**](https://wave-d0orhyeok.netlify.app/) · [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/d0orHyeok/wave-client-production/blob/master/LICENSE) <img src="https://img.shields.io/badge/TypeScript-3178C6?flat&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?flat&logo=React&logoColor=black"> <img src="https://img.shields.io/badge/Redux-764ABC?flat&logo=Redux&logoColor=white"> <img src="https://img.shields.io/badge/styled-components-DB7093?flat&logo=styled-components&logoColor=white">

Wave, 음악공유 스트리밍 사이트입니다.

- React, TypeScript사용한 프로젝트입니다.
- SoundCloud를 참고하여 개발한 사이트입니다.
- [**View website: Wave**](https://wave-d0orhyeok.netlify.app/)
- **Server status**
  | Client | API Server |
  | --- | --- |
  | ![Netlify Status](https://api.netlify.com/api/v1/badges/92c9ca1c-7424-450e-999b-9707876a5883/deploy-status) | ![Heroku](https://heroku-badge.herokuapp.com/?app=wave-nestjs) |

## **Installation**

프로젝트 클론 후 패키지 설치를 진행하고 환경변수를 등록하고 실행하세요.

### Clone Project

```sh
git clone [REPO_URL] [DIR]
```

### Install development dependencies:

```sh
npm install
# or
yarn add

```

### Create .env

```sh
# .env
REACT_APP_API_URL = [YOUR_BACKEND_URI]
```

## **React App Structure**

```bash
├─api       # API 요청함수 파일
│  ├─functions  # React가 아닌 ts, js 함수들
│  └─Hooks      # Custom Hooks
├─assets    # 폰트, 데이터 등
├─components
│  └─Common     # 의존성 없는 컴포넌트
├─pages     # router에 들어갈 페이지 컴포넌트
├─redux     # redux toolkit
│  ├─context    # Providers
│  ├─features   # Slices
│  └─thunks     # Asyncthunks
├─routes    # Router & HOC
├─styles    # Styled components settings & css
└─type      # Types & interfaces
```

## **Documentation**

### [**Library**](https://github.com/d0orHyeok/wave-client-production/blob/master/docs/LIBRARY.md)

개발에 사용된 주요 라이브러리에 대한 설명

### [**API Reference**](https://github.com/d0orHyeok/wave-nestjs-server)

Wave에서 사용된 API 코드와 설명을 위 링크의 레퍼지토리에서 확인할 수 있습니다.

## **Author**

- [d0orHyeok](https://github.com/d0orHyeok) - JangHyeok Kim
- Email
  - d0oR.hyeok@gmail.com
  - d0or_hyeok@naver.com

## **License**

Wave is [MIT licensed](https://github.com/d0orHyeok/wave-client-production/blob/master/LICENSE).
