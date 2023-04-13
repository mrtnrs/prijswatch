// components/ChildCategories.js
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ChildCategories = ({ categories = [] }) => {

  const setUrl = usePathname();

return (
  <div>
    <h2>Child Categories</h2>
    <ul>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link href={`.${setUrl}/${category.slug}`}>
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
  )

}



export default ChildCategories;
