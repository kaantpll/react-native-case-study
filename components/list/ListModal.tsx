import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { Button } from '@/components/Button';
import { TextInput } from '@/components/form/TextInput';
import { useCreateList, useUpdateList } from '@/hooks/useLists';
import { useModalStore } from '@/store/modalStore';
import { listSchema, ListInput } from '@/utils/validations';

export const ListModal = () => {
  const { isVisible, isEdit, editingList, close } = useModalStore();
  const createList = useCreateList();
  const updateList = useUpdateList();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListInput>({
    resolver: zodResolver(listSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (isEdit && editingList) {
      reset({ name: editingList.name });
    } else {
      reset({ name: '' });
    }
  }, [isEdit, editingList, reset]);

  const onSubmit = (data: ListInput) => {
    if (isEdit && editingList) {
      updateList.mutate({ id: editingList.id, name: data.name });
    } else {
      createList.mutate(data.name);
    }
    handleClose();
  };

  const handleClose = () => {
    reset({ name: '' });
    close();
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={styles.keyboardView}>
        <TouchableOpacity className={styles.overlay} activeOpacity={1} onPress={handleClose} />
        <View className={styles.modalContainer}>
          <View className={styles.modalContent}>
            <View className={styles.dragHandle} />
            <Text className={styles.title}>{isEdit ? 'Edit List' : 'Create New List'}</Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter list name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoFocus
                  error={errors.name?.message}
                  containerClassName="mb-6"
                />
              )}
            />

            <View className={styles.buttonRow}>
              <TouchableOpacity onPress={handleClose} className={styles.cancelButton}>
                <Text className={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <Button
                title={isEdit ? 'Update' : 'Create'}
                onPress={handleSubmit(onSubmit)}
                className={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = {
  keyboardView: 'flex-1 justify-end',
  overlay: 'absolute inset-0 bg-black/50',
  modalContainer: 'bg-white rounded-t-3xl shadow-xl',
  modalContent: 'px-6 py-8 pb-12',
  dragHandle: 'w-12 h-1 bg-gray-300 rounded-full self-center mb-6',
  title: 'text-2xl font-bold text-gray-900 text-center mb-8',
  buttonRow: 'flex-row justify-between items-center gap-4',
  cancelButton: 'flex-1 py-4 px-6 bg-gray-100 rounded-[28px] items-center',
  cancelText: 'text-gray-700 font-semibold text-base',
  saveButton: 'flex-1',
};
