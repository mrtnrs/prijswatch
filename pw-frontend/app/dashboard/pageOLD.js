'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { webshops } from './dummydata';

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || !session.user || session.user.email !== 'raesmaarten@gmail.com') {
     // router.replace('/login');
    }
  }, [session, router]);

  if (status === 'loading') return <div>Loading...</div>;

  return (
     <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webshops.map((webshop) => (
          <div key={webshop.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <img
                src={webshop.logo}
                alt={webshop.name}
                className="w-12 h-12 object-cover rounded mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{webshop.name}</h2>
                <a href={webshop.url} className="text-gray-600 hover:text-gray-800">
                  {webshop.url}
                </a>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Scrapers</h3>
              <ul className="space-y-2 mt-2">
              {webshop.scrapers.map((scraper) => (
                  <li key={scraper.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">{scraper.info}</p>
                      <p className="text-sm text-gray-600">Last ran: {scraper.lastRan}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        scraper.status === 'running' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                      }`}
                    >
                      {scraper.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Errors</h3>
              <ul className="space-y-2 mt-2">
                {webshop.errors.slice(0, 2).map((error) => (
                  <li key={error.id} className="text-sm text-gray-600">
                    <p>{error.message}</p>
                    <p className="text-xs">{error.timestamp}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
