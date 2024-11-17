import { fetchPrivateData } from '@/lib/api/fetchPrivateData';

const withPrivateRoute = (WrappedComponent) => {
    const PrivateComponent = (props) => {
        return <WrappedComponent {...props} />;
    };

    // Dùng getServerSideProps để kiểm tra quyền truy cập
    PrivateComponent.getServerSideProps = async (context) => {
        try {
            const data = await fetchPrivateData();
            return { props: { data } };
        } catch (error) {
            return {
                redirect: {
                    destination: '/auth/login',
                    permanent: false,
                },
            };
        }
    };

    return PrivateComponent;
};

export default withPrivateRoute;
