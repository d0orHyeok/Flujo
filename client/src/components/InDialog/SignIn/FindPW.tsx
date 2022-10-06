import { Button, TextField } from '@components/Common'
import React, { useState, useCallback } from 'react'
import * as S from './Find.style'
import { findSigninInfo } from '@api/userApi'
import Reload from '@components/Loading/Reload'

const FindPW = () => {
  const [username, setUsername] = useState('')
  const [result, setResult] = useState<string>()
  const [loading, setLoading] = useState(false)

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setUsername(value)
    },
    []
  )

  const handleClickFind = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const response = await findSigninInfo({ username })
        const result = response.data
        if (result?.email) {
          setResult(result.email)
        } else {
          setResult('none')
        }
      } catch (error) {
        setResult('none')
      } finally {
        setLoading(false)
      }
    },
    [username]
  )

  return (
    <S.Wrapper>
      <S.Title>Find Password</S.Title>
      <S.Content>
        <h2 className="content-title">
          Please enter the username
          <br />
          you want to find the password.
        </h2>
        <TextField
          type="text"
          placeholder="Username"
          autoComplete="off"
          id="username"
          style={{ width: '90%', margin: '10px 0' }}
          value={username}
          onChange={handleChangeInput}
          error={result === 'none'}
          errorText="Username not found"
        />
        {!loading ? (
          <Button className="content-btn" onClick={handleClickFind}>
            Find
          </Button>
        ) : (
          <Reload size={40} />
        )}
        {result === 'none' || !result ? null : (
          <S.ResultBox>
            <h2 className="result-title">
              <pre>{`Password change link has been sended to E-mail\n"${result}"`}</pre>
            </h2>
          </S.ResultBox>
        )}
      </S.Content>
    </S.Wrapper>
  )
}

export default FindPW
