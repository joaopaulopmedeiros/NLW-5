export default function Home() {
  return (
    <>
      <h1>Olá, mundo! #NEXT</h1>
    </>
  )
}

export async function getStaticPropos() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    }, 
    revalidate: 60 * 60 * 8,
  }
}
