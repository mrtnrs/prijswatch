// components/ChildCategories.js
import Link from 'next/link';

const ChildCategories = ({ childCategories }) => (
  <div>
    <h2>Child Categories</h2>
    <ul>
      {childCategories.map((category) => (
        <li key={category.slug}>
          <Link href={`/app/${category.slug}`}>
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default ChildCategories;
