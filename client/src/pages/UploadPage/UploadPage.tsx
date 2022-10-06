import React, { useCallback, useEffect, useState } from 'react'
import * as S from './UploadPage.style'
import { Helmet } from 'react-helmet-async'
import UploadMusic from './UploadMusic'
import { useSetMinWidth } from '@redux/context/appThemeProvider'

const UploadPage = () => {
  const [musicFiles, setMusicFiles] = useState<FileList>()
  const setMinWidth = useSetMinWidth()

  const handleChangeFiles = useCallback((files: FileList) => {
    if (files.length) {
      setMusicFiles(files)
    }
  }, [])

  const handleResetFiles = useCallback(() => {
    setMusicFiles(undefined)
    const inputEl = document
      .getElementsByTagName('input')
      .namedItem('music-upload')
    if (inputEl && inputEl.files) {
      const dataTranster = new DataTransfer()
      inputEl.files = dataTranster.files
    }
  }, [])

  useEffect(() => {
    setMinWidth('480px')
    return () => {
      setMinWidth()
    }
  }, [setMinWidth])

  return (
    <>
      <Helmet>
        <title>Upload your music | Wave</title>
      </Helmet>
      <S.Wrapper
        style={{ alignItems: musicFiles?.length ? 'flex-start' : 'center' }}
      >
        <S.StyledDropzone
          hidden={musicFiles?.length ? true : false}
          onChangeFiles={handleChangeFiles}
        />
        <UploadMusic files={musicFiles} resetFiles={handleResetFiles} />
      </S.Wrapper>
    </>
  )
}

export default React.memo(UploadPage)
