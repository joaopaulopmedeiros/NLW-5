import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';


type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    url: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({episode}: EpisodeProps) {
    const router = useRouter();
    const title = String(router.query.slug).split('-').join(' ');

    return (
        <>
            <h1>{title}</h1>
            <p>{JSON.stringify(episode)}</p>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        ...data,
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
        publishedAt: format(parseISO(data.published_at),'d MMM yy', { locale: ptBR}) 
      };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 8,
    }
}