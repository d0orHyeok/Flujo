import * as S from './RegisterPage.style'
import * as regex from './regex'
import React, { useState } from 'react'
import TextField from '@components/Common/TextField'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@redux/context/alertProvider'
import { userSignUp } from '@api/userApi'
import { Helmet } from 'react-helmet-async'
import CheckBox from '@components/Common/Checkbox'
import RegisterLoading from './RegisterLoading'

const RegisterPage = () => {
  const navigate = useNavigate()
  const openAlert = useAlert()

  const [registerInput, setRegisterInput] = useState({
    username: '',
    password: '',
    passwordConfirmed: '',
    email: '',
    nickname: '',
  })
  // NORMAL: 0, ERROR: -1, VALIDATE: 1
  const [inputValidate, setInputValidate] = useState({
    username: 0,
    password: 0,
    passwordConfirmed: 0,
    email: 0,
    nickname: 0,
  })
  const [checkbox, setCheckbox] = useState({
    term1: false,
    term2: false,
  })
  const [loading, setLoading] = useState(false)

  const { username, password, passwordConfirmed, email, nickname } =
    registerInput

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.currentTarget
    setCheckbox({ ...checkbox, [id]: checked })
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget
    setRegisterInput({ ...registerInput, [id]: value })
    validationCheck(id, value.trim())
  }

  const validationCheck = (id: string, value: string) => {
    let validate = 0
    if (value.length) {
      switch (id) {
        case 'username':
          validate =
            regex.usernameRegex.test(value) &&
            !regex.notUsernameRegex.test(value)
              ? 1
              : -1
          break
        case 'password':
          validate = regex.passwordRegex.test(value) ? 1 : -1
          break
        case 'email':
          validate = regex.emailRegex.test(value) ? 1 : -1
          break
        case 'nickname':
          validate = regex.nicknameRegex.test(value) ? 1 : -1
          break
        case 'passwordConfirmed':
          validate = value === password ? 1 : -1
          break
      }
    }
    setInputValidate({ ...inputValidate, [id]: validate })
  }

  const handleClickRegister = async () => {
    // 회원가입에 필요한 정보를 확인하고 올바르면 회원가입을 요청

    // 입력한 정보가 올바른지 확인하고 바르지 않으면 focus
    const validateEntries = Object.entries(inputValidate)
    const notValidateIndex = validateEntries.findIndex((validate) => {
      if (validate[0] === 'nickname') {
        return validate[1] === -1
      }
      return validate[1] !== 1
    })
    if (notValidateIndex !== -1) {
      const focusTargetId = validateEntries[notValidateIndex][0]

      document.getElementById(focusTargetId)?.focus()
      return setInputValidate({ ...inputValidate, [focusTargetId]: -1 })
    }

    const checkboxEntries = Object.entries(checkbox)
    const notCheckedIndex = checkboxEntries.findIndex(
      (checkbox) => checkbox[1] === false
    )

    // 각 항목에 동의했는지 확인
    if (notCheckedIndex !== -1) {
      const focusTargetId = checkboxEntries[notCheckedIndex][0]

      document.getElementById(focusTargetId)?.focus()
      return alert(
        `${
          focusTargetId[0].toUpperCase() + focusTargetId.slice(1)
        } 항목에 동의해주세요.`
      )
    }

    // 서버에 회원가입 요청
    const registerInfo = {
      username,
      password,
      email,
      nickname,
    }

    try {
      setLoading(true)
      await userSignUp(registerInfo)
      console.log('Register Success')
      navigate('/')
      openAlert('Successfully sign up ', { severity: 'success' })
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setRegisterInput({ ...registerInput, username: '' })
        setInputValidate({ ...inputValidate, username: -1 })
        document.getElementById('username')?.focus()
        alert('이미 존재하는 아이디입니다.')
      } else {
        alert('회원가입 실패')
      }
      console.error('Register Error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Wave</title>
      </Helmet>
      {!loading ? <></> : <RegisterLoading />}
      <S.Wrapper>
        <h1 className="register-title">Sign Up</h1>
        <S.InputArea>
          <TextField
            className="register-input"
            type="text"
            autoComplete="off"
            id="username"
            placeholder="ID*"
            value={username}
            onChange={handleChangeInput}
            success={inputValidate.username === 1}
            error={inputValidate.username === -1}
            errorText=""
          />
          <TextField
            className="register-input"
            type="password"
            autoComplete="off"
            id="password"
            placeholder="Password*"
            value={password}
            onChange={handleChangeInput}
            success={inputValidate.password === 1}
            error={inputValidate.password === -1}
            errorText="영문자, 숫자를 포함한 6~20자의 비밀번호를 입력해주세요"
          />
          <TextField
            className="register-input"
            type="password"
            autoComplete="off"
            id="passwordConfirmed"
            placeholder="Password Confirmed*"
            value={passwordConfirmed}
            onChange={handleChangeInput}
            success={inputValidate.passwordConfirmed === 1}
            error={inputValidate.passwordConfirmed === -1}
            errorText="비밀번호가 일치하지 않습니다."
          />
          <TextField
            className="register-input"
            type="text"
            autoComplete="off"
            id="email"
            placeholder="Email*"
            value={email}
            onChange={handleChangeInput}
            success={inputValidate.email === 1}
            error={inputValidate.email === -1}
            errorText="올바르지 않은 Email 입니다."
          />
          <TextField
            className="register-input"
            type="text"
            autoComplete="off"
            id="nickname"
            placeholder="Nickname"
            value={nickname}
            onChange={handleChangeInput}
            success={inputValidate.nickname === 1}
            error={inputValidate.nickname === -1}
            errorText="한영, 숫자, _-, 2~20자의 닉네임을 입력해주세요."
          />
          <S.TermBox className="register-term">
            <h2 className="register-term-title">Terms 1</h2>
            <div className="register-term-text">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit,
              sint tempora? Eligendi neque deleniti tempore architecto
              consequatur eius cum odit suscipit veniam! Natus molestiae
              laboriosam nobis ex! Delectus, eligendi! Rerum officia doloremque,
              repudiandae incidunt veniam id et nam soluta nemo provident
              voluptates at temporibus pariatur impedit eum suscipit, laborum
              non numquam quis eaque! Pariatur rerum quae ad distinctio nulla
              maiores ea? Eaque, suscipit. Obcaecati placeat at quas, aperiam
              maiores non quibusdam eligendi, quis omnis ad optio qui.
              Voluptatibus officiis ipsa, nostrum ipsum deleniti quam commodi
              impedit eos. Provident natus rerum delectus, nostrum pariatur
              sunt, consequatur quia, possimus enim blanditiis necessitatibus!
            </div>
            <CheckBox
              id="term1"
              className="term-checkbox"
              checked={checkbox.term1}
              onChange={handleChangeCheckbox}
              textsize={'0.9rem'}
              label={'동의합니다'}
            />
          </S.TermBox>
          <S.TermBox className="register-term">
            <h2 className="register-term-title">Terms 2</h2>
            <div className="register-term-text">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit,
              sint tempora? Eligendi neque deleniti tempore architecto
              consequatur eius cum odit suscipit veniam! Natus molestiae
              laboriosam nobis ex! Delectus, eligendi! Rerum officia doloremque,
              repudiandae incidunt veniam id et nam soluta nemo provident
              voluptates at temporibus pariatur impedit eum suscipit, laborum
              non numquam quis eaque! Pariatur rerum quae ad distinctio nulla
              maiores ea? Eaque, suscipit. Obcaecati placeat at quas, aperiam
              maiores non quibusdam eligendi, quis omnis ad optio qui.
              Voluptatibus officiis ipsa, nostrum ipsum deleniti quam commodi
              impedit eos. Provident natus rerum delectus, nostrum pariatur
              sunt, consequatur quia, possimus enim blanditiis necessitatibus!
            </div>
            <CheckBox
              id="term2"
              className="term-checkbox"
              checked={checkbox.term2}
              onChange={handleChangeCheckbox}
              textsize={'0.9rem'}
              label={'동의합니다'}
            />
          </S.TermBox>
          <S.RegisterButton
            className="register-button"
            onClick={handleClickRegister}
          >
            회원가입
          </S.RegisterButton>
        </S.InputArea>
      </S.Wrapper>
    </>
  )
}

export default React.memo(RegisterPage)
