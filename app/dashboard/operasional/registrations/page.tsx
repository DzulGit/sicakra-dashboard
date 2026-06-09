import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { RegistrationsFitur } from '@/components/dashboard/fitur/registrations'

export default async function OperasionalRegistrationsPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('sicakra_session')?.value
  const role = (cookieStore.get('sicakra_role')?.value || 'operasional').toUpperCase()

  if (!session) {
    redirect('/login')
  }

  // Forward HttpOnly cookie directly to backend via Cookie header
  const res = await fetch('http://localhost:3000/registrations', {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sicakra_session=${session}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    // Let the client render an error state inside the component if needed
    return (
      <main className="w-full">
        <div className="p-6 bg-destructive/5 rounded">Gagal memuat data pendaftaran ({res.status})</div>
      </main>
    )
  }

  const result = await res.json()
  const registrations = result && result.data ? result.data : (Array.isArray(result) ? result : [])

  return (
    <main className="w-full">
      <RegistrationsFitur initialData={registrations} role={role} />
    </main>
  )
}