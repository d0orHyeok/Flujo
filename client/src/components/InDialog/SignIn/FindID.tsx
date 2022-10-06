import { Button, TextField } from '@components/Common'
import React, { useState, useCallback } from 'react'
import * as S from './Find.style'
import { emailRegex } from '@pages/RegisterPage/regex'
import { findSigninInfo } from '@api/userApi'

const FindID = () => {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<string[]>()

  const handleChangeEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setEmail(value)
    },
    []
  )

  const handleClickFind = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      try {
        const response = await findSigninInfo({ email })
        const usernames: null | string[] = response.data
        setResult(usernames || [])
      } catch (error) {
        return
      }
    },
    [email]
  )

  return (
    <S.Wrapper>
      <S.Title>Find Username</S.Title>
      <S.Content>
        <h2 className="content-title">
          Please enter the email you used to sign up.
        </h2>
        <TextField
          type="text"
          placeholder="Email"
          autoComplete="off"
          id="email"
          style={{ width: '90%', margin: '10px 0' }}
          value={email}
          onChange={handleChangeEmail}
          error={Boolean(email.length && !emailRegex.test(email))}
          errorText="Invalid email"
        />
        <Button className="content-btn" onClick={handleClickFind}>
          Find
        </Button>
        <S.ResultBox>
          <h2 className="result-title">
            {!result
              ? 'Find Result'
              : `Find ${result.length} username${result.length > 1 ? 's' : ''}`}
          </h2>
          {result?.length ? <pre>{result.map((id) => `${id}\n`)}</pre> : null}
        </S.ResultBox>
      </S.Content>
    </S.Wrapper>
  )
}

export default FindID
