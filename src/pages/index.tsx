import { GetStaticProps } from 'next';

type Episode = {
  id: string;
  title: string;
  members: string;
}

type HomeProps = {
  episodes: Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <>
      <h1>Olá, mundo! #NEXT</h1>
    </>
  )
}

export const getStaticPropos: GetStaticProps = async () => {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    }, 
    revalidate: 60 * 60 * 8,
  }
}
