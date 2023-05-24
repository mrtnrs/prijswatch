'use client';
import UserLayout from '@/components/layouts/UserLayout'

export default function UserLayoutWrapper({children}){
	return (
		<UserLayout>{children}</UserLayout>
	);
}

