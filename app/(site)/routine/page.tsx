import Checklist from '@/components/Checklist'

export default function RoutinePage() {
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--t-bg)' }}>
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--t-text-main)' }}>
          Routine
        </h1>
        <Checklist />
      </div>
    </div>
  )
}
