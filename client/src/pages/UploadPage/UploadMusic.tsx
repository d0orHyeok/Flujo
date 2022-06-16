import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as S from './UploadMusic.style'
import * as mmb from 'music-metadata-browser'
import UploadHead from '@pages/UploadPage/UploadHead'
import MusicBasicInfo, {
  IMusicBasicInfoHandler,
} from '@components/ExtractMusic/MusicBasicInfo/MusicBasicInfo'
import MusicMetadata, {
  IMusicMetadataHandler,
} from '@components/ExtractMusic/MusicMetadata/MusicMetadata'
import { useAlert } from '@redux/context/alertProvider'
import { useNavigate } from 'react-router-dom'
import { uploadMusic } from '@api/musicApi'
import { IMusicMetadata } from '@components/ExtractMusic/extractMetadata.types'
import ExtractMusicNav from '@components/ExtractMusic/ExtractMusicNav/ExtractMusicNav'

interface UploadMusicProps {
  files?: FileList
  resetFiles?: () => void
}

const UploadMusic = ({ files, resetFiles }: UploadMusicProps) => {
  const openAlert = useAlert()
  const navigate = useNavigate()

  const editNavItems = ['Basic Info', 'Metadata']

  const editBasicInfoRef = useRef<IMusicBasicInfoHandler>(null)
  const editMetadataRef = useRef<IMusicMetadataHandler>(null)

  const [editNavIndex, setEditNavIndex] = useState(0)
  const [musicMetadata, setMusicMetadata] = useState<IMusicMetadata>()

  const uploadFile = () => {
    if (!files || !musicMetadata) {
      // 파일과 메타데이터가 없다면 재업로드 요청
      resetFiles && resetFiles()
      return
    }

    const basicInfoData = editBasicInfoRef.current?.getData()
    const metadataData = editMetadataRef.current?.getData()

    if (!(basicInfoData && metadataData)) {
      // 데이터를 가져오지 못한경우 업로드 취소
      setEditNavIndex(0)
      return
    }
    openAlert('업로드를 시작합니다.', { severity: 'info' })

    const { cover, ...musicData } = basicInfoData
    const { title, genre, description } = musicData
    const data = {
      ...musicData,
      duration: musicMetadata.duration,
      metadata: { title, genre, description, ...metadataData },
    }

    // 음악파일, 커버이미지, 음악데이터 저장
    const formData = new FormData()
    formData.append('musics', files[0])
    if (cover) {
      formData.append('covers', cover)
    }
    formData.append(
      'datas',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    )

    // 서버에 업로드 요청
    uploadMusic(formData)
      .then(() => {
        openAlert('업로드에 성공하였습니다.')
        if (window.confirm('계속해서 업로드 하시겠습니까?')) {
          resetFiles && resetFiles()
        } else {
          navigate('/')
        }
      })
      .catch(() => openAlert('업로드에 실패하였습니다', { severity: 'error' }))
  }

  const handleClickCancel = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to stop your upload? Any unsaved changes will be lost.'
      )
    ) {
      setEditNavIndex(0)
      setMusicMetadata(undefined)
      resetFiles && resetFiles()
    }
  }, [resetFiles])

  const extractMetadata = useCallback(async () => {
    if (!files?.length) {
      return
    }
    try {
      const md = await mmb.parseBlob(files[0], {
        duration: true,
      })
      const newMetadata = {
        ...md.common,
        duration: md.format.duration,
      }
      setMusicMetadata(newMetadata)
    } catch (error) {
      console.error('Error to get metadata', error)
    }
  }, [files])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // 표준에 따라 기본 동작 방지
      event.preventDefault()
      // Chrome에서는 returnValue 설정이 필요함
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    extractMetadata()
  }, [extractMetadata])

  return (
    <>
      <S.Container style={{ display: files ? 'block' : 'none' }}>
        <UploadHead files={files} />
        <S.EditMain className="editMain">
          <ExtractMusicNav
            navItems={editNavItems}
            navIndex={editNavIndex}
            handleClickNav={setEditNavIndex}
          />
          <MusicBasicInfo
            metadata={musicMetadata}
            ref={editBasicInfoRef}
            style={{ display: editNavIndex === 0 ? 'block' : 'none' }}
          />
          <MusicMetadata
            metadata={musicMetadata}
            ref={editMetadataRef}
            style={{ display: editNavIndex === 1 ? 'block' : 'none' }}
          />
          <div>
            <button onClick={handleClickCancel}>Cancel</button>
            <button onClick={uploadFile}>Save</button>
          </div>
        </S.EditMain>
      </S.Container>
    </>
  )
}

export default UploadMusic
