import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Placeholder for NavItems - you can customize this based on your needs
const NavItems = () => {
    return (
        <div className="flex items-center gap-6">
            <Link href="/home" className="text-gray-600 hover:text-primary transition-colors">
                Home
            </Link>
        </div>
    )
}

const Navbar = () => {
    return (
        <nav className="navbar p-6 flex justify-between items-center">
            <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                    {/* Placeholder for logo - replace with your actual logo */}
                    <div className="w-[60px] h-[60px] bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                </div>
            </Link>
            <div className="flex items-center gap-8">
                <NavItems />
                <div className="flex items-center gap-4">
                    <Link href="/signin">
                        <Button variant="ghost" className="btn-signin">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button>
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar