export default function Page({ params }: { params: { ID: string } }) {
    return <div className="">My Post: {params.ID}</div>
  }