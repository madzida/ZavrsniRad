import React, { createContext, useCallback, useContext, useState } from 'react';
import { AxiosInstance } from '../auth/AxiosInstance';

export interface IStudent {
  name: string;
  surname: string;
  studentId: string;
}

interface IStudentContext {
  students: IStudent[];
  teacherName: string;
  /*classId: number; //string */
}

interface IStudentMethods {
  getClass: (classId: string) => void;
}

interface IStudentProvider {
  children: React.ReactNode;
}

const initialStudentData: IStudentContext = {
  students: [],
  teacherName: '',
};

interface IStudentData extends IStudentContext, IStudentMethods {}

export default function StudentsProvider({ children }: IStudentProvider): React.ReactElement {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [teacherName, setTeacherName] = useState('');

  const getClass = useCallback(async (classId: string) => {
    try {
      const res = await AxiosInstance.get('/class', {
        params: { classId: classId },
      });
      setTeacherName(res.data.teacherName);
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return <StudentsContext.Provider value={{ students, getClass, teacherName }}>{children}</StudentsContext.Provider>;
}

export const StudentsContext = createContext(initialStudentData as IStudentData);

export const useStudentsData = (): IStudentData => useContext(StudentsContext);
