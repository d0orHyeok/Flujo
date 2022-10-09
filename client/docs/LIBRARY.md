# **Library**

프로젝트에 사용된 주요 라이브러리 설명입니다.

## [**styled-components**](https://styled-components.com/)

## [**@reduxjs/toolkit**](https://redux-toolkit.js.org/)

## [**axios**](https://axios-http.com/kr/docs/intro)

Promise 기반 HTTP 클라이언트

> Axios instance

```javascript
// 개발서버는 프록시를 사용하고 배포시에는 서버 주소를 사용
const Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/'
      : process.env.REACT_APP_API_URL,
  withCredentials: true,
})

Axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params) // params 직렬화
}
```

> Axios intercepter

```javascript
/**
 * @param {string} accessToken accessToken
 * @returns axios 요청 헤더에 매개변수로 받은 accessToken을 담아주도록 설정
 */
export const interceptWithAccessToken = (accessToken) => {
  // 요청전에 accessToken을 헤더에 담아준다.
  return Axios.interceptors.request.use(
    (config) => {
      return {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${accessToken}` },
      }
    },
    (error) => {
      Promise.reject(error)
    }
  )
}

// AccessToken 재발급에 사용되는 intercepter
Axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401) {
      // 유저인증실패로 요청에 실패한경우
      if (originalRequest.url.includes('/auth/refresh')) {
        return Promise.reject(error)
      } else {
        // refreshToken을 통해 accessToken 요청
        try {
          const response = await Axios.post('/api/auth/refresh')
          const { accessToken } = response.data
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          interceptWithAccessToken(accessToken)
          return axios(originalRequest)
        } catch (error) {
          // refreshToken을 통한 요청도 실패하면 그냥 실패
          return Promise.reject(error)
        }
      }
    }
    return Promise.reject(error)
  }
)
```

## [**fast-average-color**](https://github.com/fast-average-color/fast-average-color)

이미지의 평균 또는 보조색상을 추출해주는 라이브러리

_본 프로젝트에서는 이미지의 배경으로 주색 과 보조색의 gradient로 만드는데 사용_

> [getColorAsync 문서](https://github.com/fast-average-color/fast-average-color/blob/master/docs/api.md#getcolorasyncresource-options)

```javascript
// example
import FastAverageColor from 'fast-average-color'

const fac = new FastAverageColor()

/**
 * @param {string} url 이미지주소
 * @returns 이미지 주색과 보조색
 */
async function getImageColors(url) {
  // 이미지의 평균주색
  const primary = await fac.getColorAsync(url)
  // 이미지의 평균보조색
  const secondary = await fac.getColorAsync(url, {
    algorithm: 'dominant',
  })
  return { primary, secondary }
}
```

  <br/>

## [**music-metadata-browser**](https://github.com/Borewit/music-metadata-browser)

모든 오디오 형식과 태그 헤더를 지원하는 메타데이터 파서

```javascript
// example
import * as mmb from 'music-metadata-browser'

/**
 * @param {string} music 음악파일주소, url
 * @param {File} music 음악파일
 * @returns 음악 메타데이터
 */
async function getMusicMetadata(music) {
  if (typeof music === 'string') {
    return mmb.parseBlob(music)
  } else {
    return mmb.fetchFromUrl(music)
  }
}
```

  <br/>

## [**react-dnd**](https://react-dnd.github.io/react-dnd/about)

Drag & Drop 라이브러리: [사용예시](https://react-dnd.github.io/react-dnd/examples)

_본 프로젝트에서는 플레이리스트를 편집과정에서 음악순서를 바꾸는데 사용_

> Drag & Drop 사용전 Provider 적용

```javascript
// App.ts, 리액트 앱
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  )
}
export default App
```

  <br/>

## [**react-intersection-observer**](https://github.com/thebuilder/react-intersection-observer)

DOM element가 viewport에 들어오거나 나갈 때 알려주는 라이브러리

_본 프로젝트에서는 페이지 스크롤 최하단에서 데이터를 추가요청할 때 사용했다_

```javascript
// example
import { InView } from 'react-intersection-observer'

const Component = () => (
  <InView as="div" onChange={(inView, entry) => console.log('Inview:', inView)}>
    <h2>Plain children are always rendered. Use onChange to monitor state.</h2>
  </InView>
)

export default Component
```

  <br/>

## [**wavesurfer.js**](https://wavesurfer-js.org/)

오디오파형을 시각화해주는 라이브러리

_본 프로젝트에서는 음악업로드시 미리 파형을 분석하고 데이터베이스에 저장하여 사용하였다. [문서](https://wavesurfer-js.org/faq/)_

```javascript
// Example how to use in React
import React, { useEffect, useRef, useCallback } from 'react'

const Waveform = ({ audio }) => {
  const containerRef = useRef()
  const waveSurferRef = useRef()

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
    })
    waveSurfer.load(audio)
    waveSurferRef.current = waveSurfer

    return () => {
      waveSurfer.destroy()
    }
  }, [setWavesurfer])

  return <div ref={containerRef}></div>
}
```
