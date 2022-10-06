import { Button, TextField } from '@components/Common'
import React, { useState, useCallback } from 'react'
import * as S from './Find.style'
import { emailRegex } from '@pages/RegisterPage/regex'
import { findSigninInfo } from '@api/userApi'
import Reload from '@components/Loading/Reload'

const FindID = () => {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<string[]>()
  const [loading, setLoading] = useState(false)

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
      if (!emailRegex.test(email)) {
        return alert('Please check email address')
      }

      setLoading(true)
      try {
        const response = await findSigninInfo({ email })
        const usernames: null | string[] = response.data
        setResult(usernames || [])
      } catch (error) {
        alert('Error to find username')
      } finally {
        setLoading(false)
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
        {!loading ? (
          <Button className="content-btn" onClick={handleClickFind}>
            Find
          </Button>
        ) : (
          <Reload size={40} />
        )}
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
