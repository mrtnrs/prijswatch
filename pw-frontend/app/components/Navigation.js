import Link from 'next/link'
import Image from 'next/image'

function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-900">
            <Link href="/"><Typography className="text-gradient" variant="h1" sx={{ textAlign: { lg: 'left' }, maxWidth: '37rem' }}>Vind de beste producten</Typography></Link>
          </div>
          <ul className="flex space-x-4">
            <li>
              <Link href="/products" className="text-gray-600 hover:text-gray-800">
                Products
              </Link>
            </li>
            <li>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-800">
                Dashboard
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;