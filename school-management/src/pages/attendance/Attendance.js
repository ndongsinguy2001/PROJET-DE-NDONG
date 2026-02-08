
import { useEffect, useState } from "react";
import api from "../../api/axios";

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  
  // CHARGER CLASSES
  
  useEffect(() => {
    api.get("/classes").then((res) => {
      setClasses(res.data.data);
    });
  }, []);

  
  // CHARGER ÉLÈVES + PRÉSENCES
  
  useEffect(() => {
    if (!classId || !date) return;

    const loadData = async () => {
      const classRes = await api.get(`/classes/${classId}`);
      setStudents(classRes.data.data.students);

      const attRes = await api.get(
        `/attendance?classId=${classId}&date=${date}`
      );

      const map = {};
      attRes.data.data.forEach((a) => {
        map[a.student._id] = a.status;
      });

      setAttendance(map);
    };

    loadData();
  }, [classId, date]);

 
  // MARQUER PRÉSENCE
  
  const mark = async (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });

    await api.post("/attendance", {
      student: studentId,
      classId,
      date,
      status,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Présences</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="input"
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
          className="input"
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
