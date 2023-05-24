// components/ChildCategories.js
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import MetaContext from '@/context/MetaContext';

const ChildCategories = ({ categories = [], catName }) => {

  const setUrl = usePathname();
  const { setMeta } = useContext(MetaContext);
  console.log("catz: ", categories);

    useEffect(() => {
    
    const subcategoryNames = categories.map(category => category.name);
    const metaTitle = `Vind de beste prijzen voor ${subcategoryNames.join(', ')} - ${catName} - prijs.watch`;
    const metaDescription = `Bekijk de subcategorieën voor ${catName} op prijs.watch. Vergelijk prijzen uit verschillende webshops.`;

    setMeta({ 
      title: `${metaTitle}`,
      description: `${metaDescription}`,
      ogTitle: `${metaTitle}`,
      ogDescription: `${metaDescription}`,
      ogUrl: window.location.href,
      ogType: 'website',
      ogSiteName: 'prijs.watch',
      keywords: `${subcategoryNames.join(', ')}, subcategorieën, prijs vergelijken, webshops`,
    });
  }, []);

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