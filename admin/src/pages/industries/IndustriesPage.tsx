import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';
import {
  useGetIndustriesQuery, useCreateIndustryMutation, useUpdateIndustryMutation, useDeleteIndustryMutation,
} from '@/store/api/industryApi';
import {
  Button, Card, Table, Badge, Modal, ConfirmDialog, ImageUpload, Input,
} from '@/components/ui';
import { useLocale, tf } from '@/hooks/useLocale';
import type { Industry } from '@/lib/types';

const industrySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().min(1, 'Image is required'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export default function IndustriesPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: industries, isLoading } = useGetIndustriesQuery();
  const [createIndustry, { isLoading: creating }] = useCreateIndustryMutation();
  const [updateIndustry, { isLoading: updating }] = useUpdateIndustryMutation();
  const [deleteIndustry, { isLoading: deleting }] = useDeleteIndustryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', image: '', isActive: true, sortOrder: 0,
  });

  const resetForm = () => {
    setForm({ name: '', image: '', isActive: true, sortOrder: 0 });
    setErrors({});
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (i: Industry) => {
    setEditing(i);
    setForm({
      name: tf(i.name, locale),
      image: i.image,
      isActive: i.isActive,
      sortOrder: i.sortOrder,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = industrySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    try {
      if (editing) {
        await updateIndustry({ id: editing.id, data: result.data }).unwrap();
      } else {
        await createIndustry(result.data).unwrap();
      }
      setModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ name: apiErr.data?.message || t('common.failedToSave') });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('sidebar.industries')}</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>{t('common.add')}</Button>
      </div>

      <Card padding={false}>
        <Table<Industry>
          loading={isLoading}
          columns={[
            { key: 'image', header: t('common.image'), render: (i) => (
              <img src={i.image} alt="" className="h-12 w-20 rounded-lg object-cover" />
            )},
            { key: 'name', header: t('common.name'), render: (i) => tf(i.name, locale) },
            { key: 'sortOrder', header: t('common.order'), render: (i) => String(i.sortOrder) },
            { key: 'isActive', header: t('common.status'), render: (i) => (
              <Badge variant={i.isActive ? 'success' : 'default'}>{i.isActive ? t('common.active') : t('common.inactive')}</Badge>
            )},
            { key: 'actions', header: '', className: 'w-24', render: (i) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(i.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )},
          ]}
          data={industries ?? []}
          keyExtractor={(i) => i.id}
          emptyMessage={t('common.noData')}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('common.add')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('common.name')}
            placeholder="Enter in any language - auto translates"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
          />
          <ImageUpload value={form.image ? [form.image] : []} onChange={(urls) => set('image', urls[0] || '')} label={t('common.image')} error={errors.image} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('categories.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="rounded border-slate-300" />
                {t('common.active')}
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={creating || updating}>{editing ? t('common.update') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await deleteIndustry(deleteId); setDeleteId(null); } }}
        title={t('common.delete')}
        message={t('common.confirm')}
        loading={deleting}
      />
    </div>
  );
}
