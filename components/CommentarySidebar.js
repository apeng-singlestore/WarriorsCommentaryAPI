export default function CommentarySidebar({ commentary }) {
  return (
    <div className="bg-gray-100 h-full overflow-y-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Live Commentary</h2>
      <div className="space-y-4">
        {commentary.map((comment, index) => (
          <div key={index} className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-600">{comment.timestamp}</p>
            <p className="mt-1">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
