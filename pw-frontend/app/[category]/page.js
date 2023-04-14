'use client';
import { useEffect, useState, Suspense, useContext } from 'react';
import SettingsContext from '@/vercelFix/context/SettingsContext';
import { useCategoryStructure } from '@/core/hooks/useSettings';
import { useParams } from 'next/navigation';
import Link from 'next/link';


import CategoryOrMetaProducts from './components/CategoryOrMetaProducts'



export default function CategoryPage() {

  return <CategoryOrMetaProducts />;

}
