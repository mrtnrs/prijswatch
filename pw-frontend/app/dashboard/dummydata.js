export const webshops = [
  {
    id: 1,
    name: "Webshop A",
    logo: "https://via.placeholder.com/150",
    url: "https://www.webshop-a.com",
    scrapers: [
      {
        id: 1,
        info: "Scraper A1",
        status: "running",
        lastRan: "2023-03-20 15:30:00",
      },
      {
        id: 2,
        info: "Scraper A2",
        status: "stopped",
        lastRan: "2023-03-19 10:45:00",
      },
    ],
    errors: [
      {
        id: 1,
        message: "Error message 1",
        timestamp: "2023-03-20 15:45:00",
      },
      {
        id: 2,
        message: "Error message 2",
        timestamp: "2023-03-19 11:00:00",
      },
    ],
  },
  {
    id: 2,
    name: "Webshop B",
    logo: "https://via.placeholder.com/150",
    url: "https://www.webshop-b.com",
    scrapers: [
      {
        id: 3,
        info: "Scraper B1",
        status: "running",
        lastRan: "2023-03-21 18:00:00",
      },
      {
        id: 4,
        info: "Scraper B2",
        status: "stopped",
        lastRan: "2023-03-20 22:15:00",
      },
    ],
    errors: [
      {
        id: 3,
        message: "Error message 3",
        timestamp: "2023-03-21 18:30:00",
      },
      {
        id: 4,
        message: "Error message 4",
        timestamp: "2023-03-20 22:45:00",
      },
    ],
  },
];
