import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';

import { useDeleteTask, useUpdateTask } from '@/hooks/useTasks';
import { useModalStore } from '@/store/modalStore';
import { Task } from '@/types';
import { formatDate } from '@/utils/helper';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { openTaskModal } = useModalStore();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const handleDelete = () => {
    Alert.alert('Delete Task', `Are you sure you want to delete "${task.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask.mutate(task.id) },
    ]);
  };

  const handleToggleCompletion = () => {
    let nextStatus: string;
    let isCompleted: boolean;

    switch (task.status) {
      case 'pending':
        nextStatus = 'in_progress';
        isCompleted = false;
        break;
      case 'in_progress':
        nextStatus = 'completed';
        isCompleted = true;
        break;
      case 'completed':
      default:
        nextStatus = 'pending';
        isCompleted = false;
        break;
    }

    updateTask.mutate({
      id: task.id,
      updates: {
        status: nextStatus as 'pending' | 'in_progress' | 'completed',
        is_completed: isCompleted,
      },
    });
  };

  const handleEdit = () => {
    openTaskModal({ task });
  };

  const isDeleting = deleteTask.isPending;
  const isToggling = updateTask.isPending;

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = () => {
    if (isToggling) {
      return <MaterialIcons name="hourglass-empty" size={24} color="#6366F1" />;
    }

    switch (task.status) {
      case 'completed':
        return <MaterialIcons name="check-circle" size={24} color="#10B981" />;
      case 'in_progress':
        return <MaterialIcons name="hourglass-empty" size={24} color="#F59E0B" />;
      case 'pending':
      default:
        return <MaterialIcons name="radio-button-unchecked" size={24} color="#D1D5DB" />;
    }
  };

  const formatStatus = (status: string | null) => {
    if (!status) return 'Unknown';
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <View
      className={`${styles.card} ${task.status === 'completed' ? styles.completedCard : ''} ${isDeleting ? styles.deletingCard : ''}`}>
      <TouchableOpacity
        onPress={handleToggleCompletion}
        className={styles.checkbox}
        disabled={isToggling}>
        {getStatusIcon()}
      </TouchableOpacity>

      <View className={styles.content}>
        <View className={styles.header}>
          <Text
            className={`${styles.title} ${task.status === 'completed' ? styles.completedTitle : ''}`}>
            {task.name}
          </Text>
          <View className={styles.priority} style={{ backgroundColor: getPriorityColor() }}>
            <Text className={styles.priorityText}>{task.priority?.toUpperCase()}</Text>
          </View>
        </View>

        {task.description && (
          <Text
            className={`${styles.description} ${task.status === 'completed' ? styles.completedText : ''}`}>
            {task.description}
          </Text>
        )}

        {task.image && (
          <View className={styles.imageContainer}>
            <Image source={{ uri: task.image }} className={styles.taskImage} />
          </View>
        )}

        <View className={styles.footer}>
          <View className={styles.meta}>
            {task.due_date && (
              <View className={styles.dueDateContainer}>
                <MaterialIcons name="schedule" size={14} color="#6B7280" />
                <Text className={styles.dueDate}>Due {formatDate(task.due_date)}</Text>
              </View>
            )}
            <Text className={styles.status}>{formatStatus(task.status)}</Text>
          </View>

          <View className={styles.actions}>
            <TouchableOpacity
              onPress={handleEdit}
              className={styles.editButton}
              disabled={isDeleting || isToggling}>
              <MaterialIcons
                name="edit"
                size={18}
                color={isDeleting || isToggling ? '#9CA3AF' : '#6366F1'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className={`${styles.deleteButton} ${isDeleting ? styles.loadingButton : ''}`}
              disabled={isDeleting || isToggling}>
              {isDeleting ? (
                <MaterialIcons name="hourglass-empty" size={18} color="#EF4444" />
              ) : (
                <MaterialIcons name="delete" size={18} color="#EF4444" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  card: 'bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-start',
  completedCard: 'bg-gray-50 opacity-75',
  deletingCard: 'opacity-50',
  checkbox: 'mr-3 mt-1',
  content: 'flex-1',
  header: 'flex-row items-start justify-between mb-2',
  title: 'text-base font-semibold text-gray-900 flex-1 mr-3',
  completedTitle: 'line-through text-gray-500',
  priority: 'px-2 py-1 rounded-full',
  priorityText: 'text-xs font-bold text-white',
  description: 'text-sm text-gray-600 mb-3',
  completedText: 'line-through text-gray-400',
  footer: 'flex-row items-center justify-between',
  meta: 'flex-row items-center gap-3',
  dueDateContainer: 'flex-row items-center gap-1',
  dueDate: 'text-xs text-gray-500',
  status: 'text-xs text-gray-400',
  actions: 'flex-row items-center gap-2',
  editButton: 'w-8 h-8 bg-indigo-50 rounded-lg items-center justify-center',
  deleteButton: 'w-8 h-8 bg-red-50 rounded-lg items-center justify-center',
  loadingButton: 'opacity-75',
  imageContainer: 'mb-3',
  taskImage: 'w-full h-32 rounded-lg',
};
