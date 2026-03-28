import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { z } from 'zod';
import {
  useGetBlogsQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation,
} from '@/store/api/blogApi';
import {
  Button, Input, Textarea, Card, Table, Badge,
  Pagination, Modal, ConfirmDialog, ImageUpload,
} from '@/components/ui';
import type { Blog } from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export default function BlogsPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const { data: res, isLoading } = useGetBlogsQuery({ page, limit: 10 });
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();

  const blogs = res?.data ?? [];
  const meta = res?.meta;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '', content: '', image: '', isPublished: false,
  });

  const resetForm = () => {
    setForm({ title: '', content: '', image: '', isPublished: false });
    setErrors({});
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (blog: Blog) => {
    setEditing(blog);
    setForm({
      title: tf(blog.title, locale),
      content: tf(blog.content, locale),
      image: blog.image ?? '',
      isPublished: blog.isPublished,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = { ...form, image: form.image || undefined };
    const result = blogSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }

    try {
      if (editing) {
        await updateBlog({ id: editing.id, data: result.data }).unwrap();
      } else {
        await createBlog(result.data).unwrap();
      }
      setModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ title: apiErr.data?.message || 'Failed to save' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteBlog(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('blogs.title')}</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>{t('blogs.addBlog')}</Button>
      </div>

      <Card padding={false}>
        <Table<Blog>
          loading={isLoading}
          columns={[
            {
              key: 'title', header: t('common.name'),
              render: (b) => (
                <div>
                  <p className="font-medium text-slate-900 line-clamp-1">{tf(b.title, locale)}</p>
                </div>
              ),
            },
            { key: 'views', header: t('products.views'), render: (b) => String(b.views) },
            {
              key: 'isPublished', header: t('common.status'),
              render: (b) => (
                <Badge variant={b.isPublished ? 'success' : 'warning'}>
                  {b.isPublished ? t('blogs.published') : t('blogs.draft')}
                </Badge>
              ),
            },
            {
              key: 'createdAt', header: t('common.date'),
              render: (b) => new Date(b.createdAt).toLocaleDateString(),
            },
            {
              key: 'actions', header: '', className: 'w-32',
              render: (b) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setViewBlog(b)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(b.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={blogs}
          keyExtractor={(b) => b.id}
          emptyMessage={t('blogs.noBlogs')}
        />
        {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />}
      </Card>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('blogs.editBlog') : t('blogs.addBlog')} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Input label={t('blogs.blogTitle')} value={form.title} onChange={(e) => set('title', e.target.value)} error={errors.title} placeholder={t('products.enterAnyLanguage')} />
          <Textarea label={t('blogs.blogContent')} value={form.content} onChange={(e) => set('content', e.target.value)} error={errors.content} placeholder={t('products.enterAnyLanguage')} rows={10} />
          <ImageUpload value={form.image ? [form.image] : []} onChange={(urls) => set('image', urls[0] || '')} label={t('common.image')} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="rounded border-slate-300" />
            {t('blogs.published')}
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={creating || updating}>{editing ? t('common.update') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewBlog} onClose={() => setViewBlog(null)} title={tf(viewBlog?.title, locale)} size="xl">
        {viewBlog && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {viewBlog.image && <img src={viewBlog.image} alt="" className="w-full h-48 object-cover rounded-xl" />}
            <div className="grid grid-cols-3 gap-4">
              {(['en', 'ru', 'uz'] as const).map((lang) => (
                <div key={lang}>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">{lang}</p>
                  <p className="text-sm font-semibold">{viewBlog.title[lang]}</p>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{viewBlog.content[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('blogs.deleteBlog')}
        message={t('blogs.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
