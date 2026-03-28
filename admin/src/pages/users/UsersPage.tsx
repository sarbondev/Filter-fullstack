import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { IMaskInput } from 'react-imask';
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation } from '@/store/api/userApi';
import {
  Button, Input, Select, Card, Table, Badge, Modal, ConfirmDialog,
} from '@/components/ui';
import type { User } from '@/lib/types';

const userSchema = z.object({
  phoneNumber: z.string().regex(/^998\d{9}$/, 'Enter full phone number'),
  password: z.string().min(8, 'Min 8 chars').regex(/[A-Z]/, 'Need uppercase').regex(/[0-9]/, 'Need number'),
  name: z.string().min(2, 'Min 2 characters'),
  role: z.enum(['ADMIN', 'CALL_MANAGER', 'CLIENT']).default('CLIENT'),
});

const roleVariant: Record<string, 'info' | 'success' | 'default'> = {
  ADMIN: 'info', CALL_MANAGER: 'success', CLIENT: 'default',
};

export default function UsersPage() {
  const { t } = useTranslation();
  const { data: users, isLoading } = useGetUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ phoneNumber: '', password: '', name: '', role: 'CLIENT' });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = userSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    try {
      await createUser({ ...result.data, phoneNumber: `+${result.data.phoneNumber}` }).unwrap();
      setModalOpen(false);
      setForm({ phoneNumber: '', password: '', name: '', role: 'CLIENT' });
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ phoneNumber: apiErr.data?.message || 'Failed to create user' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteUser(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('users.title')}</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>{t('users.addUser')}</Button>
      </div>

      <Card padding={false}>
        <Table<User>
          loading={isLoading}
          columns={[
            { key: 'name', header: t('common.name'), render: (u) => <span className="font-medium">{u.name}</span> },
            { key: 'phoneNumber', header: t('common.phone') },
            { key: 'role', header: t('common.role'), render: (u) => (
              <Badge variant={roleVariant[u.role] ?? 'default'}>{u.role}</Badge>
            )},
            { key: 'createdAt', header: t('common.createdAt'), render: (u) => new Date(u.createdAt).toLocaleDateString() },
            { key: 'actions', header: '', className: 'w-16', render: (u) => (
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(u.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )},
          ]}
          data={users ?? []}
          keyExtractor={(u) => u.id}
          emptyMessage={t('users.noUsers')}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t('users.createUser')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t('common.name')} value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">{t('auth.phoneNumber')}</label>
            <IMaskInput
              mask="+{998} (00) 000-00-00"
              value={form.phoneNumber}
              unmask={true}
              onAccept={(value: string) => set('phoneNumber', value)}
              placeholder="+998 (XX) XXX-XX-XX"
              className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
            />
            {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
          </div>
          <Input label={t('auth.password')} type="password" value={form.password} onChange={(e) => set('password', e.target.value)} error={errors.password} />
          <Select
            label={t('common.role')}
            options={[
              { value: 'CLIENT', label: t('users.roles.CLIENT') },
              { value: 'CALL_MANAGER', label: t('users.roles.CALL_MANAGER') },
              { value: 'ADMIN', label: t('users.roles.ADMIN') },
            ]}
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={creating}>{t('users.createUser')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('users.deleteUser')}
        message={t('users.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
