
import { Navbar } from '../components/Navbar'
import { BalanceCard } from '../components/BalanceCard'
import { SendForm } from '../components/SendForm'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container p-4 mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BalanceCard />
          <SendForm />
        </div>
      </div>
    </main>
  )
}
