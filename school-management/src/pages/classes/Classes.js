import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses, deleteClass } from "../../services/classService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    const res = await getClasses();
    setClasses(res.data.data || []);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Classes</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nom</th>
            <th className="p-2">Niveau</th>
            <th className="p-2">Capacité</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.level}</td>
              <td className="p-2">{c.capacity}</td>
              <td className="p-2 flex gap-3">
                <button
                  onClick={() => navigate(`/classes/${c._id}`)}
                  className="text-blue-600"
                >
                  Voir
                </button>
                <button
                  onClick={() => deleteClass(c._id).then(fetchClasses)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Classes;
