import { useAppSelector } from "@/redux/hooks";


export default function Participants() {
  const participants = useAppSelector(state => state.meeting.participants);

  return (
    <div className="p-4 border rounded-lg shadow w-full max-w-md mt-4">
      <h2 className="font-bold mb-2">Participants</h2>
      <ul className="list-disc ml-4 text-sm">
        {participants.map((p) => (
          <li key={p._id}>{p.firstName}</li>
        ))}
      </ul>
    </div>
  );
}
