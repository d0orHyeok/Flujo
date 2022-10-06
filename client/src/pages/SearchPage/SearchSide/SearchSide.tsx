import React from 'react'
import styled from 'styled-components'
import { BsSoundwave, BsSearch } from 'react-icons/bs'
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri'
import { IoMdPeople } from 'react-icons/io'
import { Link } from 'react-router-dom'

const Item = styled.li`
  position: relative;
  font-size: 14px;
  padding: 0 8px;
  margin-right: 15px;

  & a {
    display: flex;
    align-items: center;
    height: 30px;
  }

  & .icon {
    font-size: 16px;
  }
  & .name {
    margin-left: 8px;
  }

  &.select {
    color: ${({ theme }) => theme.colors.primaryText};
    background-color: ${({ theme }) => theme.colors.primaryColor};

    &::after {
      content: '';
      position: absolute;
      transform: translate(50%, -50%) rotate(45deg);
      width: 21px;
      height: 21px;
      background-color: inherit;
      top: 50%;
      right: 0;
    }
  }
`

interface SearchSideProps extends React.HTMLAttributes<HTMLUListElement> {
  keyward?: string
  query?: string
  onQueryChange: (...args: any[]) => any
}

const items = [
  { query: 'query', name: 'Everything', icon: <BsSearch className="icon" /> },
  { query: 'tracks', name: 'Tracks', icon: <BsSoundwave className="icon" /> },
  {
    query: 'playlists',
    name: 'Playlists',
    icon: <RiCheckboxMultipleBlankFill className="icon" />,
  },
  { query: 'people', name: 'People', icon: <IoMdPeople className="icon" /> },
]

const SearchSide = ({
  keyward,
  query,
  onQueryChange,
  ...props
}: SearchSideProps) => {
  const handleClickLink =
    (query: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      window.history.pushState('', '', `/search?${query}=${keyward}`)
      onQueryChange && onQueryChange(query)
    }

  return (
    <ul {...props}>
      {items.map((item, index) => (
        <Item
          key={index}
          className={query === item.query ? 'select' : undefined}
        >
          <Link
            to={`/search?${item.query}=${keyward}`}
            onClick={handleClickLink(item.query)}
          >
            {item.icon}
            <span className="name">{item.name}</span>
          </Link>
        </Item>
      ))}
    </ul>
  )
}

export default SearchSide
