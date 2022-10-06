import { convertTimeToString } from '@api/functions'
import { IMusic } from '@appTypes/music.type'
import { EmptyMusicCover } from '@styles/EmptyImage'
import React from 'react'
import { useDrop, useDrag } from 'react-dnd'
import { RiCloseCircleFill } from 'react-icons/ri'
import styled from 'styled-components'

const StlyedLi = styled.li`
  cursor: move;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.1)};
  }
`

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 3px;

  & .item-shrink {
    flex-shrink: 0;
  }

  & .item-imageBox {
    width: 30px;
    height: 30px;
    margin-right: 15px;

    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .item-title {
    margin-right: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .item-button {
    margin-left: 10px;
    padding: 0;
    width: 20px;
    height: 20px;
    font-size: 16px;
    line-height: 16px;
    border: none;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    background-color: rgba(0, 0, 0, 0);
  }
`

interface Item {
  id: number
  originalIndex: number
}

interface DndTrackCardProps {
  id: number
  music: IMusic
  moveCard: (id: number, to: number) => void
  findCard: (id: number) => { index: number }
  onDelete?: React.MouseEventHandler<HTMLButtonElement>
}

const DndTrackCard = ({
  id,
  music,
  moveCard,
  findCard,
  onDelete,
}: DndTrackCardProps) => {
  const originalIndex = findCard(id).index
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'card',
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item
        const didDrop = monitor.didDrop()
        if (!didDrop) {
          moveCard(droppedId, originalIndex)
        }
      },
    }),
    [id, originalIndex, moveCard]
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'card',
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id)
          moveCard(draggedId, overIndex)
        }
      },
    }),
    [findCard, moveCard]
  )

  const opacity = isDragging ? 0 : 1

  return (
    <StlyedLi ref={(node) => drag(drop(node))} style={{ opacity }}>
      <TrackItem>
        <div className="item-imageBox item-shrink">
          {music.cover ? (
            <img className="img" src={music.cover} alt="" />
          ) : (
            <EmptyMusicCover className="img" />
          )}
        </div>
        <div className="item-title">{`${
          music.user.nickname || music.user.username
        } - ${music.title}`}</div>
        <div className="item-duration item-shrink">
          {convertTimeToString(music.duration)}
        </div>
        <button className="item-button item-shrink" onClick={onDelete}>
          {<RiCloseCircleFill className="icon close" />}
        </button>
      </TrackItem>
    </StlyedLi>
  )
}

export default React.memo(DndTrackCard)
