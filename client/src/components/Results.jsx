import React from 'react'
import highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Typography } from '@material-ui/core'

const Results = ({ proposals, name, proposalNumber }) => {
  const data = Object.entries(proposals).map(
    ([_, { proposalName: name, votes }]) => ({
      name,
      y: votes,
    }),
  )
  const selected = proposals[proposalNumber]

  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: null,
    },
    series: [
      {
        name,
        data,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  }

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <Typography color="textSecondary" variant="h5">
        Results
      </Typography>
      <HighchartsReact {...{ highcharts, options }} />
      <Typography color="textSecondary">You voted for: {selected.proposalName}</Typography>
    </div>
  )
}

export default Results
