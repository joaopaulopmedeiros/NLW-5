import { useRouter } from 'next/router';

export default function Episode() {
    const router = useRouter();
    const title = String(router.query.slug).split('-').join(' ');

    return (
        <>
            <h1>{title}</h1>
        </>
    );
}