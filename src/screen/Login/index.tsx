import {Text, View} from 'react-native';
import {Login} from '@biz/Login/Login';
// import {StartIndex} from '@biz/Login/Start';
import {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useUser} from '@hooks/useAuth';
import {StartIndex} from '@biz/Login/Start';

export const LoginScreen = observer(() => {
  const [currentPage, setCurrentPage] = useState<
    'start' | 'login' | 'register'
  >('start');

  const {phone} = useUser();

  useEffect(() => {
    if (phone) {
      setCurrentPage('login');
    }
  }, [phone]);

  console.log('currentPage', currentPage);

  return (
    <View className=" w-screen h-full ">
      {currentPage === 'start' && <StartIndex changePage={setCurrentPage} />}
      {currentPage === 'login' && <Login changePage={setCurrentPage} />}
    </View>
  );
});
