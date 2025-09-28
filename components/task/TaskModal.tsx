import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

import { Button } from '@/components/Button';
import { TextInput } from '@/components/form/TextInput';
import { useCreateTask, useUpdateTask, useFetchTasks } from '@/hooks/useTasks';
import { useModalStore } from '@/store/modalStore';
import { taskSchema, TaskInput } from '@/utils/validations';

interface TaskModalProps {
  listId: number;
}

export const TaskModal = ({ listId }: TaskModalProps) => {
  const { isTaskModalVisible, taskModalData, closeTaskModal } = useModalStore();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { refetch } = useFetchTasks();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!taskModalData?.task;
  const editingTask = taskModalData?.task;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      priority: 'medium',
      status: 'pending',
      due_date: '',
      list_id: listId,
    },
  });

  useEffect(() => {
    if (isEdit && editingTask) {
      reset({
        name: editingTask.name,
        description: editingTask.description || '',
        image: editingTask.image || '',
        priority: (editingTask.priority as 'low' | 'medium' | 'high') || 'medium',
        status: (editingTask.status as 'pending' | 'in_progress' | 'completed') || 'pending',
        due_date: editingTask.due_date || '',
        list_id: editingTask.list_id,
      });
      setSelectedImage(editingTask.image || null);
    } else {
      reset({
        name: '',
        description: '',
        image: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        list_id: listId,
      });
      setSelectedImage(null);
    }
  }, [isEdit, editingTask, reset, listId]);

  const onSubmit = async (data: TaskInput) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (isEdit && editingTask) {
        await updateTask.mutateAsync({
          id: editingTask.id,
          updates: {
            name: data.name,
            description: data.description,
            image: selectedImage || '',
            priority: data.priority,
            status: data.status,
            due_date: data.due_date,
          },
        });
      } else {
        await createTask.mutateAsync({ ...data, image: selectedImage || '' });
      }

      refetch();
      handleClose();
    } catch {
      Alert.alert('Error', isEdit ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    closeTaskModal();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access photos is required to create tasks!'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const renderPrioritySelector = () => {
    const priorities = [
      { value: 'low', label: 'Low', color: '#10B981' },
      { value: 'medium', label: 'Medium', color: '#F59E0B' },
      { value: 'high', label: 'High', color: '#EF4444' },
    ];

    return (
      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <View className={styles.priorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                onPress={() => onChange(priority.value)}
                className={`${styles.priorityOption} ${
                  value === priority.value ? styles.prioritySelected : ''
                }`}>
                <View className={styles.priorityDot} style={{ backgroundColor: priority.color }} />
                <Text
                  className={`${styles.priorityText} ${
                    value === priority.value ? styles.prioritySelectedText : ''
                  }`}>
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    );
  };

  const renderStatusSelector = () => {
    const statuses = [
      { value: 'pending', label: 'Pending', icon: 'radio-button-unchecked' },
      { value: 'in_progress', label: 'In Progress', icon: 'hourglass-empty' },
      { value: 'completed', label: 'Completed', icon: 'check-circle' },
    ];

    return (
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <View className={styles.statusContainer}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status.value}
                onPress={() => onChange(status.value)}
                className={`${styles.statusOption} ${
                  value === status.value ? styles.statusSelected : ''
                }`}>
                <MaterialIcons
                  name={status.icon as any}
                  size={18}
                  color={value === status.value ? '#6366F1' : '#9CA3AF'}
                />
                <Text
                  className={`${styles.statusText} ${
                    value === status.value ? styles.statusSelectedText : ''
                  }`}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    );
  };

  return (
    <Modal
      visible={isTaskModalVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableOpacity className={styles.overlay} activeOpacity={1} onPress={handleClose} />
        <View className={styles.modalContainer}>
          <ScrollView
            className={styles.modalContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled">
            <View className={styles.dragHandle} />
            <Text className={styles.title}>{isEdit ? 'Edit Task' : 'Create New Task'}</Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Task Name"
                  placeholder="Enter task name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoFocus
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Description (Optional)"
                  placeholder="Enter task description"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                  isTextArea
                  error={errors.description?.message}
                />
              )}
            />

            <View className={styles.inputContainer}>
              <Text className={styles.label}>Priority</Text>
              {renderPrioritySelector()}
            </View>

            <View className={styles.inputContainer}>
              <Text className={styles.label}>Status</Text>
              {renderStatusSelector()}
            </View>

            <View className={styles.inputContainer}>
              <Text className={styles.label}>Image (Optional)</Text>
              {selectedImage ? (
                <View className={styles.imageContainer}>
                  <Image source={{ uri: selectedImage }} className={styles.selectedImage} />
                  <TouchableOpacity onPress={removeImage} className={styles.removeImageButton}>
                    <MaterialIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickImage} className={styles.imagePickerButton}>
                  <MaterialIcons name="add-a-photo" size={24} color="#6B7280" />
                  <Text className={styles.imagePickerText}>Add Image</Text>
                </TouchableOpacity>
              )}
            </View>

            <Controller
              control={control}
              name="due_date"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Due Date (Optional)"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.due_date?.message}
                />
              )}
            />
            <View className={styles.buttonRow}>
              <TouchableOpacity onPress={handleClose} className={styles.cancelButton}>
                <Text className={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <Button
                title={isSubmitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
                onPress={handleSubmit(onSubmit)}
                className={`${styles.saveButton} ${isSubmitting ? styles.disabledButton : ''}`}
                disabled={isSubmitting}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = {
  keyboardView: 'flex-1 justify-end',
  overlay: 'absolute inset-0 bg-black/50',
  modalContainer: 'bg-white rounded-t-3xl shadow-xl max-h-[90%]',
  modalContent: 'px-6 py-8 pb-12',
  dragHandle: 'w-12 h-1 bg-gray-300 rounded-full self-center mb-6',
  title: 'text-2xl font-bold text-gray-900 text-center mb-8',
  inputContainer: 'mb-6',
  label: 'text-sm font-medium text-gray-700 mb-2',
  priorityContainer: 'flex-row gap-3',
  priorityOption:
    'flex-1 flex-row items-center justify-center px-3 py-3 bg-gray-50 rounded-xl border border-gray-200',
  prioritySelected: 'bg-indigo-50 border-indigo-200',
  priorityDot: 'w-3 h-3 rounded-full mr-2',
  priorityText: 'text-sm font-medium text-gray-700',
  prioritySelectedText: 'text-indigo-700',
  statusContainer: 'flex-row gap-3',
  statusOption:
    'flex-1 flex-row items-center justify-center px-3 py-3 bg-gray-50 rounded-xl border border-gray-200',
  statusSelected: 'bg-indigo-50 border-indigo-200',
  statusText: 'text-sm font-medium text-gray-700 ml-2',
  statusSelectedText: 'text-indigo-700',
  buttonRow: 'flex-row justify-between items-center gap-4 mt-8 mb-4',
  cancelButton: 'flex-1 py-4 px-6 bg-gray-100 rounded-[28px] items-center',
  cancelText: 'text-gray-700 font-semibold text-base',
  saveButton: 'flex-1 py-4 px-6 bg-indigo-600 rounded-[28px] items-center',
  disabledButton: 'opacity-50',
  imageContainer: 'relative',
  selectedImage: 'w-full h-40 rounded-xl',
  removeImageButton:
    'absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full items-center justify-center',
  imagePickerButton:
    'flex-row items-center justify-center py-6 bg-gray-50 border border-gray-200 rounded-xl border-dashed',
  imagePickerText: 'ml-2 text-gray-600 font-medium',
};
