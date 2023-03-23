function Footer() {
  return (
    <footer className="bg-gray-100 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700">
            &copy; {new Date().getFullYear()} prijs.watch - All rights reserved.
          </div>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;