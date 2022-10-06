import { IMusic } from '@appTypes/music.type'
import { IPlaylist } from '@appTypes/playlist.type'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import InteractionButtons, {
  InteractionButtonsProps,
} from './InteractionButtons'
import InteractionCount, { InteractionCountProps } from './InteractionCount'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  * > & {
    flex-shrink: 0;
  }
`

interface InteractionBarProps
  extends InteractionButtonsProps,
    InteractionCountProps,
    React.HTMLAttributes<HTMLDivElement> {}

const InteractionBar = ({
  target,
  setTarget,
  visibleOption,
  mediaSize,
  disableEdit,
  ...props
}: InteractionBarProps) => {
  const [temp, setTemp] = useState<IMusic | IPlaylist>()

  useEffect(() => {
    if (!setTarget) {
      setTemp(target)
    } else {
      setTemp(undefined)
    }
  }, [setTarget, target])

  return (
    <Container {...props}>
      <InteractionButtons
        className="interactionButtons"
        target={temp || target}
        setTarget={setTarget ? setTarget : setTemp}
        mediaSize={mediaSize}
        disableEdit={disableEdit}
      />
      <InteractionCount
        className="interactionCount"
        target={temp || target}
        visibleOption={visibleOption}
      />
    </Container>
  )
}

export default InteractionBar
