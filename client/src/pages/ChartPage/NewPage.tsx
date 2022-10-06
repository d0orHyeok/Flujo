import { Helmet } from 'react-helmet-async'
import BaseChartPage from './BaseChartPage'

const NewPage = () => {
  return (
    <>
      <Helmet>
        <title>New Release tracks | Wave</title>
      </Helmet>
      <BaseChartPage
        chart="newrelease"
        title="New Release tracks"
        description="Up-and-coming tracks"
      />
    </>
  )
}

export default NewPage
