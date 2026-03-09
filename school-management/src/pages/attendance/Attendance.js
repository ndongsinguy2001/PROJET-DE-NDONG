import { useEffect, useState } from "react";
import { getClasses } from "../../services/classService";
import { getAttendance, markAttendance } from "../../services/attendanceService";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await getClasses();
      setClasses(res.data.data || []);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!classId || !date) return;

    const loadData = async () => {
      try {
        const classRes = await api.get(`/classes/${classId}`);
        setStudents(classRes.data.data.students || []);

        const attRes = await getAttendance(classId, date);
        const map = {};
        attRes.data.data.forEach((a) => {
          map[a.student._id] = a.status;
        });
        setAttendance(map);
      } catch {
        toast.error("Erreur lors du chargement des présences");
      }
    };
    loadData();
  }, [classId, date]);

  const mark = async (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
    try {
      await markAttendance({ student: studentId, classId, date, status });
      toast.success("Présence mise à jour");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Présences</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sélectionner une classe</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.level})
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {students.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Élève</th>
              <th className="p-2">Présent</th>
              <th className="p-2">Absent</th>
              <th className="p-2">Retard</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-2">
                  {s.firstName} {s.lastName}
                </td>
                {["Present", "Absent", "Late"].map((st) => (
                  <td key={st} className="text-center">
                    <input
                      type="radio"
                      name={`student-${s._id}`}
                      checked={attendance[s._id] === st}
                      onChange={() => mark(s._id, st)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendance;