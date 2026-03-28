import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';
import {
  useGetBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation,
} from '@/store/api/bannerApi';
import {
  Button, Input, Card, Table, Badge, Modal, ConfirmDialog, ImageUpload,
} from '@/components/ui';
import type { Banner } from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';

const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  image: z.string().min(1, 'Image URL is required'),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export default function BannersPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: banners, isLoading } = useGetBannersQuery();
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: deleting }] = useDeleteBannerMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '', subtitle: '', image: '', link: '', isActive: true, sortOrder: 0,
  });

  const resetForm = () => {
    setForm({ title: '', subtitle: '', image: '', link: '', isActive: true, sortOrder: 0 });
    setErrors({});
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: tf(b.title, locale),
      subtitle: tf(b.subtitle, locale),
      image: b.image,
      link: b.link ?? '',
      isActive: b.isActive,
      sortOrder: b.sortOrder,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const payload = { ...form, link: form.link || undefined };
    const result = bannerSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    try {
      if (editing) {
        await updateBanner({ id: editing.id, data: result.data }).unwrap();
      } else {
        await createBanner(result.data).unwrap();
      }
      setModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ title: apiErr.data?.message || 'Failed to save' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('banners.title')}</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>{t('banners.addBanner')}</Button>
      </div>

      <Card padding={false}>
        <Table<Banner>
          loading={isLoading}
          columns={[
            { key: 'image', header: t('banners.preview'), render: (b) => (
              <img src={b.image} alt="" className="h-12 w-20 rounded-lg object-cover" />
            )},
            { key: 'title', header: t('common.name'), render: (b) => (
              <div>
                <p className="font-medium">{tf(b.title, locale)}</p>
                <p className="text-xs text-slate-500">{tf(b.subtitle, locale)}</p>
              </div>
            )},
            { key: 'sortOrder', header: t('common.order'), render: (b) => String(b.sortOrder) },
            { key: 'isActive', header: t('common.status'), render: (b) => (
              <Badge variant={b.isActive ? 'success' : 'default'}>{b.isActive ? t('common.active') : t('common.inactive')}</Badge>
            )},
            { key: 'actions', header: '', className: 'w-24', render: (b) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(b.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )},
          ]}
          data={banners ?? []}
          keyExtractor={(b) => b.id}
          emptyMessage={t('banners.noBanners')}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('banners.editBanner') : t('banners.addBanner')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t('common.name')} value={form.title} onChange={(e) => set('title', e.target.value)} error={errors.title} placeholder={t('products.enterAnyLanguage')} />
          <Input label={t('banners.subtitle')} value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} error={errors.subtitle} />
          <ImageUpload value={form.image ? [form.image] : []} onChange={(urls) => set('image', urls[0] || '')} label={t('banners.imageUrl')} error={errors.image} />
          <Input label={t('banners.linkUrl')} value={form.link} onChange={(e) => set('link', e.target.value)} placeholder={t('banners.optional')} />
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
        onConfirm={async () => { if (deleteId) { await deleteBanner(deleteId); setDeleteId(null); } }}
        title={t('banners.deleteBanner')}
        message={t('banners.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
