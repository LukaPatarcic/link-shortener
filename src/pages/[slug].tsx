import { GetServerSideProps } from 'next';

import { prisma } from '@server/db/client';

const Slug = () => null;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const shortenUrl = await prisma.shortenUrl.findFirst({
        where: {
            short_url: query?.slug?.toString(),
        },
    });

    if (!shortenUrl)
        return {
            notFound: true,
            props: {},
        };

    return {
        redirect: {
            permanent: true,
            destination: shortenUrl.url,
        },
        props: {},
    };
};

export default Slug;
