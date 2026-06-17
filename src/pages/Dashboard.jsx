import KpiStrip from '../components/KpiStrip'
import AgentRoster from '../components/AgentRoster'
import MemoryFeed from '../components/MemoryFeed'
import ClientsTable from '../components/ClientsTable'
import SparkGrid from '../components/SparkGrid'

export default function Dashboard() {
  return (
    <div>
      <KpiStrip />
      <div style={{
        display: 'grid', gridTemplateColumns: '1.6fr 1fr',
        gap: 14, padding: 16, maxWidth: 1500, margin: '0 auto'
      }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ClientsTable />
          <SparkGrid />
        </div>
        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AgentRoster />
          <MemoryFeed />
        </div>
      </div>
    </div>
  )
}
