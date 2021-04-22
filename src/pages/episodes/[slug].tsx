import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import { Episode } from '../../types/Episodes';
import Image from 'next/image';
import Revalidate from '../../utils/revalidate';

import styles from './styles.module.scss';

type EpisodeProps = {
    episode: Episode;
}

export default function Episodes({ episode }: EpisodeProps) {
    const router = useRouter();
    const title = String(router.query.slug).split('-').join(' ');

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <button>
                    <img src="/arrow-left.svg" alt="Voltar" />
                </button>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                />
                <button>
                    <img src="/play.svg" alt="Seguir" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
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
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR })
    };

    return {
        props: {
            episode,
        },
        revalidate: Revalidate.At,
    }
}