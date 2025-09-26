import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { useDeleteList } from '@/hooks/useLists';
import { useModalStore } from '@/store/modalStore';
import { List } from '@/types';

interface ListCardProps {
  list: List;
}

export const ListCard = ({ list }: ListCardProps) => {
  const { openEdit } = useModalStore();
  const deleteList = useDeleteList();

  const handleDelete = () => {
    Alert.alert('Delete List', `Are you sure you want to delete ${list.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteList.mutate(list.id) },
    ]);
  };

  return (
    <View className={styles.card}>
      <Link href={{ pathname: '/details', params: { id: list.id.toString() } }} asChild>
        <TouchableOpacity className={styles.cardContent} activeOpacity={0.7}>
          <View className={styles.cardLeft}>
            <View className={styles.textContainer}>
              <Text className={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                {list.name}
              </Text>
              <Text className={styles.cardDate}>
                {new Date(list.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
      <View className={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => openEdit({ id: list.id, name: list.name })}
          className={styles.editButton}>
          <MaterialIcons name="edit" size={20} color="#6366F1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} className={styles.deleteButton}>
          <MaterialIcons name="delete" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  card: 'bg-white rounded-2xl p-5  border border-indigo-100 mb-4 flex-row items-center',
  cardContent: 'flex-1 flex-row items-center',
  cardLeft: 'flex-row items-center flex-1',
  iconWrapper: 'w-12 h-12 bg-indigo-50 rounded-xl items-center justify-center mr-4',
  textContainer: 'flex-1',
  cardTitle: 'text-lg font-semibold text-gray-900 mb-1',
  cardDate: 'text-sm text-gray-500',
  actionButtons: 'flex-row items-center gap-3 ml-2',
  editButton: 'w-10 h-10 bg-indigo-50 rounded-lg items-center justify-center',
  deleteButton: 'w-10 h-10 bg-red-50 rounded-lg items-center justify-center',
};
