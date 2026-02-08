export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-700">
        Système de gestion scolaire
      </h1>

      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Déconnexion
      </button>
    </header>
  );
}
