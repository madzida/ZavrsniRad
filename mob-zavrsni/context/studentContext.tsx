import React, { useContext, useState, createContext } from 'react';
import { IStudent } from './classContext';

export interface IStudentContext {
  student?: IStudent;
}

export interface IStudentMethods {
  chooseStudent: (name: string, surname: string, studentId: string) => void;
}

interface IStudentProvider {
  children: React.ReactNode;
}

export const initiaIStudentData: IStudentContext = {
  student: {} as IStudent,
};

export interface IStudentData extends IStudentContext, IStudentMethods {}

export const StudentContext = createContext(initiaIStudentData as IStudentData);

export const useStudentData = (): IStudentData => useContext(StudentContext);

export default function StudentProvider({ children }: IStudentProvider): React.ReactElement {
  const [student, setStudent] = useState<IStudent>();

  const chooseStudent = (name: string, surname: string, studentId: string) => {
    setStudent({ name, surname, studentId });
  };

  return <StudentContext.Provider value={{ chooseStudent, student }}>{children}</StudentContext.Provider>;
}
