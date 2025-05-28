export default function Button({ text }) {
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      {text}
    </button>
  );
}
