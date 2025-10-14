export default function ResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="text-xl font-medium">Results for Election: {params.id}</div>
  );
}
