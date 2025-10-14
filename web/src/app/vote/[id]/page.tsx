export default function VotePage({ params }: { params: { id: string } }) {
  return (
    <div className="text-xl font-medium">Voting Ballot for ID: {params.id}</div>
  );
}
