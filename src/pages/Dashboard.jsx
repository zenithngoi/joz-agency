import KpiStrip from '../components/KpiStrip'
import AgentRoster from '../components/AgentRoster'
import MemoryFeed from '../components/MemoryFeed'
import ClientsTable from '../components/ClientsTable'
import SparkGrid from '../components/SparkGrid'
import AdsBook from '../components/AdsBook'
import LeadsFunnel from '../components/LeadsFunnel'
import ContentPipeline from '../components/ContentPipeline'

export default function Dashboard() {
  return (
    <div>
      {/* KPI strip — full width */}
      <KpiStrip />

      <div style={{ padding:16, maxWidth:1600, margin:'0 auto', display:'flex', flexDirection:'column', gap:14 }}>

        {/* ROW 1 — clients table + agent roster */}
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14 }}>
          <ClientsTable />
          <AgentRoster />
        </div>

        {/* ROW 2 — content pipeline kanban, full width */}
        <ContentPipeline />

        {/* ROW 3 — ads book (wide) + right col: funnel + memory */}
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14 }}>
          <AdsBook />
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <LeadsFunnel />
            <MemoryFeed />
          </div>
        </div>

        {/* ROW 4 — sparklines, full width */}
        <SparkGrid />

      </div>
    </div>
  )
}
