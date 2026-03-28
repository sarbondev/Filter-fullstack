import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/productApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { Button, Input, Textarea, Select, ImageUpload } from '@/components/ui';
import type { Product } from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  price: z.number().min(0, 'Price must be positive'),
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0).default(0),
  tags: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

interface Props {
  product: Product | null;
  onSuccess: () => void;
}

export default function ProductForm({ product, onSuccess }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [form, setForm] = useState({
    name: tf(product?.name, locale),
    description: tf(product?.description, locale),
    shortDescription: tf(product?.shortDescription, locale),
    price: product?.price ?? 0,
    discountPercent: product?.discountPercent ?? 0,
    category: typeof product?.category === 'string'
      ? product.category
      : product?.category?.id ?? product?.category?._id ?? '',
    stock: product?.stock ?? 0,
    tags: tf(product?.tags, locale),
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    images: product?.images ?? [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories } = useGetCategoriesQuery();
  const [create, { isLoading: creating }] = useCreateProductMutation();
  const [update, { isLoading: updating }] = useUpdateProductMutation();

  const isLoading = creating || updating;

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const discountedPrice = form.discountPercent > 0
    ? Math.round(form.price * (1 - form.discountPercent / 100))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      images: form.images,
      discountPercent: form.discountPercent || undefined,
      tags: form.tags || undefined,
    };

    const result = productSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      if (product) {
        const updateData: Record<string, unknown> = { ...result.data, images: payload.images };
        // Only include translatable fields if they actually changed
        if (updateData.name === tf(product.name, locale)) delete updateData.name;
        if (updateData.description === tf(product.description, locale)) delete updateData.description;
        if (updateData.shortDescription === tf(product.shortDescription, locale)) delete updateData.shortDescription;
        if ((updateData.tags ?? '') === tf(product.tags, locale)) delete updateData.tags;
        await update({ id: product.id, data: updateData }).unwrap();
      } else {
        await create({ ...result.data, images: payload.images }).unwrap();
      }
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ name: apiErr.data?.message || 'Failed to save product' });
    }
  };

  const formatPrice = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <Input label={t('common.name')} value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder={t('products.enterAnyLanguage')} />
      <Input label={t('products.shortDescription')} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} error={errors.shortDescription} placeholder={t('products.enterAnyLanguage')} />
      <Textarea label={t('common.description')} value={form.description} onChange={(e) => set('description', e.target.value)} error={errors.description} placeholder={t('products.enterAnyLanguage')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label={t('common.price')} type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))} error={errors.price} />
        <div>
          <Input label={`${t('products.discountPrice')} (%)`} type="number" value={form.discountPercent} onChange={(e) => set('discountPercent', Math.min(100, Math.max(0, Number(e.target.value))))} placeholder="0" />
          {discountedPrice !== null && (
            <p className="mt-1 text-xs text-green-600">{formatPrice(discountedPrice)} UZS ({form.discountPercent}% off)</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Select label={t('common.category')} options={(categories ?? []).map((c) => ({ value: c.id, label: tf(c.name, locale) }))} value={form.category} onChange={(e) => set('category', e.target.value)} error={errors.category} placeholder="Select category" />
        <Input label={t('common.stock')} type="number" value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} error={errors.stock} />
        <Input label={t('products.tags')} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="filter, water, industrial" />
      </div>
      <ImageUpload value={form.images} onChange={(urls) => set('images', urls)} multiple label={t('products.images')} />
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="rounded border-slate-300" />
          {t('common.active')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="rounded border-slate-300" />
          {t('products.featured')}
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" loading={isLoading}>
          {product ? t('products.updateProduct') : t('products.createProduct')}
        </Button>
      </div>
    </form>
  );
}
