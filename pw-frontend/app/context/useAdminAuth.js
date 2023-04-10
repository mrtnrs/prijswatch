import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const withAdminAuth = (Component) => {
  const Wrapper = (props) => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) {
        // Do nothing if the authentication state is still being fetched
        return;
      }

      if (!currentUser || currentUser.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.replace('/');
      }
    }, [currentUser, router, loading]);

    if (loading) {
      // Render a loading state or an empty fragment while waiting for the authentication state
      return <></>;
    }

    return <Component {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    if (Component.getInitialProps) {
      return await Component.getInitialProps(ctx);
    }

    return {};
  };

  return Wrapper;
};

export default withAdminAuth;
