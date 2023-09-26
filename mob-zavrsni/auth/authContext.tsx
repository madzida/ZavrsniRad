import * as React from 'react';
import { useContext, createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';
import { AxiosInstance } from './AxiosInstance';
import { IStudent } from '../context/classContext';
import { Vibration} from 'react-native';

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(): Promise<AxiosResponse>;
  signOut(): void;
  chooseName: (id: string) => void;
  chooseImage: (picture: string) => void;
  student: IStudent; 
  error:boolean;
};

export type AuthData = {
  userId: string;
  userImage: string;
  token: string;
};

/*Warning: Can't perform a React state update on an unmounted component. This is a no-op, 
but it indicates a memory leak in your application.
 To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function. */
export const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [image, setImage] = useState('');
  const [student, setStudent] = useState<IStudent>({ name: '', surname: '', studentId: '' });
  const [error,setError]=useState<any>(false);
  useEffect(() => {
    loadStorageData();
  }, []);

  const chooseName = (id: string) => {
    setStudentId(id);
  };

  const chooseImage = (image: string) => {
    setImage(image);
  };

  const loadStorageData = async (): Promise<void> => {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    return AxiosInstance.post('/login', {
      studentId: studentId,
      pictureKey: image,
    })
      .then((res) => {
        const { data: _authData } = res;

        setAuthData(_authData);
        AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));
        const name = res.data.name;
        const surname = res.data.surname;
        const studentId = res.data.studentId;
        setStudent({ name, surname, studentId });

        return _authData;
      })
      .catch((error) => {
        Vibration.vibrate();
        setError(true);
        return error.response;
      });
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem('@AuthData');
  };

  return (
    <AuthContext.Provider value={{ student, authData, loading, signIn, signOut, chooseName, chooseImage,error }}>
      {children}
    </AuthContext.Provider>
  );
};
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Hook for using auth data
/* export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}; */
export const useAuth = (): AuthContextData => useContext(AuthContext);
export { AuthContext };
