import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const addJournal = async (data) => {
  const journalsRef = firestore().collection('journals');
  await journalsRef.add({
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getJournals = async () => {
  const snapshot = await firestore().collection('journals').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateJournal = async (id, data) => {
  await firestore().collection('journals').doc(id).update(data);
};

export const deleteJournal = async (id) => {
  await firestore().collection('journals').doc(id).delete();
};
