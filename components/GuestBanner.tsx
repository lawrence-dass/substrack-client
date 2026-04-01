import Link from 'next/link'
import { Button } from './ui/button'

export default function GuestBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-amber-800 text-sm text-center sm:text-left">
          <span className="font-medium">You&apos;re in guest mode.</span> Your data is saved locally on this device only.
        </p>
        <div className="flex gap-2 shrink-0">
          <Link href="/signin">
            <Button size="sm" variant="outline" className="border-amber-400 text-amber-800 hover:bg-amber-100">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
