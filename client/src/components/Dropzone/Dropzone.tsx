import React, { useCallback, useRef, useState } from 'react'
import * as S from './Dropzone.style'

interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  onChangeFiles?: (files: FileList) => void
  multiple?: boolean
  children?: React.ReactNode
}

const Dropzone = ({
  onChangeFiles,
  multiple,
  children,
  className,
  ...props
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [dragging, setDragging] = useState(false)

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [])

  const handlePreventDragEvent = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setDragging(true)
    },
    []
  )

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragging(false)
  }, [])

  const getAudioFiles = useCallback(
    (files: FileList) => {
      //  변경사항을 저장할 변수
      const dataTransfer = new DataTransfer()

      // FileList 데이터를 배열로 변환하고 오디오파일만 추가
      const fileArray = Array.from(files)
      if (multiple) {
        fileArray.forEach((file) => {
          if (file.type.includes('audio')) {
            return
          }
          dataTransfer.items.add(file)
        })
      } else {
        const audioFile = fileArray.find((f) => f.type.includes('audio'))
        audioFile && dataTransfer.items.add(audioFile)
      }

      return dataTransfer.files
    },
    [multiple]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setDragging(false)

      const { files } = event.dataTransfer

      const audioFiles = getAudioFiles(files)

      if (inputRef.current) {
        inputRef.current.files = audioFiles
      }
      onChangeFiles && onChangeFiles(audioFiles)
    },
    [getAudioFiles, onChangeFiles]
  )

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.currentTarget
      if (!files) {
        return
      }

      const audioFiles = getAudioFiles(files)

      // 변경된 파일목록으로 교체
      event.currentTarget.files = audioFiles
      onChangeFiles && onChangeFiles(audioFiles)
    },
    [getAudioFiles, onChangeFiles]
  )

  return (
    <S.DropzoneRoot {...props} className={`dropzone-root ${className}`}>
      <input
        ref={inputRef}
        id="music-upload"
        type="file"
        accept="audio/*"
        hidden={true}
        multiple={multiple}
        onChange={handleChangeInput}
      />
      <S.DropzonePaper
        className="dropzone-paper"
        onDragEnter={handlePreventDragEvent}
        onDragLeave={handleDragLeave}
        onDragOver={handlePreventDragEvent}
        onDrop={handleDrop}
        dragging={dragging}
      >
        <span className="dropzone-paper-content">
          {'Drag & Drop your music'}
        </span>
        <S.FileBrowser
          className="dropzone-paper-fileBrowser"
          onClick={handleClick}
        >
          or choose file to upload
        </S.FileBrowser>
        {children}
      </S.DropzonePaper>
    </S.DropzoneRoot>
  )
}

export default Dropzone
