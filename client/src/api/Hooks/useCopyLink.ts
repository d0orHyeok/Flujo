import { useAlert } from '@redux/context/alertProvider'
import { useCallback } from 'react'

function useCopyLink() {
  const openAlert = useAlert()

  const copyLink = useCallback(
    (link: string, message?: { success: string; fail: string }) => {
      if (navigator.clipboard) {
        // (IE는 사용 못하고, 크롬은 66버전 이상일때 사용 가능합니다.)
        navigator.clipboard
          .writeText(link)
          .then(() => {
            openAlert(
              !message ? '클립보드에 복사되었습니다.' : message.success,
              { severity: 'success' }
            )
          })
          .catch(() => {
            openAlert(!message ? '복사를 다시 시도해주세요.' : message.fail, {
              severity: 'error',
            })
          })
      } else {
        // 흐름 2.
        if (!document.queryCommandSupported('copy')) {
          return alert('복사하기가 지원되지 않는 브라우저입니다.')
        }

        // 흐름 3.
        const textarea = document.createElement('textarea')
        textarea.value = link
        textarea.style.top = '0'
        textarea.style.left = '0'
        textarea.style.position = 'fixed'

        // 흐름 4.
        document.body.appendChild(textarea)
        // focus() -> 사파리 브라우저 서포팅
        textarea.focus()
        // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
        textarea.select()
        // 흐름 5.
        document.execCommand('copy')
        // 흐름 6.
        document.body.removeChild(textarea)
        openAlert(!message ? '클립보드에 복사되었습니다.' : message.success, {
          severity: 'success',
        })
      }
    },
    [openAlert]
  )

  return copyLink
}

export default useCopyLink
