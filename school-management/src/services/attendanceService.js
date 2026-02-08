
import api from "../api/axios";

// GET ATTENDANCE

export const getAttendance = (classId, date) => {
  return api.get("/attendance", {
    params: {
      classId,
      date,
    },
  });
};


// MARK ATTENDANCE

export const markAttendance = (data) => {
  return api.post("/attendance", data);
};
