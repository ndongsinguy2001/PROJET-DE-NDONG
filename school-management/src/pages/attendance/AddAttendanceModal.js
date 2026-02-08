// 
// src/pages/attendance/Attendance.jsx
import { useEffect, useState } from "react";
 import { getAttendance } from "../../services/attendanceService";
 import AddAttendanceModal from "./AddAttendanceModal";

 const Attendance = () => {
   const [attendance, setAttendance] = useState([]);
   const [showModal, setShowModal] = useState(false);

   const fetchAttendance = async () => {
     const res = await getAttendance();
     setAttendance(res.data.data || []);
   };

  useEffect(() => {
     fetchAttendance();
   }, []);

  return (
     <div className="p-6">
       <div className="flex justify-between mb-6">
         <h1 className="text-2xl font-bold">Présences</h1>
         <button
           onClick={() => setShowModal(true)}
           className="bg-blue-600 text-white px-4 py-2 rounded"
         >
           + Ajouter présence
         </button>
       </div>

       <table className="min-w-full bg-white rounded shadow">
         <thead className="bg-gray-100">
           <tr>
             <th className="p-3">Élève</th>
             <th className="p-3">Classe</th>
             <th className="p-3">Date</th>
             <th className="p-3">Statut</th>
             <th className="p-3">Matière</th>
           </tr>
         </thead>
         <tbody>
           {attendance.map((a) => (
             <tr key={a._id} className="border-t">             <td className="p-3">
                 {a.student?.firstName} {a.student?.lastName}
             </td>
              <td className="p-3">{a.class}</td>
               <td className="p-3">
                 {new Date(a.date).toLocaleDateString("fr-FR")}
               </td>
               <td className="p-3 font-bold">{a.status}</td>
               <td className="p-3">{a.subject || "-"}</td>
             </tr>
           ))}
         </tbody>
       </table>

      {showModal && (
        <AddAttendanceModal
          onClose={() => setShowModal(false)}
           onSuccess={() => {
             setShowModal(false);
             fetchAttendance();
           }}
         />
       )}
     </div>
   );
 };

 export default Attendance;
